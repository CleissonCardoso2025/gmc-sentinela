
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Power } from 'lucide-react';
import { User } from './UserManagement';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (userId: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onToggleStatus }) => {
  const getStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>;
    }
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inativo</Badge>;
  };

  const getProfileBadge = (profile: string) => {
    const colorMap: Record<string, string> = {
      'Inspetor': 'bg-blue-50 text-blue-700 border-blue-200',
      'Subinspetor': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Supervisor': 'bg-purple-50 text-purple-700 border-purple-200',
      'Corregedor': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Agente': 'bg-gray-50 text-gray-700 border-gray-200',
    };
    
    return (
      <Badge variant="outline" className={colorMap[profile] || 'bg-gray-50 text-gray-700 border-gray-200'}>
        {profile}
      </Badge>
    );
  };

  if (users.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.nome}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getProfileBadge(user.perfil)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                      <Power className="mr-2 h-4 w-4" />
                      {user.status ? 'Desativar' : 'Ativar'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
