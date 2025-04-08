
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/database';
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '@/services/userService/apiUserService';
import { supabase } from '@/integrations/supabase/client';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileFilter, setProfileFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('public:users')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload: any) => {
          console.log('Mudança detectada em usuários:', payload);
          fetchUsers();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Novo usuário criado",
              description: "Um novo usuário foi adicionado ao sistema.",
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Usuário atualizado",
              description: "Um usuário foi atualizado no sistema.",
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Usuário removido",
              description: "Um usuário foi removido do sistema.",
            });
          }
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível obter a lista de usuários. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilteredUsers = () => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (profileFilter) {
      result = result.filter(user => user.perfil === profileFilter);
    }
    
    if (statusFilter) {
      const isActive = statusFilter === 'ativo';
      result = result.filter(user => user.status === isActive);
    }
    
    setFilteredUsers(result);
  };

  useEffect(() => {
    updateFilteredUsers();
  }, [users, searchTerm, profileFilter, statusFilter]);

  const handleCreateUser = async (userData: UserFormData) => {
    try {
      const newUser = await createUser(userData);
      if (newUser) {
        setUsers(prev => [...prev, newUser]);
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
    setEditingUser(user);
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
          setUsers(prev => prev.filter(user => user.id !== userToDelete));
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
    handleCloseUserDialog
  };
};
