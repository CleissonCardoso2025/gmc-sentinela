
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  profileFilter: string;
  onProfileFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  profileFilter,
  onProfileFilterChange,
  statusFilter,
  onStatusFilterChange
}) => {
  return (
    <div className="relative w-full sm:w-auto flex-1 max-w-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuário..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
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
                  onValueChange={onProfileFilterChange}
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
                  onValueChange={onStatusFilterChange}
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
      </div>
    </div>
  );
};

export default UserFilters;
