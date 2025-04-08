
import { useState, useEffect } from 'react';
import { User } from '@/types/database';

export const useUserFilters = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileFilter, setProfileFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

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

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    profileFilter,
    setProfileFilter,
    statusFilter,
    setStatusFilter
  };
};
