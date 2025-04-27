import React from 'react';
import { useUserManagement } from '@/hooks/userManagement';
import UserTable from '@/components/Configuracoes/UserTable';
import UserFilters from './UserFilters';
import UserActions from './UserActions';
import UserFormDialog from './UserFormDialog';
import UserDeleteDialog from './UserDeleteDialog';

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
  } = useUserManagement();

  // Get the user profile from localStorage
  const userProfile = localStorage.getItem('userProfile') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  // Permissão simplificada - sempre verdadeiro para usuários autenticados
  const hasUserManagementPermission = true;
  
  // Check if the user has permission to view and manage users
  const canViewUsers = hasUserManagementPermission;

  if (!canViewUsers) {
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

      <UserDeleteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

export default UserManagement;
