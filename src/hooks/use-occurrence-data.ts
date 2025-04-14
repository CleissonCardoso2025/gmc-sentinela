
import { useState } from 'react';
import { DateRange } from "@/components/ui/date-range-picker";

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

// Define DateRangeType interface
export interface DateRangeType {
  from: Date;
  to: Date;
}

export const useOccurrenceData = (initialRange: DateRangeOption = '7d') => {
  const [occurrences] = useState<Occurrence[]>([]);
  const [isLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeOption>(initialRange);
  
  // Função mock para simular refetch, não faz nada na prática
  const refetchOccurrences = () => {
    console.log("Refetch de ocorrências solicitado, mas não há dados para exibir");
  };
  
  return {
    occurrences,
    isLoading,
    dateRange,
    setDateRange,
    refetchOccurrences
  };
};
