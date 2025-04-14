
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  nome: string;
  patente?: string;
  funcao?: string;
}

export const useAgentsData = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First try to get members from all guarnicoes
      const { data: membrosData, error: membrosError } = await supabase
        .from('membros_guarnicao')
        .select('id, nome, funcao');
      
      if (membrosError) {
        console.error('Error fetching membros_guarnicao:', membrosError);
        throw membrosError;
      }
      
      // If no members, fallback to users table and format them as agents
      if (!membrosData || membrosData.length === 0) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nome, perfil')
          .eq('status', true);
        
        if (userError) {
          console.error('Error fetching users:', userError);
          throw userError;
        }
        
        const formattedAgents = userData?.map(user => ({
          id: user.id,
          nome: user.nome,
          patente: user.perfil
        })) || [];
        
        setAgents(formattedAgents);
      } else {
        // Format membros_guarnicao as agents
        const formattedAgents = membrosData.map(membro => ({
          id: membro.id,
          nome: membro.nome,
          patente: membro.funcao
        }));
        
        setAgents(formattedAgents);
      }
    } catch (error) {
      console.error('Error in fetchAgents:', error);
      setError('Falha ao carregar a lista de agentes.');
      toast.error('Não foi possível carregar os agentes. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return { agents, isLoading, error, refetchAgents: fetchAgents };
};
