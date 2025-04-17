
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
        const { data, error } = await supabase
          .from('users')
          .select('id, nome, perfil as patente')
          .order('nome', { ascending: true });
        
        if (error) throw error;
        
        setAgents(data || []);
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
