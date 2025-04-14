
import { useEffect, useState } from 'react';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Função que retorna um array vazio de configurações de acesso
const getPageAccessSettings = (): PageAccess[] => {
  return [];
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
    
    // Limpa qualquer configuração salva anteriormente no localStorage
    localStorage.removeItem('pageAccessSettings');
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
      // Se não encontrar a página nas configurações e as configurações estão vazias, permitir acesso
      // para não bloquear todos os usuários enquanto as configurações estão sendo reconfiguradas
      return pageAccessSettings.length === 0;
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
