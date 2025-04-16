
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InvestigationStats {
  totalCount: number;
  openCount: number;
  closedCount: number;
  archivedCount: number;
  // Add the missing properties
  emAndamento: number;
  emAndamentoVariacao: number;
  concluidas: number;
  concluidasVariacao: number;
  arquivadas: number;
  arquivadasVariacao: number;
}

export const useInvestigationStats = () => {
  const [stats, setStats] = useState<InvestigationStats>({
    totalCount: 0,
    openCount: 0,
    closedCount: 0,
    archivedCount: 0,
    emAndamento: 0,
    emAndamentoVariacao: 0,
    concluidas: 0,
    concluidasVariacao: 0,
    arquivadas: 0,
    arquivadasVariacao: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch total count
      const { count: totalCount, error: totalError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw new Error(`Error fetching total investigations: ${totalError.message}`);
      
      // Fetch in progress count
      const { count: openCount, error: openError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Em andamento');
        
      if (openError) throw new Error(`Error fetching open investigations: ${openError.message}`);
      
      // Fetch closed count
      const { count: closedCount, error: closedError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Concluída');
        
      if (closedError) throw new Error(`Error fetching closed investigations: ${closedError.message}`);
      
      // Fetch archived count
      const { count: archivedCount, error: archivedError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Arquivada');
        
      if (archivedError) throw new Error(`Error fetching archived investigations: ${archivedError.message}`);
      
      // Calculate variations (mock data for now, could be replaced with actual month-over-month comparisons)
      const emAndamentoVariacao = Math.floor(Math.random() * 5) - 2; // Random between -2 and 2
      const concluidasVariacao = Math.floor(Math.random() * 5) - 1; // Random between -1 and 3
      const arquivadasVariacao = Math.floor(Math.random() * 3); // Random between 0 and 2
      
      setStats({
        totalCount: totalCount || 0,
        openCount: openCount || 0,
        closedCount: closedCount || 0,
        archivedCount: archivedCount || 0,
        emAndamento: openCount || 0,
        emAndamentoVariacao,
        concluidas: closedCount || 0,
        concluidasVariacao,
        arquivadas: archivedCount || 0,
        arquivadasVariacao
      });
    } catch (err) {
      console.error('Error fetching investigation stats:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Erro ao carregar estatísticas de sindicâncias');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
    
    // Set up a refresh interval (refresh every 5 minutes)
    const intervalId = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchStats]);
  
  return { stats, isLoading, error, refetch: fetchStats };
};
