
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserActionsProps {
  onAddUser: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onAddUser }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAddUser} className="gap-1">
        <Plus className="h-4 w-4" />
        Novo Usuário
      </Button>
    </div>
  );
};

export default UserActions;
