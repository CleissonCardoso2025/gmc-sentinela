
import { useState } from 'react';
import { useAuthorization } from '@/hooks/use-authorization';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';

export const useAccessControl = (userProfile: string) => {
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const { pageAccessSettings, updatePageAccess, isLoading: isLoadingAccess } = useAuthorization(userProfile);

  const handleOpenAccessControl = () => {
    setShowAccessDialog(true);
  };

  const handleSavePageAccess = (pages: PageAccess[]) => {
    const success = updatePageAccess(pages);
    if (success) {
      setShowAccessDialog(false);
    }
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
