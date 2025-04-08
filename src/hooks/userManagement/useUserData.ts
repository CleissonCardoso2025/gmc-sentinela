
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
  }, [toast]);

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
  }, [fetchUsers, toast]);

  return {
    users,
    setUsers,
    isLoading,
    refetchUsers: fetchUsers
  };
};
