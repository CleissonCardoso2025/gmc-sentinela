
import { useState } from 'react';
import { useAuthorization } from '@/hooks/use-authorization';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';
import { PageAccessSettings } from './types';
import { toast } from 'sonner';

export const useAccessControl = (userProfile: string) => {
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const { pageAccessSettings, updatePageAccess, isLoading: isLoadingAccess } = useAuthorization(userProfile);

  const handleOpenAccessControl = () => {
    // Only allow Inspetores to access the control panel
    if (userProfile !== 'Inspetor') {
      toast.error('Apenas Inspetores podem gerenciar permissões de acesso');
      return;
    }
    setShowAccessDialog(true);
  };

  const handleSavePageAccess = async (pages: PageAccessSettings): Promise<void> => {
    try {
      const success = updatePageAccess(pages);
      if (success) {
        setShowAccessDialog(false);
        toast.success('Permissões de acesso atualizadas com sucesso');
      } else {
        toast.error('Erro ao atualizar permissões de acesso');
      }
    } catch (error) {
      console.error('Error saving page access:', error);
      toast.error('Erro ao salvar permissões de acesso');
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
