
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { DateRange, useOccurrenceData } from "@/hooks/use-occurrence-data";
import { useGoogleMaps } from "@/hooks/use-google-maps";
import OccurrenceMapDisplay from "./OccurrenceMapDisplay";

const OccurrenceMap: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('3m');
  const { occurrences } = useOccurrenceData(dateRange);
  const isMobile = useIsMobile();
  const { isLoaded, isLoading } = useGoogleMaps({
    callback: 'mapsCallback',
    libraries: ['places']
  });
  
  const handleRangeChange = (value: string) => {
    setDateRange(value as DateRange);
  };
  
  return (
    <Card className="w-full overflow-hidden shadow-md relative animate-fade-up">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Mapa de Ocorrências</h2>
        <Select value={dateRange} onValueChange={handleRangeChange}>
          <SelectTrigger className="w-[120px] h-8 text-sm bg-white">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Últimos 3 meses</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="12m">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="w-full h-[300px] md:h-[400px] p-4 flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[250px] md:h-[350px] w-full rounded-md" />
          </div>
        </div>
      ) : (
        <OccurrenceMapDisplay occurrences={occurrences} isLoaded={isLoaded} />
      )}
      
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
        Exibindo {occurrences.length} ocorrências dos últimos {dateRange === '3m' ? '3' : dateRange === '6m' ? '6' : '12'} meses.
      </div>
    </Card>
  );
};

export default OccurrenceMap;
