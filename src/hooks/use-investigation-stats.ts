
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InvestigationStats {
  totalCount: number;
  openCount: number;
  closedCount: number;
  archivedCount: number;
}

export const useInvestigationStats = () => {
  const [stats, setStats] = useState<InvestigationStats>({
    totalCount: 0,
    openCount: 0,
    closedCount: 0,
    archivedCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
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
        
        setStats({
          totalCount: totalCount || 0,
          openCount: openCount || 0,
          closedCount: closedCount || 0,
          archivedCount: archivedCount || 0
        });
      } catch (err) {
        console.error('Error fetching investigation stats:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error('Erro ao carregar estatísticas de sindicâncias');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    
    // Set up a refresh interval (refresh every 5 minutes)
    const intervalId = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return { stats, isLoading, error };
};
