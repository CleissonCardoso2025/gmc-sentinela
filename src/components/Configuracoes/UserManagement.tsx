import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import UserTable from './UserTable';
import UserForm from './UserForm';
import PageAccessControl, { PageAccess } from './PageAccessControl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from '@/types/database';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  toggleUserStatus 
} from '@/services/userService/apiUserService';
import { useAuthorization } from '@/hooks/use-authorization';
import { supabase } from '@/integrations/supabase/client';

export type UserFormData = Omit<User, 'id'> & { id?: string };

const UserManagement = () => {
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

  const mockCurrentUserProfile = {
    perfil: 'Inspetor'
  };

  const userProfile = mockCurrentUserProfile.perfil;
  const hasAccess = userProfile === 'Inspetor';

  const { pageAccessSettings, updatePageAccess, isLoading: isLoadingAccess } = useAuthorization(userProfile);

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
        (payload) => {
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

  const handleOpenAccessControl = () => {
    setShowAccessDialog(true);
  };

  const handleSavePageAccess = (pages: PageAccess[]) => {
    const success = updatePageAccess(pages);
    if (success) {
      setShowAccessDialog(false);
    }
  };

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
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuário..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtrar Usuários</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="profile-filter">Perfil</Label>
                  <Select 
                    value={profileFilter} 
                    onValueChange={setProfileFilter}
                  >
                    <SelectTrigger id="profile-filter">
                      <SelectValue placeholder="Todos os perfis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os perfis</SelectItem>
                      <SelectItem value="Inspetor">Inspetor</SelectItem>
                      <SelectItem value="Subinspetor">Subinspetor</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Corregedor">Corregedor</SelectItem>
                      <SelectItem value="Agente">Agente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleOpenAccessControl} variant="outline" className="gap-1">
            <Shield className="h-4 w-4" />
            Controle de Acesso
          </Button>
          
          <Button onClick={handleAddNewUser} className="gap-1">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <UserTable 
        users={filteredUsers} 
        onEdit={handleEditUser} 
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
        isLoading={isLoading}
      />

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
            </DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={editingUser || undefined} 
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={handleCloseUserDialog}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Permissões de Acesso</DialogTitle>
          </DialogHeader>
          <PageAccessControl 
            initialPages={pageAccessSettings}
            isLoading={isLoadingAccess}
            onSave={handleSavePageAccess}
            onCancel={() => setShowAccessDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
