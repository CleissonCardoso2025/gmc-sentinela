
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

type DateRange = '3m' | '6m' | '12m';

interface Occurrence {
  id: string;
  titulo: string;
  local: string;
  data: string;
  latitude?: number;
  longitude?: number;
}

const OccurrenceMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('3m');
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  // Mock data for occurrences - in a real implementation, this would come from your database
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
  
  // Filter occurrences based on date range
  useEffect(() => {
    const now = new Date();
    let monthsAgo;
    
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
  
  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current || !occurrences.length) return;
    
    const loadGoogleMaps = async () => {
      if (typeof window.google === 'undefined') {
        try {
          // Define a callback function for when Google Maps loads
          window.initMap = () => {
            initializeMap();
          };
          
          const script = document.createElement('script');
          const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
          script.async = true;
          script.defer = true;
          
          document.head.appendChild(script);
        } catch (error) {
          console.error("Error loading Google Maps:", error);
          setIsLoading(false);
          toast({
            title: "Erro ao carregar o mapa",
            description: "Não foi possível carregar o Google Maps.",
            variant: "destructive"
          });
        }
      } else {
        initializeMap();
      }
    };
    
    const initializeMap = () => {
      setIsLoading(false);
      if (!mapRef.current) return;
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // Find center point (average of all occurrences)
      const validOccurrences = occurrences.filter(o => o.latitude && o.longitude);
      
      // Default to São Paulo coordinates if no valid occurrences
      let center = { lat: -23.550520, lng: -46.633308 };
      let zoom = 12;
      
      if (validOccurrences.length > 0) {
        const sumLat = validOccurrences.reduce((sum, o) => sum + (o.latitude || 0), 0);
        const sumLng = validOccurrences.reduce((sum, o) => sum + (o.longitude || 0), 0);
        center = { 
          lat: sumLat / validOccurrences.length, 
          lng: sumLng / validOccurrences.length 
        };
        
        // Adjust zoom based on number of occurrences
        if (validOccurrences.length === 1) zoom = 15;
        else if (validOccurrences.length <= 3) zoom = 13;
        else zoom = 12;
      }
      
      // Create or update map
      if (!googleMapRef.current && window.google) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false
        });
      } else if (googleMapRef.current) {
        googleMapRef.current.setCenter(center);
        googleMapRef.current.setZoom(zoom);
      }
      
      // Add markers for occurrences
      if (window.google) {
        validOccurrences.forEach(occurrence => {
          if (occurrence.latitude && occurrence.longitude && googleMapRef.current) {
            const marker = new window.google.maps.Marker({
              position: { lat: occurrence.latitude, lng: occurrence.longitude },
              map: googleMapRef.current,
              title: occurrence.titulo,
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });
            
            // Add info window
            const formattedDate = new Date(occurrence.data).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const infoContent = `
              <div style="padding: 10px; max-width: 200px;">
                <h3 style="margin-top: 0; font-weight: bold;">${occurrence.titulo}</h3>
                <p>${occurrence.local}</p>
                <p>Data: ${formattedDate}</p>
              </div>
            `;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent
            });
            
            marker.addListener('click', () => {
              infoWindow.open(googleMapRef.current, marker);
            });
            
            markersRef.current.push(marker);
          }
        });
      }
    };
    
    loadGoogleMaps();
  }, [occurrences, toast]);
  
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
        <div 
          id="occurrenceMap" 
          ref={mapRef} 
          className="w-full h-[300px] md:h-[400px] relative"
        >
          {occurrences.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
              <p className="text-gray-600 italic">
                Nenhuma ocorrência encontrada no período selecionado.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
        Exibindo {occurrences.length} ocorrências dos últimos {dateRange === '3m' ? '3' : dateRange === '6m' ? '6' : '12'} meses.
      </div>
    </Card>
  );
};

export default OccurrenceMap;
