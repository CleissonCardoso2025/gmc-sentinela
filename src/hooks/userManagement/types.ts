
import { User } from "@/types/database";
import { UserFormData } from "@/components/Configuracoes/UserManagement/types";
import { PageAccess } from "@/components/Configuracoes/PageAccessControl";

// Define PageAccessSettings as an alias for PageAccess[]
export type PageAccessSettings = PageAccess[];

export interface UserManagementHook {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  profileFilter: string;
  setProfileFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  showUserDialog: boolean;
  setShowUserDialog: (show: boolean) => void;
  showAccessDialog: boolean;
  setShowAccessDialog: (show: boolean) => void;
  editingUser: UserFormData | null;
  userToDelete: string | null;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  handleCreateUser: (data: UserFormData) => Promise<void>;
  handleUpdateUser: (data: UserFormData) => Promise<void>;
  handleEditUser: (user: User) => void;
  handleToggleStatus: (userId: string) => Promise<void>;
  handleDeleteUser: (userId: string) => void;
  confirmDeleteUser: () => Promise<void>;
  handleAddNewUser: () => void;
  handleCloseUserDialog: () => void;
  handleOpenAccessControl: () => void;
  handleSavePageAccess: (settings: PageAccessSettings) => Promise<void>;
  pageAccessSettings: PageAccessSettings;
  isLoadingAccess: boolean;
  refetchUsers: () => Promise<void>;
}
