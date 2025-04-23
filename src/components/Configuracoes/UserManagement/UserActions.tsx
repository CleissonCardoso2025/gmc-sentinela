
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthorization } from '@/hooks/use-authorization';

interface UserActionsProps {
  onAddUser: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onAddUser }) => {
  const userProfile = localStorage.getItem('userProfile') || '';
  const { hasUserManagementPermission } = useAuthorization(userProfile);
  
  // Check if the user has permission to create users
  const canCreateUsers = hasUserManagementPermission('create');

  if (!canCreateUsers) {
    return null; // Don't show the button if user doesn't have permission
  }

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
