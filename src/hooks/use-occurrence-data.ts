
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from 'date-fns';

export type DateRange = '1d' | '7d' | '30d' | 'all';

export interface Occurrence {
  id: string;
  numero: string;
  data: string;
  local: string;
  tipo: string;
  status: string;
  descricao: string;
  created_at?: string;
}

export const useOccurrenceData = (initialRange: DateRange = '7d') => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>(initialRange);
  const { toast } = useToast();
  
  const fetchOccurrences = useCallback(async (range: DateRange) => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('ocorrencias').select('*');
      
      // Apply date filter
      if (range !== 'all') {
        const days = parseInt(range.replace('d', ''));
        const startDate = subDays(new Date(), days);
        query = query.gte('created_at', startDate.toISOString());
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setOccurrences(data);
      }
    } catch (error) {
      console.error("Error fetching occurrences:", error);
      toast({
        title: "Erro ao carregar ocorrências",
        description: "Não foi possível obter os dados das ocorrências.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchOccurrences(dateRange);
  }, [fetchOccurrences, dateRange]);
  
  return {
    occurrences,
    isLoading,
    dateRange,
    setDateRange
  };
};
