
import React, { useState, useCallback, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { DateRangeOption } from "@/hooks/use-occurrence-data";
import { useOccurrenceData } from "@/hooks/use-occurrence-data";
import { useToast } from '@/hooks/use-toast';
import GoogleMapComponent from '../Map/GoogleMap';
import { MapMarker } from '@/types/maps';
import { formatDateBR, calculateMapCenter, determineZoomLevel } from '@/utils/maps-utils';
import { Filter, Calendar, RefreshCcw, MapPin } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';

// Define occurrence types
type OccurrenceType = 'all' | 'transito' | 'crime' | 'apoio' | 'perturbacao';

const OccurrenceMap: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeOption>('7d');
  const [occurrenceType, setOccurrenceType] = useState<OccurrenceType>('all');
  const { occurrences, isLoading: dataLoading, refetchOccurrences } = useOccurrenceData(dateRange);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const geolocation = useGeolocation({ enableHighAccuracy: true });
  const [centered, setCentered] = useState(false);
  
  const handleRangeChange = (value: string) => {
    setDateRange(value as DateRangeOption);
  };
  
  const handleTypeChange = (value: string) => {
    setOccurrenceType(value as OccurrenceType);
  };
  
  const handleRefresh = useCallback(() => {
    refetchOccurrences();
    geolocation.refreshPosition();
    toast({
      title: "Atualizando dados",
      description: "Buscando as ocorrências mais recentes e sua localização."
    });
  }, [refetchOccurrences, geolocation, toast]);
  
  const handleGetUserLocation = useCallback(() => {
    if (geolocation.error) {
      toast({
        title: "Erro de localização",
        description: geolocation.error,
        variant: "destructive"
      });
      return;
    }
    
    geolocation.refreshPosition();
    setCentered(true);
    
    if (geolocation.location.latitude && geolocation.location.longitude) {
      toast({
        title: "Localização encontrada",
        description: `O mapa foi centralizado na sua localização atual. Precisão: ~${
          geolocation.location.accuracy ? Math.round(geolocation.location.accuracy) : '?'
        }m`,
      });
    } else {
      toast({
        title: "Obtendo localização",
        description: "Aguarde enquanto obtemos sua localização atual."
      });
    }
  }, [geolocation, toast]);
  
  // Filter occurrences by type
  const filteredOccurrences = occurrences.filter(occurrence => {
    if (occurrenceType === 'all') return true;
    
    const typeMapping: Record<OccurrenceType, string[]> = {
      'all': [],
      'transito': ['Acidente de Trânsito'],
      'crime': ['Furto', 'Vandalismo'],
      'apoio': ['Apoio ao Cidadão'],
      'perturbacao': ['Perturbação do Sossego']
    };
    
    return typeMapping[occurrenceType]?.includes(occurrence.titulo || occurrence.tipo);
  });
  
  // Prepare markers for the map
  const markers: MapMarker[] = filteredOccurrences
    .filter(o => o.latitude !== undefined && o.longitude !== undefined)
    .map(occurrence => ({
      id: occurrence.id,
      position: [
        occurrence.latitude || -23.550520, 
        occurrence.longitude || -46.633308
      ],
      title: occurrence.titulo || occurrence.tipo,
      content: `
        <p>${occurrence.local}</p>
        <p>Data: ${formatDateBR(occurrence.data)}</p>
      `,
      icon: 'incident'
    }));
  
  // Add user location marker if available
  if (geolocation.location.latitude && geolocation.location.longitude) {
    markers.push({
      id: 'user-location',
      position: [geolocation.location.latitude, geolocation.location.longitude],
      title: 'Sua localização',
      content: geolocation.location.accuracy 
        ? `<p>Precisão: ~${Math.round(geolocation.location.accuracy)}m</p>` 
        : '',
      icon: 'default'
    });
  }

  // Calculate map center
  const calculateMapCenter = useCallback(() => {
    if (centered && geolocation.location.latitude && geolocation.location.longitude) {
      return {
        lat: geolocation.location.latitude,
        lng: geolocation.location.longitude
      };
    }
    
    const validOccurrences = filteredOccurrences.filter(o => 
      o.latitude !== undefined && o.longitude !== undefined
    );
    
    if (validOccurrences.length === 0) {
      // If no occurrences but we have user location, use that
      if (geolocation.location.latitude && geolocation.location.longitude) {
        return {
          lat: geolocation.location.latitude,
          lng: geolocation.location.longitude
        };
      }
      // Default to São Paulo if no valid coordinates
      return { lat: -23.550520, lng: -46.633308 };
    }
    
    const sumLat = validOccurrences.reduce((sum, o) => sum + (o.latitude || 0), 0);
    const sumLng = validOccurrences.reduce((sum, o) => sum + (o.longitude || 0), 0);
    
    return {
      lat: sumLat / validOccurrences.length,
      lng: sumLng / validOccurrences.length
    };
  }, [filteredOccurrences, geolocation.location.latitude, geolocation.location.longitude, centered]);
  
  return (
    <Card className="w-full overflow-hidden shadow-md relative animate-fade-up">
      <div className="p-4 bg-white border-b relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Mapa de Ocorrências</h2>
          <div className="flex flex-wrap gap-2">
            <Select value={dateRange} onValueChange={handleRangeChange}>
              <SelectTrigger className="w-[120px] h-8 text-sm bg-white">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="12m">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={occurrenceType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[140px] h-8 text-sm bg-white">
                <Filter className="h-3.5 w-3.5 mr-1" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="transito">Trânsito</SelectItem>
                <SelectItem value="crime">Crimes</SelectItem>
                <SelectItem value="apoio">Apoio ao cidadão</SelectItem>
                <SelectItem value="perturbacao">Perturbação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {dataLoading ? (
        <div className="w-full h-[300px] md:h-[400px] p-4 flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[250px] md:h-[350px] w-full rounded-md" />
          </div>
        </div>
      ) : (
        <div className="w-full relative" style={{ zIndex: 0 }}>
          <GoogleMapComponent 
            center={calculateMapCenter()}
            markers={markers}
            zoom={determineZoomLevel(filteredOccurrences.length)}
            height="h-[300px] md:h-[400px]"
            markerType="incident"
            showUserLocation={true}
          />
          
          {filteredOccurrences.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
              <p className="text-gray-600 italic">
                Nenhuma ocorrência encontrada com os filtros selecionados.
              </p>
            </div>
          )}
          
          <div className="p-3 border-t bg-gray-50 text-xs flex flex-wrap justify-between items-center gap-2">
            <span className="text-gray-500">
              Exibindo {filteredOccurrences.length} ocorrências
              {occurrenceType !== 'all' && (
                <span> do tipo {
                  occurrenceType === 'transito' ? 'Trânsito' :
                  occurrenceType === 'crime' ? 'Crimes' :
                  occurrenceType === 'apoio' ? 'Apoio ao cidadão' :
                  occurrenceType === 'perturbacao' ? 'Perturbação' : ''
                }</span>
              )}
              {' dos últimos '}
              {dateRange === '3m' ? '3 meses' : 
               dateRange === '6m' ? '6 meses' : 
               dateRange === '12m' ? '12 meses' :
               dateRange === '30d' ? '30 dias' :
               dateRange === '7d' ? '7 dias' : ''}
            </span>
            <div className="flex gap-2">
              <button 
                className="text-xs bg-gcm-600 text-white px-3 py-1 rounded-md hover:bg-gcm-700 transition-colors flex items-center"
                onClick={handleGetUserLocation}
                disabled={geolocation.loading}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {geolocation.loading ? "Localizando..." : "Minha localização"}
              </button>
              <button 
                className="text-xs bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
                onClick={handleRefresh}
              >
                <RefreshCcw className="h-3 w-3" />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OccurrenceMap;
