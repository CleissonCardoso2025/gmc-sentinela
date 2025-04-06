
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  // Mock data with real coordinates for São Paulo
  const mockOccurrences: Record<DateRange, Occurrence[]> = {
    '3m': [
      { id: 1, titulo: 'Perturbação do Sossego', local: 'Rua das Flores, 123', data: '2025-02-01T14:30:00Z', latitude: -23.550520, longitude: -46.633308 },
      { id: 2, titulo: 'Acidente de Trânsito', local: 'Av. Paulista, 1000', data: '2025-02-15T13:15:00Z', latitude: -23.561414, longitude: -46.655532 },
      { id: 3, titulo: 'Apoio ao Cidadão', local: 'Praça da Sé', data: '2025-03-05T12:45:00Z', latitude: -23.550398, longitude: -46.633612 },
    ],
    '6m': [
      { id: 1, titulo: 'Perturbação do Sossego', local: 'Rua das Flores, 123', data: '2025-02-01T14:30:00Z', latitude: -23.550520, longitude: -46.633308 },
      { id: 2, titulo: 'Acidente de Trânsito', local: 'Av. Paulista, 1000', data: '2025-02-15T13:15:00Z', latitude: -23.561414, longitude: -46.655532 },
      { id: 3, titulo: 'Apoio ao Cidadão', local: 'Praça da Sé', data: '2025-03-05T12:45:00Z', latitude: -23.550398, longitude: -46.633612 },
      { id: 4, titulo: 'Furto', local: 'Shopping Ibirapuera', data: '2024-12-20T16:30:00Z', latitude: -23.601271, longitude: -46.667108 },
      { id: 5, titulo: 'Ocorrência Doméstica', local: 'Vila Mariana', data: '2025-01-10T09:45:00Z', latitude: -23.586543, longitude: -46.639431 },
    ],
    '12m': [
      { id: 1, titulo: 'Perturbação do Sossego', local: 'Rua das Flores, 123', data: '2025-02-01T14:30:00Z', latitude: -23.550520, longitude: -46.633308 },
      { id: 2, titulo: 'Acidente de Trânsito', local: 'Av. Paulista, 1000', data: '2025-02-15T13:15:00Z', latitude: -23.561414, longitude: -46.655532 },
      { id: 3, titulo: 'Apoio ao Cidadão', local: 'Praça da Sé', data: '2025-03-05T12:45:00Z', latitude: -23.550398, longitude: -46.633612 },
      { id: 4, titulo: 'Furto', local: 'Shopping Ibirapuera', data: '2024-12-20T16:30:00Z', latitude: -23.601271, longitude: -46.667108 },
      { id: 5, titulo: 'Ocorrência Doméstica', local: 'Vila Mariana', data: '2025-01-10T09:45:00Z', latitude: -23.586543, longitude: -46.639431 },
      { id: 6, titulo: 'Desacato', local: 'Estação da Luz', data: '2024-07-15T18:20:00Z', latitude: -23.534927, longitude: -46.635587 },
      { id: 7, titulo: 'Vandalismo', local: 'Parque do Ibirapuera', data: '2024-08-30T15:40:00Z', latitude: -23.587128, longitude: -46.657141 },
    ],
  };

  const fetchOccurrences = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        console.log(`Fetching occurrences for date range: ${dateRange}`);
        setOccurrences(mockOccurrences[dateRange]);
      } catch (error) {
        console.error('Error fetching occurrences:', error);
        toast({
          title: 'Erro ao buscar ocorrências',
          description: 'Não foi possível carregar as ocorrências.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
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
