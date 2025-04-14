
import React from 'react';
import { Card } from "@/components/ui/card";
import { useOccurrenceData } from '@/hooks/use-occurrence-data';
import OccurrenceList from './OccurrenceList';

export const RecentOccurrences = () => {
  const { occurrences, isLoading } = useOccurrenceData('7d');
  
  return (
    <Card className="shadow-md h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Ocorrências Recentes</h2>
      </div>
      <OccurrenceList occurrences={occurrences} limit={5} isLoading={isLoading} />
    </Card>
  );
};
