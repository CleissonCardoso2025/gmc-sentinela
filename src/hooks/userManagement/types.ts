
import { User } from '@/types/database';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';

export interface UserManagementState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  searchTerm: string;
  profileFilter: string;
  statusFilter: string;
  showUserDialog: boolean;
  showAccessDialog: boolean;
  editingUser: UserFormData | null;
  userToDelete: string | null;
  showDeleteDialog: boolean;
  pageAccessSettings: PageAccess[];
  isLoadingAccess: boolean;
}

export interface UserManagementActions {
  setSearchTerm: (term: string) => void;
  setProfileFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setShowUserDialog: (show: boolean) => void;
  setShowAccessDialog: (show: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
  handleCreateUser: (userData: UserFormData) => Promise<void>;
  handleUpdateUser: (userData: UserFormData) => Promise<void>;
  handleEditUser: (user: User) => void;
  handleToggleStatus: (userId: string) => Promise<void>;
  handleDeleteUser: (userId: string) => void;
  confirmDeleteUser: () => Promise<void>;
  handleAddNewUser: () => void;
  handleCloseUserDialog: () => void;
  handleOpenAccessControl: () => void;
  handleSavePageAccess: (pages: PageAccess[]) => void;
}

export type UserManagementHook = UserManagementState & UserManagementActions;
