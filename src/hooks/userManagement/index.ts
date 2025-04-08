
import { useUserData } from './useUserData';
import { useUserFilters } from './useUserFilters';
import { useUserActions } from './useUserActions';
import { useAccessControl } from './useAccessControl';
import { UserManagementHook } from './types';

export const useUserManagement = (): UserManagementHook => {
  // Mock current user profile - This would come from authentication in a real app
  const mockCurrentUserProfile = {
    perfil: 'Inspetor'
  };
  const userProfile = mockCurrentUserProfile.perfil;

  // Combine all the hooks
  const { users, setUsers, isLoading, refetchUsers } = useUserData();
  
  const { 
    filteredUsers, 
    searchTerm, 
    setSearchTerm, 
    profileFilter, 
    setProfileFilter, 
    statusFilter, 
    setStatusFilter 
  } = useUserFilters(users);
  
  const {
    showUserDialog,
    setShowUserDialog,
    editingUser,
    userToDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    handleCreateUser,
    handleUpdateUser,
    handleEditUser,
    handleToggleStatus,
    handleDeleteUser,
    confirmDeleteUser,
    handleAddNewUser,
    handleCloseUserDialog
  } = useUserActions(users, setUsers, refetchUsers);
  
  const {
    showAccessDialog,
    setShowAccessDialog,
    pageAccessSettings,
    isLoadingAccess,
    handleOpenAccessControl,
    handleSavePageAccess
  } = useAccessControl(userProfile);

  // Return all state and functions combined
  return {
    users,
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
    userToDelete,
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
    handleOpenAccessControl,
    handleSavePageAccess,
    pageAccessSettings,
    isLoadingAccess,
    refetchUsers
  };
};

export * from './types';
