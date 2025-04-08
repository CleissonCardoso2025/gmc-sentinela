
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

export type User = {
  id: number;
  nome: string;
  email: string;
  perfil: 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente';
  status: boolean;
};

export type UserFormData = Omit<User, 'id'> & { id?: number };

const mockUsers: User[] = [
  { id: 1, nome: 'Carlos Silva', email: 'carlos.silva@gcm.gov.br', perfil: 'Inspetor', status: true },
  { id: 2, nome: 'Maria Oliveira', email: 'maria.oliveira@gcm.gov.br', perfil: 'Subinspetor', status: true },
  { id: 3, nome: 'João Santos', email: 'joao.santos@gcm.gov.br', perfil: 'Supervisor', status: true },
  { id: 4, nome: 'Ana Costa', email: 'ana.costa@gcm.gov.br', perfil: 'Corregedor', status: false },
  { id: 5, nome: 'Pedro Lima', email: 'pedro.lima@gcm.gov.br', perfil: 'Agente', status: true },
];

const mockCurrentUserProfile = {
  perfil: 'Inspetor'
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileFilter, setProfileFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const userProfile = mockCurrentUserProfile.perfil;
  const hasAccess = userProfile === 'Inspetor';

  // Function to update filtered users whenever the base data changes
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

  // Update filtered users whenever users, searchTerm, profileFilter, or statusFilter changes
  useEffect(() => {
    updateFilteredUsers();
  }, [users, searchTerm, profileFilter, statusFilter]);

  const handleCreateUser = (userData: UserFormData) => {
    const newUser = {
      ...userData,
      id: Math.max(0, ...users.map(u => u.id)) + 1,
    } as User;
    
    setUsers(prev => [...prev, newUser]);
    setShowUserDialog(false);
    toast({
      title: "Usuário criado",
      description: `${newUser.nome} foi adicionado com sucesso.`
    });
    // No need to call updateFilteredUsers here as it will be triggered by the useEffect
  };

  const handleUpdateUser = (userData: UserFormData) => {
    if (!userData.id) return;
    
    setUsers(prev => 
      prev.map(user => user.id === userData.id ? { ...userData } as User : user)
    );
    setShowUserDialog(false);
    toast({
      title: "Usuário atualizado",
      description: `Os dados de ${userData.nome} foram atualizados.`
    });
    // No need to call updateFilteredUsers here as it will be triggered by the useEffect
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserDialog(true);
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(prev => 
      prev.map(user => user.id === userId 
        ? { ...user, status: !user.status } 
        : user
      )
    );
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.status ? "Usuário desativado" : "Usuário ativado",
        description: `${user.nome} foi ${user.status ? "desativado" : "ativado"} com sucesso.`
      });
    }
    // No need to call updateFilteredUsers here as it will be triggered by the useEffect
  };

  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(user => user.id !== userToDelete));
      setShowDeleteDialog(false);
      
      const user = users.find(u => u.id === userToDelete);
      if (user) {
        toast({
          title: "Usuário excluído",
          description: `${user.nome} foi excluído com sucesso.`,
          variant: "destructive"
        });
      }
      // No need to call updateFilteredUsers here as it will be triggered by the useEffect
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
    toast({
      title: "Permissões atualizadas",
      description: "As permissões de acesso foram atualizadas com sucesso."
    });
    setShowAccessDialog(false);
    // Since this doesn't modify the users array, no need to call updateFilteredUsers
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
