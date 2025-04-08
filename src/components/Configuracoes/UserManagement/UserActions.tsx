
import React from 'react';
import { Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserActionsProps {
  onAddUser: () => void;
  onOpenAccessControl?: () => void; // Make this optional so existing usages still work
}

const UserActions: React.FC<UserActionsProps> = ({ onAddUser, onOpenAccessControl }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAddUser} className="gap-1">
        <Plus className="h-4 w-4" />
        Novo Usuário
      </Button>
      
      {onOpenAccessControl && (
        <Button onClick={onOpenAccessControl} variant="outline" className="gap-1">
          <Shield className="h-4 w-4" />
          Controle de Acesso
        </Button>
      )}
    </div>
  );
};

export default UserActions;
