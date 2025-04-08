
import { useState, useEffect, useCallback } from 'react';
import { getUserService, resetUserService } from '@/services/userService';
import { User, UserFormData } from '@/components/Configuracoes/UserManagement';
import { setServiceConfig } from '@/services/api/serviceConfig';

export function useUserService() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userService = getUserService();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [userService]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData: UserFormData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.createUser(userData);
      await fetchUsers(); // Refresh the list
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error creating user:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: UserFormData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(userData);
      await fetchUsers(); // Refresh the list
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      console.error('Error updating user:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.deleteUser(userId);
      await fetchUsers(); // Refresh the list
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.toggleUserStatus(userId);
      await fetchUsers(); // Refresh the list
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle user status');
      console.error('Error toggling user status:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle between mock and real data
  const toggleMockMode = (useMocks: boolean) => {
    setServiceConfig('user', { useMocks });
    resetUserService();
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshUsers: fetchUsers,
    toggleMockMode
  };
}
