
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';
import { authConfig } from '../config/authConfig';

export const checkSpecialAccess = (userId: string | null, userEmail: string | null): string | null => {
  if (userId && authConfig.SPECIAL_USERS.find(u => u.userId === userId)) {
    return 'Inspetor';
  }
  if (userEmail && authConfig.EMAIL_USERS.find(u => u.email === userEmail)) {
    return 'Inspetor';
  }
  return null;
};

export const getDefaultPageAccessSettings = (): PageAccess[] => {
  return [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', allowedProfiles: ['Inspetor'] },
    { id: 'viaturas', name: 'Viaturas', path: '/viaturas', allowedProfiles: ['Inspetor'] },
    { id: 'inspetoria', name: 'Inspetoria', path: '/inspetoria', allowedProfiles: ['Inspetor'] },
    { id: 'ocorrencias', name: 'Ocorrências', path: '/ocorrencias', allowedProfiles: ['Inspetor'] },
    { id: 'corregedoria', name: 'Corregedoria', path: '/corregedoria', allowedProfiles: ['Inspetor'] },
    { id: 'configuracoes', name: 'Configurações', path: '/configuracoes', allowedProfiles: ['Inspetor'] },
    { id: 'perfil', name: 'Perfil', path: '/perfil', allowedProfiles: ['Inspetor'] },
    { id: 'index', name: 'Centro de Comando', path: '/index', allowedProfiles: ['Inspetor', 'Subinspetor'] },
  ];
};

export const checkPathAccess = (
  path: string, 
  effectiveProfile: string, 
  pageAccessSettings: PageAccess[]
): boolean => {
  if (effectiveProfile === 'Inspetor') {
    return true;
  }

  if (path === '/index') {
    return effectiveProfile === 'Inspetor' || effectiveProfile === 'Subinspetor';
  }

  const basePath = '/' + path.split('/')[1];
  const page = pageAccessSettings.find(p => p.path === basePath);

  if (!page) {
    return pageAccessSettings.length === 0;
  }

  if (page.allowedProfiles.length === 0) {
    return effectiveProfile === 'Inspetor';
  }

  return page.allowedProfiles.includes(effectiveProfile);
};
