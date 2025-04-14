import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { subDays } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangeType, Occurrence, DateRangeOption } from "@/hooks/use-occurrence-data";

interface RecentOccurrencesProps {
  limit?: number;
}

const RecentOccurrences: React.FC<RecentOccurrencesProps> = ({ limit = 5 }) => {
  const [occurrences, setOccurrences] = React.useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchOccurrences = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('ocorrencias')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        
        const mappedData = data?.map(item => ({
          ...item,
          titulo: item.tipo,
          latitude: 0,
          longitude: 0
        })) || [];
        
        setOccurrences(mappedData);
      } catch (error) {
        console.error('Error fetching occurrences:', error);
        toast({
          title: 'Erro ao carregar ocorrências',
          description: 'Não foi possível carregar as ocorrências recentes.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccurrences();
  }, [limit, toast]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolvida':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'alta':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (occurrences.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Nenhuma ocorrência recente encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {occurrences.map((occurrence) => (
        <div key={occurrence.id} className="flex items-start space-x-4 border-b pb-3 last:border-0">
          <div className="mt-0.5">{getStatusIcon(occurrence.status)}</div>
          <div className="space-y-1 flex-1">
            <div className="font-medium">{occurrence.titulo}</div>
            <div className="text-sm text-muted-foreground truncate">{occurrence.descricao}</div>
            <div className="text-xs text-muted-foreground">
              {occurrence.created_at
                ? format(new Date(occurrence.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
                : "Data não disponível"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const useOccurrenceData = (dateRange: string | DateRangeType) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentDateRange, setCurrentDateRange] = useState<DateRangeType>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('ocorrencias')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        
        const mappedData = data?.map(item => ({
          ...item,
          titulo: item.tipo,
          latitude: 0,
          longitude: 0
        })) || [];
        
        setOccurrences(mappedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error("Error fetching occurrence data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return {
    occurrences,
    isLoading,
    dateRange: currentDateRange,
    setDateRange: setCurrentDateRange,
    refetchOccurrences: () => {},
  };
};

export default RecentOccurrences;
