
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/database';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';
import { createUser, updateUser, deleteUser, toggleUserStatus } from '@/services/userService/apiUserService';

export const useUserActions = (users: User[], setUsers: (users: User[]) => void) => {
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  
  const handleCreateUser = async (userData: UserFormData) => {
    try {
      const newUser = await createUser(userData);
      if (newUser) {
        setUsers([...users, newUser]);
        setShowUserDialog(false);
        toast({
          title: "Usuário criado",
          description: `${newUser.nome} foi adicionado com sucesso.`
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (userData: UserFormData) => {
    if (!userData.id) return;
    
    try {
      const updatedUser = await updateUser(userData as User);
      if (updatedUser) {
        setUsers(prev => 
          prev.map(user => user.id === updatedUser.id ? updatedUser : user)
        );
        setShowUserDialog(false);
        toast({
          title: "Usuário atualizado",
          description: `Os dados de ${updatedUser.nome} foram atualizados.`
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível atualizar o usuário. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (user: User) => {
    const userFormData: UserFormData = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      matricula: user.matricula || '',
      data_nascimento: user.data_nascimento || '',
      perfil: user.perfil,
      status: user.status
    };
    
    setEditingUser(userFormData);
    setShowUserDialog(true);
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const updatedUser = await toggleUserStatus(userId, user.status);
      if (updatedUser) {
        setUsers(prev => 
          prev.map(u => u.id === userId ? updatedUser : u)
        );
        
        toast({
          title: user.status ? "Usuário desativado" : "Usuário ativado",
          description: `${user.nome} foi ${user.status ? "desativado" : "ativado"} com sucesso.`
        });
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do usuário. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const userToRemove = users.find(u => u.id === userToDelete);
        const success = await deleteUser(userToDelete);
        
        if (success) {
          setUsers(users.filter(user => user.id !== userToDelete));
          setShowDeleteDialog(false);
          setUserToDelete(null);
          
          if (userToRemove) {
            toast({
              title: "Usuário excluído",
              description: `${userToRemove.nome} foi excluído com sucesso.`,
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erro ao excluir usuário",
          description: "Não foi possível excluir o usuário. Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
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
    handleCloseUserDialog
  };
};
