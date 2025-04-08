
import { useState } from 'react';
import { useAuthorization } from '@/hooks/use-authorization';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';
import { PageAccessSettings } from './types';

export const useAccessControl = (userProfile: string) => {
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const { pageAccessSettings, updatePageAccess, isLoading: isLoadingAccess } = useAuthorization(userProfile);

  const handleOpenAccessControl = () => {
    setShowAccessDialog(true);
  };

  const handleSavePageAccess = async (pages: PageAccessSettings): Promise<void> => {
    const success = updatePageAccess(pages);
    if (success) {
      setShowAccessDialog(false);
    }
    return Promise.resolve();
  };

  return {
    showAccessDialog,
    setShowAccessDialog,
    pageAccessSettings,
    isLoadingAccess,
    handleOpenAccessControl,
    handleSavePageAccess
  };
};
