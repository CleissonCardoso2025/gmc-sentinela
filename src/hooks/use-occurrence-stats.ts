
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OccurrenceStats {
  todayCount: number;
  monthCount: number;
  recentCount: number;
}

export const useOccurrenceStats = () => {
  const [stats, setStats] = useState<OccurrenceStats>({
    todayCount: 0,
    monthCount: 0,
    recentCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get today's date at start of day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get first day of current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Get date for recent occurrences (last 7 days)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        // Format dates for Supabase query
        const todayISO = today.toISOString();
        const firstDayOfMonthISO = firstDayOfMonth.toISOString();
        const lastWeekISO = lastWeek.toISOString();
        
        // Fetch today's occurrences count
        const { count: todayCount, error: todayError } = await supabase
          .from('ocorrencias')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', todayISO);
        
        if (todayError) throw new Error(`Error fetching today's occurrences: ${todayError.message}`);
        
        // Fetch current month's occurrences count
        const { count: monthCount, error: monthError } = await supabase
          .from('ocorrencias')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', firstDayOfMonthISO);
          
        if (monthError) throw new Error(`Error fetching month's occurrences: ${monthError.message}`);
        
        // Fetch recent occurrences count (last 7 days)
        const { count: recentCount, error: recentError } = await supabase
          .from('ocorrencias')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', lastWeekISO);
          
        if (recentError) throw new Error(`Error fetching recent occurrences: ${recentError.message}`);
        
        setStats({
          todayCount: todayCount || 0,
          monthCount: monthCount || 0,
          recentCount: recentCount || 0
        });
      } catch (err) {
        console.error('Error fetching occurrence stats:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast({
          title: 'Erro ao carregar estatísticas',
          description: 'Não foi possível carregar as estatísticas de ocorrências.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    
    // Set up a refresh interval (refresh every 5 minutes)
    const intervalId = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  return { stats, isLoading, error };
};
