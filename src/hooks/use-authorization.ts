import { useEffect, useState } from 'react';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Get page access settings from local storage or default settings
const getPageAccessSettings = (): PageAccess[] => {
  const storedSettings = localStorage.getItem('pageAccessSettings');
  
  if (storedSettings) {
    try {
      return JSON.parse(storedSettings) as PageAccess[];
    } catch (error) {
      console.error('Error parsing stored page access settings:', error);
    }
  }
  
  // Default settings if nothing is stored
  return [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', allowedProfiles: ['Inspetor', 'Supervisor', 'Corregedor', 'Agente'] },
    { id: 'viaturas', name: 'Viaturas', path: '/viaturas', allowedProfiles: ['Inspetor', 'Subinspetor', 'Supervisor'] },
    { id: 'inspetoria', name: 'Inspetoria', path: '/inspetoria', allowedProfiles: ['Inspetor', 'Subinspetor'] },
    { id: 'ocorrencias', name: 'Ocorrências', path: '/ocorrencias', allowedProfiles: ['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente'] },
    { id: 'corregedoria', name: 'Corregedoria', path: '/corregedoria', allowedProfiles: ['Inspetor', 'Corregedor'] },
    { id: 'configuracoes', name: 'Configurações', path: '/configuracoes', allowedProfiles: ['Inspetor'] },
    { id: 'perfil', name: 'Perfil', path: '/perfil', allowedProfiles: ['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente'] },
    { id: 'index', name: 'Centro de Comando', path: '/index', allowedProfiles: ['Inspetor', 'Subinspetor'] },
  ];
};

// Usuários especiais com perfis específicos
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

// Usuários identificados por email
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
  
  // Carrega o ID do usuário atual e email
  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userId) {
      setCurrentUserId(userId);
    }
    
    if (userEmail) {
      setCurrentUserEmail(userEmail);
    }
    
    // Verifica se o usuário tem um perfil específico designado por ID
    const specialUser = SPECIAL_USERS.find(u => u.userId === userId);
    if (specialUser) {
      setEffectiveProfile(specialUser.specificProfile);
    } 
    // Ou verifica se o usuário tem um perfil específico designado por email
    else if (userEmail) {
      const emailUser = EMAIL_USERS.find(u => u.email === userEmail);
      if (emailUser) {
        setEffectiveProfile(emailUser.specificProfile);
      } else {
        setEffectiveProfile(userProfile);
      }
    } else {
      setEffectiveProfile(userProfile);
    }
  }, [userProfile]);
  
  // Load page access settings on component mount
  useEffect(() => {
    setPageAccessSettings(getPageAccessSettings());
    setIsLoading(false);
  }, []);
  
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
      // If page isn't in the settings, default to restricted
      return false;
    }
    
    return page.allowedProfiles.includes(effectiveProfile as any);
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
      page.allowedProfiles.includes(effectiveProfile as any)
    );
  };
  
  // Save updated page access settings
  const updatePageAccess = (pages: PageAccess[]) => {
    try {
      // Update state
      setPageAccessSettings(pages);
      
      // Persist to local storage
      localStorage.setItem('pageAccessSettings', JSON.stringify(pages));
      
      toast.success("As permissões de acesso foram atualizadas com sucesso");
      return true;
    } catch (error) {
      console.error('Error updating page access settings:', error);
      toast.error("Erro ao salvar as permissões de acesso");
      return false;
    }
  };
  
  return {
    hasAccessToPage,
    getAccessiblePages,
    updatePageAccess,
    pageAccessSettings,
    isLoading
  };
};
