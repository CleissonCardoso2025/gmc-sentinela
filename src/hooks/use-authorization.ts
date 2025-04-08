
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
    { id: 'index', name: 'Index', path: '/index', allowedProfiles: ['Inspetor', 'Subinspetor'] },
  ];
};

export const useAuthorization = (userProfile: string) => {
  const [pageAccessSettings, setPageAccessSettings] = useState<PageAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load page access settings on component mount
  useEffect(() => {
    setPageAccessSettings(getPageAccessSettings());
    setIsLoading(false);
  }, []);
  
  // Check if user has access to a specific page based on path
  const hasAccessToPage = (path: string): boolean => {
    // If user is Inspetor, allow access to all pages
    if (userProfile === 'Inspetor') {
      return true;
    }
    
    // Extract the base path (e.g., /ocorrencias/123 -> /ocorrencias)
    const basePath = '/' + path.split('/')[1];
    
    const page = pageAccessSettings.find(p => p.path === basePath);
    
    if (!page) {
      // If page isn't in the settings, default to restricted
      return false;
    }
    
    return page.allowedProfiles.includes(userProfile as any);
  };
  
  // Get list of pages that the current user has access to
  const getAccessiblePages = (): PageAccess[] => {
    // If user is Inspetor, return all pages
    if (userProfile === 'Inspetor') {
      return pageAccessSettings;
    }
    
    return pageAccessSettings.filter(page => 
      page.allowedProfiles.includes(userProfile as any)
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
