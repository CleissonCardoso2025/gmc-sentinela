
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Agent {
  id: string;
  nome: string;
  patente: string;
}

export const useAgentsData = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        // Modified query to avoid using 'as' alias syntax directly
        const { data, error } = await supabase
          .from('users')
          .select('id, nome, perfil')
          .order('nome', { ascending: true });
        
        if (error) throw error;
        
        // Transform the data to match the Agent interface
        const formattedAgents = data?.map(user => ({
          id: user.id,
          nome: user.nome,
          patente: user.perfil
        })) || [];
        
        setAgents(formattedAgents);
      } catch (error: any) {
        console.error('Error fetching agents:', error);
        setError(error.message || 'Falha ao carregar usuários');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, isLoading, error };
};
