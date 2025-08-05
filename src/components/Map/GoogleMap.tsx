import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapMarker } from '@/types/maps';
import { getApiKey } from '@/services/systemConfigService';

export interface GoogleMapComponentProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showUserLocation?: boolean;
  draggable?: boolean;
  onClick?: (marker: MapMarker) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  markers = [],
  center = [-23.5505, -46.6333], // Default to São Paulo
  zoom = 12,
  className = '',
  showUserLocation = false,
  draggable = true,
  onClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [googleMarkers, setGoogleMarkers] = useState<google.maps.Marker[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar a chave da API do Google Maps
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await getApiKey('google_maps');
        setApiKey(key);
        if (!key) {
          setError('Chave da API Google Maps não configurada');
        }
      } catch (err) {
        console.error('Erro ao carregar chave da API:', err);
        setError('Falha ao carregar chave da API Google Maps');
      }
    };

    loadApiKey();
  }, []);

  // Carregar o script da API do Google Maps
  useEffect(() => {
    if (!apiKey) return;

    const loadGoogleMapsScript = () => {
      // Verificar se o script já está carregado
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Criar e carregar o script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setError('Falha ao carregar API do Google Maps');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      // Limpar marcadores ao desmontar
      if (googleMarkers.length) {
        googleMarkers.forEach(marker => marker.setMap(null));
      }
    };
  }, [apiKey]);

  // Inicializar o mapa
  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: center[0], lng: center[1] },
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        draggable,
      });

      setMapInstance(map);
      setIsLoading(false);

      // Adicionar evento de clique no mapa
      if (onClick) {
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          
          const newMarker: MapMarker = {
            id: `marker-${Date.now()}`,
            position: [lat, lng],
            title: 'Localização selecionada',
            lat,
            lng,
          };
          
          onClick(newMarker);
        });
      }

      // Mostrar localização do usuário se solicitado
      if (showUserLocation) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              
              // Centralizar no usuário
              map.setCenter(userLocation);
              
              // Adicionar marcador do usuário
              new google.maps.Marker({
                position: userLocation,
                map,
                title: 'Sua localização',
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                },
              });
            },
            () => {
              console.warn('Erro ao obter localização do usuário');
            }
          );
        }
      }
    } catch (err) {
      console.error('Erro ao inicializar mapa:', err);
      setError('Falha ao inicializar o mapa');
      setIsLoading(false);
    }
  };

  // Atualizar marcadores quando os props mudarem
  useEffect(() => {
    if (!mapInstance) return;

    // Limpar marcadores existentes
    googleMarkers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Adicionar novos marcadores
    markers.forEach(marker => {
      const googleMarker = new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: mapInstance,
        title: marker.title,
        icon: marker.icon ? marker.icon : undefined,
      });

      // Adicionar info window se houver conteúdo
      if (marker.content) {
        const infoWindow = new google.maps.InfoWindow({
          content: marker.content,
        });

        googleMarker.addListener('click', () => {
          infoWindow.open(mapInstance, googleMarker);
        });
      }

      newMarkers.push(googleMarker);
    });

    setGoogleMarkers(newMarkers);
  }, [markers, mapInstance]);

  // Atualizar centro do mapa quando o prop center mudar
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.setCenter({ lat: center[0], lng: center[1] });
  }, [center, mapInstance]);

  // Atualizar zoom quando o prop zoom mudar
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.setZoom(zoom);
  }, [zoom, mapInstance]);

  if (error) {
    return (
      <div className={`flex items-center justify-center w-full h-full min-h-[200px] bg-gray-100 border rounded-md ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500 font-medium">Erro ao carregar o mapa</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className={`w-full h-full min-h-[200px] ${className}`} />;
  }

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[200px] ${className}`}
    />
  );
};

export default GoogleMapComponent;
