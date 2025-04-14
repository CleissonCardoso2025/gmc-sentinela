
import React from 'react';
import { Card } from "@/components/ui/card";
import EmptyState from "./EmptyState";
import { DateRangeOption } from "@/hooks/use-occurrence-data";

interface RecentOccurrencesProps {
  limit?: number;
}

const RecentOccurrences: React.FC<RecentOccurrencesProps> = ({ limit = 5 }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 text-center">
        <EmptyState
          title="Nenhuma ocorrência recente"
          description="Não há ocorrências recentes para exibir."
          icon="info"
        />
      </div>
    </Card>
  );
};

// Criando uma versão simplificada do hook, sem fazer chamadas ao banco de dados
export const useOccurrenceData = (dateRange: string | DateRangeOption) => {
  return {
    occurrences: [],
    isLoading: false,
    dateRange: {
      from: new Date(),
      to: new Date(),
    },
    setDateRange: () => {},
    refetchOccurrences: () => {},
  };
};

export default RecentOccurrences;
