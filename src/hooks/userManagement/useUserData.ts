
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/database';
import { getUsers } from '@/services/userService/apiUserService';
import { supabase } from '@/integrations/supabase/client';

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching users...");
      const data = await getUsers();
      console.log("Users fetched:", data);
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
  }, [toast]);

  useEffect(() => {
    fetchUsers();

    // Set up a realtime subscription to listen for database changes
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
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  return {
    users,
    setUsers,
    isLoading,
    refetchUsers: fetchUsers
  };
};
