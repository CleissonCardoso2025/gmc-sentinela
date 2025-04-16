import { useEffect, useState } from 'react';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchPageAccess, savePageAccessSettings, getAllRoles } from '@/services/pageAccessService';

// Function to return default page access settings
const getDefaultPageAccessSettings = (): PageAccess[] => {
  // Default settings if nothing is stored - starting with empty allowedProfiles
  return [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', allowedProfiles: [] },
    { id: 'viaturas', name: 'Viaturas', path: '/viaturas', allowedProfiles: [] },
    { id: 'inspetoria', name: 'Inspetoria', path: '/inspetoria', allowedProfiles: [] },
    { id: 'ocorrencias', name: 'Ocorrências', path: '/ocorrencias', allowedProfiles: [] },
    { id: 'corregedoria', name: 'Corregedoria', path: '/corregedoria', allowedProfiles: [] },
    { id: 'configuracoes', name: 'Configurações', path: '/configuracoes', allowedProfiles: [] },
    { id: 'perfil', name: 'Perfil', path: '/perfil', allowedProfiles: [] },
    { id: 'index', name: 'Centro de Comando', path: '/index', allowedProfiles: [] },
  ];
};

// Special users with specific profiles
interface SpecialUser {
  userId: string;
  specificProfile: string;
}

const SPECIAL_USERS: SpecialUser[] = [
  {
    userId: 'e632890d-208e-489b-93a3-eae0dd0a9a08',
    specificProfile: 'Inspetor'
  }
];

// Users identified by email
interface EmailUser {
  email: string;
  specificProfile: string;
}

const EMAIL_USERS: EmailUser[] = [
  {
    email: "gcmribeiradopombal@hotmail.com",
    specificProfile: "Inspetor"
  }
];

export const useAuthorization = (userProfile: string) => {
  const [pageAccessSettings, setPageAccessSettings] = useState<PageAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [effectiveProfile, setEffectiveProfile] = useState<string>(userProfile);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  
  // Load roles and page access settings from the database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch roles directly using the RPC function
        const { data: rolesData, error: rolesError } = await supabase.rpc('get_all_user_roles');
        
        if (rolesError) {
          console.error('Error fetching roles with RPC:', rolesError);
          // Fallback to service function if RPC fails
          const roles = await getAllRoles();
          setAvailableRoles(roles);
        } else {
          // Extract just the role names from the returned objects
          const roleNames = rolesData ? rolesData.map(item => item.role) : [];
          // Filter out undefined or null values and remove duplicates
          setAvailableRoles([...new Set(roleNames.filter(Boolean))]);
        }
        
        // Fetch page access settings
        const accessSettings = await fetchPageAccess();
        
        if (accessSettings.length > 0) {
          setPageAccessSettings(accessSettings);
        } else {
          // If no settings found, use defaults
          setPageAccessSettings(getDefaultPageAccessSettings());
        }
      } catch (error) {
        console.error('Error fetching access data:', error);
        toast.error('Erro ao carregar configurações de acesso');
        // Use default settings in case of error
        setPageAccessSettings(getDefaultPageAccessSettings());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription for page_access table changes
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'page_access' 
        }, 
        () => {
          // Refetch access settings when changes occur
          fetchData();
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Load the current user ID and email
  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userId) {
      setCurrentUserId(userId);
    }
    
    if (userEmail) {
      setCurrentUserEmail(userEmail);
    }
    
    // Check if the user has a specific profile designated by ID
    const specialUser = SPECIAL_USERS.find(u => u.userId === userId);
    if (specialUser) {
      setEffectiveProfile(specialUser.specificProfile);
      // Also update localStorage so other parts of the app know
      localStorage.setItem('userProfile', specialUser.specificProfile);
    } 
    // Or check if the user has a specific profile designated by email
    else if (userEmail) {
      const emailUser = EMAIL_USERS.find(u => u.email === userEmail);
      if (emailUser) {
        setEffectiveProfile(emailUser.specificProfile);
        // Also update localStorage so other parts of the app know
        localStorage.setItem('userProfile', emailUser.specificProfile);
      } else {
        setEffectiveProfile(userProfile);
      }
    } else {
      setEffectiveProfile(userProfile);
    }
  }, [userProfile]);
  
  // Check if user has access to a specific page based on path
  const hasAccessToPage = (path: string): boolean => {
    // If user is a special Inspetor through userId, allow access to all pages
    if (currentUserId && SPECIAL_USERS.find(u => u.userId === currentUserId)?.specificProfile === 'Inspetor') {
      return true;
    }
    
    // If user is a special Inspetor through email, allow access to all pages
    if (currentUserEmail && EMAIL_USERS.find(u => u.email === currentUserEmail)?.specificProfile === 'Inspetor') {
      return true;
    }
    
    // If user's effective profile is Inspetor, allow access to all pages
    if (effectiveProfile === 'Inspetor') {
      return true;
    }
    
    // Special case for /index page - only Inspetor or Subinspetor can access
    if (path === '/index') {
      return effectiveProfile === 'Inspetor' || effectiveProfile === 'Subinspetor';
    }
    
    // Extract the base path (e.g., /ocorrencias/123 -> /ocorrencias)
    const basePath = '/' + path.split('/')[1];
    
    const page = pageAccessSettings.find(p => p.path === basePath);
    
    if (!page) {
      // If the page isn't found in settings and settings are empty, allow access
      // to avoid blocking all users while settings are being reconfigured
      return pageAccessSettings.length === 0;
    }
    
    // If no profiles are allowed yet (empty configuration), only allow Inspetor access for configuration
    if (page.allowedProfiles.length === 0) {
      return effectiveProfile === 'Inspetor';
    }
    
    return page.allowedProfiles.includes(effectiveProfile);
  };
  
  // Get list of pages that the current user has access to
  const getAccessiblePages = (): PageAccess[] => {
    // If user is a special Inspetor through userId, return all pages
    if (currentUserId && SPECIAL_USERS.find(u => u.userId === currentUserId)?.specificProfile === 'Inspetor') {
      return pageAccessSettings;
    }
    
    // If user is a special Inspetor through email, return all pages
    if (currentUserEmail && EMAIL_USERS.find(u => u.email === currentUserEmail)?.specificProfile === 'Inspetor') {
      return pageAccessSettings;
    }
    
    // If user's effective profile is Inspetor, return all pages
    if (effectiveProfile === 'Inspetor') {
      return pageAccessSettings;
    }
    
    return pageAccessSettings.filter(page => 
      page.allowedProfiles.includes(effectiveProfile)
    );
  };
  
  // Save updated page access settings
  const updatePageAccess = async (pages: PageAccess[]): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Update state optimistically 
      setPageAccessSettings(pages);
      
      // Save to Supabase
      const success = await savePageAccessSettings(pages);
      
      if (success) {
        toast.success("As permissões de acesso foram atualizadas com sucesso");
        return true;
      } else {
        // If save fails, revert optimistic update
        const currentSettings = await fetchPageAccess();
        setPageAccessSettings(currentSettings);
        toast.error("Erro ao salvar as permissões de acesso no banco de dados");
        return false;
      }
    } catch (error) {
      console.error('Error updating page access settings:', error);
      toast.error("Erro ao salvar as permissões de acesso");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    hasAccessToPage,
    getAccessiblePages,
    updatePageAccess,
    pageAccessSettings,
    isLoading,
    availableRoles
  };
};
