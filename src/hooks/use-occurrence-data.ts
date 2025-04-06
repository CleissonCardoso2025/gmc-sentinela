
import { useState, useEffect } from 'react';

export type DateRange = '3m' | '6m' | '12m';

export interface Occurrence {
  id: string;
  titulo: string;
  local: string;
  data: string;
  latitude?: number;
  longitude?: number;
}

// Mock occurrences data - in a real app, this would come from an API
const mockOccurrences: Occurrence[] = [
  { 
    id: '1', 
    titulo: 'Perturbação do Sossego', 
    local: 'Rua das Flores, 123, São Paulo', 
    data: '2025-01-15T14:30:00',
    latitude: -23.550520, 
    longitude: -46.633308 
  },
  { 
    id: '2', 
    titulo: 'Acidente de Trânsito', 
    local: 'Av. Paulista, 1000, São Paulo', 
    data: '2025-02-20T13:15:00',
    latitude: -23.561414, 
    longitude: -46.655532 
  },
  { 
    id: '3', 
    titulo: 'Apoio ao Cidadão', 
    local: 'Praça da Sé, São Paulo', 
    data: '2024-12-01T12:45:00',
    latitude: -23.549913, 
    longitude: -46.633409 
  },
  { 
    id: '4', 
    titulo: 'Ocorrência Maria da Penha', 
    local: 'Rua Augusta, 500, São Paulo', 
    data: '2024-10-10T09:20:00',
    latitude: -23.553105, 
    longitude: -46.645935 
  },
  { 
    id: '5', 
    titulo: 'Fiscalização de Trânsito', 
    local: 'Av. 23 de Maio, São Paulo', 
    data: '2024-09-05T16:40:00',
    latitude: -23.580855, 
    longitude: -46.622703 
  }
];

/**
 * Custom hook to filter occurrences based on date range
 */
export const useOccurrenceData = (dateRange: DateRange) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  
  useEffect(() => {
    const now = new Date();
    let monthsAgo: number;
    
    switch (dateRange) {
      case '3m':
        monthsAgo = 3;
        break;
      case '6m':
        monthsAgo = 6;
        break;
      case '12m':
        monthsAgo = 12;
        break;
      default:
        monthsAgo = 3;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setMonth(now.getMonth() - monthsAgo);
    
    const filtered = mockOccurrences.filter(occ => {
      const occDate = new Date(occ.data);
      return occDate >= cutoffDate;
    });
    
    setOccurrences(filtered);
  }, [dateRange]);
  
  return { occurrences };
};
