
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/database';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';
import { createUser, updateUser, deleteUser, toggleUserStatus } from '@/services/userService/apiUserService';

export const useUserActions = (
  users: User[],
  setUsers: (users: User[] | ((prevUsers: User[]) => User[])) => void,
  refetchUsers: () => Promise<void>
) => {
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateUser = async (userData: UserFormData) => {
    try {
      if (!userData.nome || !userData.email || !userData.perfil) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome, email e perfil são obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      const newUser = await createUser(userData);
      if (newUser) {
        await refetchUsers();
        setShowUserDialog(false);
        toast({
          title: "Usuário criado",
          description: `${userData.nome} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userData: UserFormData) => {
    if (!userData.id) return;

    try {
      const updatedUser = await updateUser(userData as User);
      if (updatedUser) {
        await refetchUsers();
        setShowUserDialog(false);
        toast({
          title: "Usuário atualizado",
          description: `Dados de ${userData.nome || "usuário"} atualizados.`,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    const userFormData: UserFormData = {
      id: user.id,
      nome: user.user_metadata?.nome || user.nome || '',
      email: user.email,
      matricula: user.user_metadata?.matricula || user.matricula || '',
      data_nascimento: user.user_metadata?.data_nascimento || user.data_nascimento || '',
      perfil: user.user_metadata?.role || user.perfil || 'Agente',
      status: user.user_metadata?.status ?? user.status ?? true,
    };

    setEditingUser(userFormData);
    setShowUserDialog(true);
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const currentStatus = user.user_metadata?.status ?? user.status ?? true;
      const updatedUser = await toggleUserStatus(userId, currentStatus);
      
      if (updatedUser) {
        await refetchUsers();
        const userName = user.user_metadata?.nome || user.nome || '';
        const newStatus = updatedUser.user_metadata?.status;
        
        toast({
          title: "Status atualizado",
          description: `Usuário ${userName} foi ${newStatus ? 'ativado' : 'desativado'}.`,
        });
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const userToRemove = users.find(u => u.id === userToDelete);
      const success = await deleteUser(userToDelete);

      if (success) {
        await refetchUsers();
        setShowDeleteDialog(false);
        setUserToDelete(null);
        const userName = userToRemove?.user_metadata?.nome || userToRemove?.nome || 'Usuário';
        toast({
          title: "Usuário excluído",
          description: `${userName} excluído com sucesso.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleAddNewUser = () => {
    setEditingUser(null);
    setShowUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setShowUserDialog(false);
    setEditingUser(null);
  };

  return {
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
    handleCloseUserDialog,
  };
};
