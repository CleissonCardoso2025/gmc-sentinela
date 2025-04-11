
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export type DateRange = '3m' | '6m' | '12m';

export interface Occurrence {
  id: number;
  titulo: string;
  local: string;
  data: string;
  latitude?: number;
  longitude?: number;
  descricao?: string;
  status?: string;
}

export const useOccurrenceData = (dateRange: DateRange) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOccurrences = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log(`Fetching occurrences for date range: ${dateRange}`);
      
      // Get current date
      const now = new Date();
      
      // Calculate the start date based on dateRange
      const startDate = new Date();
      if (dateRange === '3m') {
        startDate.setMonth(now.getMonth() - 3);
      } else if (dateRange === '6m') {
        startDate.setMonth(now.getMonth() - 6);
      } else if (dateRange === '12m') {
        startDate.setMonth(now.getMonth() - 12);
      }
      
      // Format dates for API
      const startDateStr = startDate.toISOString();
      const endDateStr = now.toISOString();
      
      // Real API call to fetch occurrences
      const { data, error } = await supabase
        .from('ocorrencias')
        .select('*')
        .gte('created_at', startDateStr)
        .lte('created_at', endDateStr)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match expected interface
      const transformedData: Occurrence[] = data?.map(item => ({
        id: item.id,
        titulo: item.tipo || 'Sem título',
        local: item.local || 'Local não especificado',
        data: item.data || new Date().toISOString(),
        descricao: item.descricao,
        status: item.status
      })) || [];
      
      setOccurrences(transformedData);
    } catch (error) {
      console.error('Error fetching occurrences:', error);
      toast({
        title: 'Erro ao buscar ocorrências',
        description: 'Não foi possível carregar as ocorrências.',
        variant: 'destructive',
      });
      
      // Set empty array on error
      setOccurrences([]);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  useEffect(() => {
    fetchOccurrences();
  }, [fetchOccurrences]);

  return { 
    occurrences, 
    isLoading,
    refetchOccurrences: fetchOccurrences
  };
};
