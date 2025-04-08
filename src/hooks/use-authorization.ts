
import { useEffect, useState } from 'react';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';

// This would normally come from an API or local storage
const getPageAccessSettings = (): PageAccess[] => {
  // This is a mock implementation that would be replaced with actual data
  // The real implementation would fetch from a database or local storage
  return [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', allowedProfiles: ['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente'] },
    { id: 'viaturas', name: 'Viaturas', path: '/viaturas', allowedProfiles: ['Inspetor', 'Subinspetor', 'Supervisor'] },
    { id: 'inspetoria', name: 'Inspetoria', path: '/inspetoria', allowedProfiles: ['Inspetor', 'Subinspetor'] },
    { id: 'rh', name: 'Recursos Humanos', path: '/rh', allowedProfiles: ['Inspetor'] },
    { id: 'ocorrencias', name: 'Ocorrências', path: '/ocorrencias', allowedProfiles: ['Inspetor', 'Subinspetor', 'Supervisor', 'Agente'] },
    { id: 'corregedoria', name: 'Corregedoria', path: '/corregedoria', allowedProfiles: ['Inspetor', 'Corregedor'] },
    { id: 'configuracoes', name: 'Configurações', path: '/configuracoes', allowedProfiles: ['Inspetor'] },
  ];
};

export const useAuthorization = (userProfile: string) => {
  const [pageAccessSettings, setPageAccessSettings] = useState<PageAccess[]>([]);
  
  useEffect(() => {
    // This would fetch the actual settings from an API or local storage
    setPageAccessSettings(getPageAccessSettings());
  }, []);
  
  const hasAccessToPage = (path: string): boolean => {
    // Extract the base path (e.g., /ocorrencias/123 -> /ocorrencias)
    const basePath = '/' + path.split('/')[1];
    
    const page = pageAccessSettings.find(p => p.path === basePath);
    
    if (!page) {
      // If page isn't in the settings, default to restricted
      return false;
    }
    
    return page.allowedProfiles.includes(userProfile as any);
  };
  
  const getAccessiblePages = (): PageAccess[] => {
    return pageAccessSettings.filter(page => 
      page.allowedProfiles.includes(userProfile as any)
    );
  };
  
  const updatePageAccess = (pages: PageAccess[]) => {
    // In a real app, this would save to an API
    // For this example, we just update the local state
    setPageAccessSettings(pages);
    
    // This could also update local storage
    // localStorage.setItem('pageAccessSettings', JSON.stringify(pages));
  };
  
  return {
    hasAccessToPage,
    getAccessiblePages,
    updatePageAccess,
    pageAccessSettings
  };
};
