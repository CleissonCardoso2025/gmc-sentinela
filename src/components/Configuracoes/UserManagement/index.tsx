
import React from 'react';
import { useAuthorization } from '@/hooks/use-authorization';
import { useUserManagement } from '@/hooks/userManagement';
import UserTable from '@/components/Configuracoes/UserTable';
import UserFilters from './UserFilters';
import UserActions from './UserActions';
import UserFormDialog from './UserFormDialog';
import UserDeleteDialog from './UserDeleteDialog';
import AccessControlDialog from './AccessControlDialog';

const UserManagement = () => {
  const {
    filteredUsers,
    isLoading,
    searchTerm,
    setSearchTerm,
    profileFilter,
    setProfileFilter,
    statusFilter,
    setStatusFilter,
    showUserDialog,
    setShowUserDialog,
    showAccessDialog,
    setShowAccessDialog,
    editingUser,
    showDeleteDialog,
    setShowDeleteDialog,
    handleCreateUser,
    handleUpdateUser,
    handleEditUser,
    handleToggleStatus,
    handleDeleteUser,
    confirmDeleteUser,
    handleAddNewUser,
    handleCloseUserDialog,
    pageAccessSettings,
    isLoadingAccess,
    handleOpenAccessControl,
    handleSavePageAccess
  } = useUserManagement();

  const mockCurrentUserProfile = {
    perfil: 'Inspetor'
  };

  const userProfile = mockCurrentUserProfile.perfil;
  const hasAccess = userProfile === 'Inspetor';

  if (!hasAccess) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
        <h3 className="font-semibold text-lg">Acesso Restrito</h3>
        <p>Você não tem permissão para acessar esta página. Esta funcionalidade é restrita para usuários com perfil de Inspetor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <UserFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          profileFilter={profileFilter}
          onProfileFilterChange={setProfileFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <UserActions 
          onAddUser={handleAddNewUser}
          onOpenAccessControl={handleOpenAccessControl}
        />
      </div>

      <UserTable 
        users={filteredUsers} 
        onEdit={handleEditUser} 
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
        isLoading={isLoading}
      />

      <UserFormDialog 
        isOpen={showUserDialog}
        onOpenChange={setShowUserDialog}
        editingUser={editingUser}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        onCancel={handleCloseUserDialog}
      />

      <AccessControlDialog 
        isOpen={showAccessDialog}
        onOpenChange={setShowAccessDialog}
        pageAccessSettings={pageAccessSettings}
        isLoading={isLoadingAccess}
        onSave={handleSavePageAccess}
      />

      <UserDeleteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

export default UserManagement;
