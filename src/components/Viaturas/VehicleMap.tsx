
import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Car, MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface VehicleMapProps {
  vehicleId: number;
  vehicleInfo?: {
    placa: string;
    status: string;
    condutor?: string;
  };
}

type VehicleLocation = Database['public']['Tables']['vehicle_locations']['Row'];

/**
 * Vehicle Map component using Google Maps to display vehicle location
 */
const VehicleMap: React.FC<VehicleMapProps> = ({ vehicleId, vehicleInfo }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { data: location, isLoading, error } = useQuery({
    queryKey: ['vehicleLocation', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_locations')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as VehicleLocation;
    }
  });

  // Load Google Maps API
  useEffect(() => {
    // Check if the API is already loaded
    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    // Get the API key from localStorage
    const apiKey = localStorage.getItem('googleMapsApiKey');
    
    if (!apiKey) {
      console.warn('Google Maps API key not found. Please add it in the Settings page.');
      return;
    }

    // Load the API if not already loaded
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    }

    // Setup realtime subscription for this vehicle's location
    const channel = supabase
      .channel('vehicle-location-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vehicle_locations',
          filter: `vehicle_id=eq.${vehicleId}`
        },
        (payload) => {
          const newLocation = payload.new as VehicleLocation;
          updateMapMarker(newLocation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vehicleId]);

  // Initialize map when location data is available and maps are loaded
  useEffect(() => {
    if (!location || !mapLoaded || !window.google?.maps || !mapContainerRef.current) return;
    
    // Initialize map if not already initialized
    if (!map) {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      };

      const newMap = new google.maps.Map(mapContainerRef.current, mapOptions);
      setMap(newMap);

      // Add marker for vehicle
      updateMapMarker(location, newMap);
    } else {
      // Update existing map with new location
      updateMapMarker(location, map);
    }
  }, [location, mapLoaded, map]);

  // Function to update the marker position
  const updateMapMarker = (newLocation: VehicleLocation, newMap?: google.maps.Map) => {
    if (!newLocation) return;
    const currentMap = newMap || map;
    if (!currentMap || !window.google?.maps) return;

    const position = { 
      lat: newLocation.latitude, 
      lng: newLocation.longitude 
    };

    // Center map on new position
    currentMap.setCenter(position);

    // Update or create marker
    if (marker) {
      marker.setPosition(position);
    } else {
      const newMarker = new google.maps.Marker({
        position,
        map: currentMap,
        title: vehicleInfo?.placa || `Veículo #${vehicleId}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: getStatusColor(vehicleInfo?.status),
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: 'white',
        },
      });

      // Add info window with vehicle details
      if (vehicleInfo) {
        const infoContent = `
          <div style="padding:8px">
            <h3 style="margin:0;font-weight:bold">${vehicleInfo.placa}</h3>
            <p style="margin:4px 0">Status: ${vehicleInfo.status}</p>
            ${vehicleInfo.condutor ? `<p style="margin:4px 0">Condutor: ${vehicleInfo.condutor}</p>` : ''}
            <p style="margin:4px 0;font-size:12px">Última atualização: ${new Date(newLocation.recorded_at).toLocaleString('pt-BR')}</p>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: infoContent,
        });

        newMarker.addListener('click', () => {
          infoWindow.open(currentMap, newMarker);
        });
      }

      setMarker(newMarker);
    }
  };

  // Helper to get color based on status
  const getStatusColor = (status?: string): string => {
    if (!status) return '#888';
    
    switch (status.toLowerCase()) {
      case 'em serviço':
        return '#22c55e'; // green-500
      case 'manutenção':
        return '#eab308'; // yellow-500
      case 'inoperante':
        return '#ef4444'; // red-500
      case 'reserva':
        return '#3b82f6'; // blue-500
      default:
        return '#888888';
    }
  };

  // Format date for display
  const formattedDate = location ? new Date(location.recorded_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : '';
  
  const formattedTime = location ? new Date(location.recorded_at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center">Carregando...</div>;
  }

  if (error || !location) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        Erro ao carregar localização
      </div>
    );
  }

  // Check if API key is set
  const apiKey = localStorage.getItem('googleMapsApiKey');
  if (!apiKey) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <div className="text-amber-500 mb-2">⚠️ Chave da API do Google Maps não configurada</div>
        <p className="mb-4">
          Para visualizar o mapa, você precisa configurar a chave da API do Google Maps nas configurações.
        </p>
        <a href="/configuracoes" className="text-blue-500 hover:underline">
          Ir para Configurações
        </a>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="bg-white h-full w-full flex flex-col gap-4 rounded-md border p-4">
        <div id="vehicle-map" ref={mapContainerRef} className="h-[350px] w-full rounded-md shadow-sm"></div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left text-sm">
          <p className="text-gray-600">Latitude:</p>
          <p>{location.latitude.toFixed(6)}</p>
          
          <p className="text-gray-600">Longitude:</p>
          <p>{location.longitude.toFixed(6)}</p>
          
          <p className="text-gray-600">Data/Hora:</p>
          <p>{formattedDate} às {formattedTime}</p>
          
          {location.accuracy && (
            <>
              <p className="text-gray-600">Precisão:</p>
              <p>{location.accuracy.toFixed(1)} metros</p>
            </>
          )}
          
          {location.location_name && (
            <>
              <p className="text-gray-600">Local:</p>
              <p>{location.location_name}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleMap;
