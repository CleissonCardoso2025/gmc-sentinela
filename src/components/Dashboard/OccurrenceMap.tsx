
import React, { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { DateRange, useOccurrenceData } from "@/hooks/use-occurrence-data";
import { useGoogleMaps } from "@/hooks/use-google-maps";
import OccurrenceMapDisplay from "./OccurrenceMapDisplay";
import { useToast } from '@/hooks/use-toast';

const OccurrenceMap: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('3m');
  const { occurrences, isLoading: dataLoading, refetchOccurrences } = useOccurrenceData(dateRange);
  const isMobile = useIsMobile();
  const { isLoaded, isLoading: mapsLoading, loadError } = useGoogleMaps({
    callback: 'mapsCallback',
    libraries: ['places']
  });
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  
  const handleRangeChange = (value: string) => {
    setDateRange(value as DateRange);
  };
  
  const handleRefresh = useCallback(() => {
    refetchOccurrences();
    toast({
      title: "Atualizando dados",
      description: "Buscando as ocorrências mais recentes."
    });
  }, [refetchOccurrences, toast]);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast({
      title: "Tentando novamente",
      description: "Tentando carregar o mapa novamente."
    });
    
    // Force reload of the Google Maps script
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }
  };
  
  const isLoading = dataLoading || mapsLoading;
  
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
        <div className="w-full relative">
          <OccurrenceMapDisplay 
            occurrences={occurrences} 
            isLoaded={isLoaded} 
          />
          
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
              <div className="text-center p-4">
                <p className="text-red-600 mb-2">Erro ao carregar o mapa</p>
                <button 
                  className="bg-gcm-600 text-white px-3 py-1 rounded-md hover:bg-gcm-700 transition-colors"
                  onClick={handleRetry}
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}
          
          <div className="p-3 border-t bg-gray-50 text-xs flex justify-between items-center">
            <span className="text-gray-500">
              Exibindo {occurrences.length} ocorrências dos últimos {dateRange === '3m' ? '3' : dateRange === '6m' ? '6' : '12'} meses.
            </span>
            <button 
              className="text-xs bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
              onClick={handleRefresh}
            >
              Atualizar
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OccurrenceMap;
