
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageAccessControl from '@/components/Configuracoes/PageAccessControl';
import { PageAccessSettings } from '@/hooks/userManagement/types';

interface AccessControlDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pageAccessSettings: PageAccessSettings;
  isLoading: boolean;
  onSave: (pages: PageAccessSettings) => Promise<void>;
}

const AccessControlDialog: React.FC<AccessControlDialogProps> = ({
  isOpen,
  onOpenChange,
  pageAccessSettings,
  isLoading,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões de Acesso</DialogTitle>
        </DialogHeader>
        <PageAccessControl 
          initialPages={pageAccessSettings}
          isLoading={isLoading}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AccessControlDialog;
