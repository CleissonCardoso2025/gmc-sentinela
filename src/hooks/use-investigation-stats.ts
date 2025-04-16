
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InvestigationStats {
  totalCount: number;
  openCount: number;
  closedCount: number;
  archivedCount: number;
  // Additional properties for variations/trends
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
      // Get current date for calculations
      const currentDate = new Date();
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(currentDate.getMonth() - 1);
      
      const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1).toISOString();
      const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).toISOString();
      
      // Fetch total count
      const { count: totalCount, error: totalError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw new Error(`Error fetching total investigations: ${totalError.message}`);
      
      // Fetch in progress count (total)
      const { count: openCount, error: openError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Em andamento');
        
      if (openError) throw new Error(`Error fetching open investigations: ${openError.message}`);
      
      // Fetch in progress count (this month)
      const { count: openCountThisMonth, error: openThisMonthError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Em andamento')
        .gte('created_at', currentMonthStart);
        
      if (openThisMonthError) throw new Error(`Error fetching this month's open investigations: ${openThisMonthError.message}`);
      
      // Fetch in progress count (last month)
      const { count: openCountLastMonth, error: openLastMonthError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Em andamento')
        .gte('created_at', lastMonthStart)
        .lt('created_at', lastMonthEnd);
        
      if (openLastMonthError) throw new Error(`Error fetching last month's open investigations: ${openLastMonthError.message}`);
      
      // Fetch closed count (total)
      const { count: closedCount, error: closedError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Concluída');
        
      if (closedError) throw new Error(`Error fetching closed investigations: ${closedError.message}`);
      
      // Fetch closed count (this month)
      const { count: closedCountThisMonth, error: closedThisMonthError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Concluída')
        .gte('created_at', currentMonthStart);
        
      if (closedThisMonthError) throw new Error(`Error fetching this month's closed investigations: ${closedThisMonthError.message}`);
      
      // Fetch closed count (last month)
      const { count: closedCountLastMonth, error: closedLastMonthError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Concluída')
        .gte('created_at', lastMonthStart)
        .lt('created_at', lastMonthEnd);
        
      if (closedLastMonthError) throw new Error(`Error fetching last month's closed investigations: ${closedLastMonthError.message}`);
      
      // Fetch archived count (total)
      const { count: archivedCount, error: archivedError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Arquivada');
        
      if (archivedError) throw new Error(`Error fetching archived investigations: ${archivedError.message}`);
      
      // Fetch archived count (this month)
      const { count: archivedCountThisMonth, error: archivedThisMonthError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Arquivada')
        .gte('created_at', currentMonthStart);
        
      if (archivedThisMonthError) throw new Error(`Error fetching this month's archived investigations: ${archivedThisMonthError.message}`);
      
      // Fetch archived count (last month)
      const { count: archivedCountLastMonth, error: archivedLastMonthError } = await supabase
        .from('investigacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Arquivada')
        .gte('created_at', lastMonthStart)
        .lt('created_at', lastMonthEnd);
        
      if (archivedLastMonthError) throw new Error(`Error fetching last month's archived investigations: ${archivedLastMonthError.message}`);
      
      // Calculate variations by comparing this month to last month
      const emAndamentoVariacao = (openCountThisMonth || 0) - (openCountLastMonth || 0);
      const concluidasVariacao = (closedCountThisMonth || 0) - (closedCountLastMonth || 0);
      const arquivadasVariacao = (archivedCountThisMonth || 0) - (archivedCountLastMonth || 0);
      
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
