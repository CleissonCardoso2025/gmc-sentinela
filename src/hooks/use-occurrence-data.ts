
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from 'date-fns';
import { DateRange as DateRangeType } from "@/components/ui/date-range-picker";

// Define the exported types
export type DateRangeOption = '1d' | '7d' | '30d' | 'all' | '3m' | '6m' | '12m';

export interface Occurrence {
  id: string;
  titulo: string;
  tipo: string;
  descricao: string;
  status: string;
  created_at?: string;
  data: string;
  local: string;
  numero: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
}

export const useOccurrenceData = (initialRange: DateRangeOption = '7d') => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangeOption>(initialRange);
  const { toast } = useToast();
  
  const fetchOccurrences = useCallback(async (range: DateRangeOption) => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('ocorrencias').select('*');
      
      // Apply date filter
      if (range !== 'all') {
        let days = 7; // default for '7d'
        
        if (range === '1d') days = 1;
        else if (range === '30d') days = 30;
        else if (range === '3m') days = 90;
        else if (range === '6m') days = 180;
        else if (range === '12m') days = 365;
        
        const startDate = subDays(new Date(), days);
        query = query.gte('created_at', startDate.toISOString());
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Map the data to match the Occurrence interface
        const mappedData = data.map(item => ({
          ...item,
          titulo: item.tipo, // Use tipo as titulo
          // Add default values for latitude and longitude
          latitude: item.latitude || 0,
          longitude: item.longitude || 0
        }));
        setOccurrences(mappedData);
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
    setDateRange,
    refetchOccurrences: () => fetchOccurrences(dateRange)
  };
};

// Export the DateRange type from the hook for convenience
export type { DateRangeType };
