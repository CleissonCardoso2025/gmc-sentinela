
import { useEffect, useState } from 'react';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchPageAccess, savePageAccessSettings, getAllRoles } from '@/services/pageAccessService';
import { checkSpecialAccess, getDefaultPageAccessSettings, checkPathAccess } from '@/features/auth/utils/authorizationUtils';

export const useAuthorization = (userProfile: string) => {
  const [pageAccessSettings, setPageAccessSettings] = useState<PageAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [effectiveProfile, setEffectiveProfile] = useState<string>(userProfile);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (!data.session) {
        console.warn('User is not authenticated. Some features may be restricted.');
      }
    };
    
    checkAuth();
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const roles = await getAllRoles();
        setAvailableRoles(roles);
        
        const accessSettings = await fetchPageAccess();
        setPageAccessSettings(accessSettings.length > 0 ? accessSettings : getDefaultPageAccessSettings());
      } catch (error) {
        console.error('Error fetching access data:', error);
        toast.error('Erro ao carregar configurações de acesso');
        setPageAccessSettings(getDefaultPageAccessSettings());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page_access' }, fetchData)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    setCurrentUserId(userId);
    setCurrentUserEmail(userEmail);
    
    const specialProfile = checkSpecialAccess(userId, userEmail);
    if (specialProfile) {
      setEffectiveProfile(specialProfile);
      localStorage.setItem('userProfile', specialProfile);
    } else {
      setEffectiveProfile(userProfile);
    }
  }, [userProfile]);

  const hasAccessToPage = (path: string): boolean => {
    if (!isAuthenticated) {
      // Allow access to login and reset password pages even when not authenticated
      if (path === '/login' || path === '/reset-password') {
        return true;
      }
      return false;
    }
    return checkPathAccess(path, effectiveProfile, pageAccessSettings);
  };

  const getAccessiblePages = (): PageAccess[] => {
    if (!isAuthenticated) return [];
    
    if (effectiveProfile === 'Inspetor') {
      return pageAccessSettings;
    }
    return pageAccessSettings.filter(page => page.allowedProfiles.includes(effectiveProfile));
  };

  const hasUserManagementPermission = (permission: 'view' | 'create' | 'update' | 'delete'): boolean => {
    if (!isAuthenticated) return false;
    return effectiveProfile === 'Inspetor';
  };

  const updatePageAccess = async (pages: PageAccess[]): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar autenticado para esta ação");
      return false;
    }
    
    try {
      setIsLoading(true);
      setPageAccessSettings(pages);
      
      const success = await savePageAccessSettings(pages);
      
      if (success) {
        toast.success("As permissões de acesso foram atualizadas com sucesso");
        return true;
      } else {
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
    availableRoles,
    hasUserManagementPermission,
    isAuthenticated
  };
};
