import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Vehicle {
  id: number;
  placa: string;
  marca?: string;
  modelo?: string;
  condutor?: string;
  latitude?: number;
  longitude?: number;
  lastUpdate?: string;
  location_name?: string;
}

const VehicleTrackingMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { toast } = useToast();
  const googleMapsLoaded = useRef(false);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});
  const mapInitialized = useRef(false);
  
  useEffect(() => {
    const fetchVehicleLocations = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_latest_vehicle_locations');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const vehicleIds = data.map(location => location.vehicle_id);
          
          const { data: vehiclesData, error: vehiclesError } = await supabase
            .from('vehicles')
            .select('*')
            .in('id', vehicleIds);
          
          if (vehiclesError) {
            throw vehiclesError;
          }
          
          const vehiclesWithLocation = vehiclesData?.map(vehicle => {
            const location = data.find(loc => loc.vehicle_id === vehicle.id);
            return {
              ...vehicle,
              latitude: location?.latitude,
              longitude: location?.longitude,
              lastUpdate: location?.recorded_at,
              location_name: location?.location_name
            };
          }) || [];
          
          setVehicles(vehiclesWithLocation);
        }
      } catch (error) {
        console.error("Error fetching vehicle locations:", error);
        toast({
          title: "Erro ao carregar localizações",
          description: "Não foi possível obter as localizações das viaturas.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicleLocations();
    
    const intervalId = setInterval(fetchVehicleLocations, 60000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  const initializeMap = () => {
    console.log("Initializing vehicle tracking map");
    if (!mapRef.current) return;
    
    googleMapsLoaded.current = true;
    setIsLoading(false);
    
    const validVehicles = vehicles.filter(v => v.latitude && v.longitude);
    
    let center = { lat: -23.550520, lng: -46.633308 };
    
    if (validVehicles.length > 0) {
      const sumLat = validVehicles.reduce((sum, v) => sum + (v.latitude || 0), 0);
      const sumLng = validVehicles.reduce((sum, v) => sum + (v.longitude || 0), 0);
      center = { 
        lat: sumLat / validVehicles.length, 
        lng: sumLng / validVehicles.length 
      };
    }
    
    if (window.google && !googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        styles: [
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
      
      validVehicles.forEach(vehicle => {
        if (vehicle.latitude && vehicle.longitude && googleMapRef.current) {
          const marker = new window.google.maps.Marker({
            position: { lat: vehicle.latitude, lng: vehicle.longitude },
            map: googleMapRef.current,
            title: `${vehicle.placa} - ${vehicle.modelo || ""}`,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/police.png",
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });
          
          const infoContent = `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin-top: 0; font-weight: bold;">${vehicle.placa}</h3>
              <p>${vehicle.marca || ""} ${vehicle.modelo || ""}</p>
              ${vehicle.condutor ? `<p>Condutor: ${vehicle.condutor}</p>` : ''}
              ${vehicle.location_name ? `<p>Local: ${vehicle.location_name}</p>` : ''}
              <p>Última atualização: ${formatDate(vehicle.lastUpdate || '')}</p>
            </div>
          `;
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: infoContent
          });
          
          marker.addListener('click', () => {
            infoWindow.open(googleMapRef.current, marker);
          });
          
          markersRef.current[vehicle.id] = marker;
        }
      });
    }
    
    mapInitialized.current = true;
  };
  
  useEffect(() => {
    if (isLoading || googleMapsLoaded.current || !mapRef.current) return;
    
    const loadGoogleMaps = () => {
      console.log("Loading Google Maps for vehicle tracking");
      
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }
      
      window.mapsCallback = () => {
        console.log("Maps callback triggered - vehicle tracking");
        initializeMap();
      };
      
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      const apiKey = 'AIzaSyAQWzSfxrMNrsQ64PhLJGrBZEYNjA4UJY0';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=mapsCallback`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        console.error("Error loading Google Maps script");
        toast({
          title: "Erro ao carregar o mapa",
          description: "Não foi possível carregar o Google Maps.",
          variant: "destructive"
        });
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleMaps();
    
    return () => {
      if (mapInitialized.current) {
        Object.values(markersRef.current).forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
    };
  }, [isLoading, vehicles, toast]);
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Desconhecido';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  const getUserLocation = () => {
    if (navigator.geolocation && googleMapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          googleMapRef.current?.setCenter(userPos);
          googleMapRef.current?.setZoom(14);
          
          if (window.google && googleMapRef.current) {
            new window.google.maps.Marker({
              position: userPos,
              map: googleMapRef.current,
              title: "Sua localização",
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });
          }
          
          toast({
            title: "Localização encontrada",
            description: "O mapa foi centralizado na sua localização atual."
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast({
            title: "Erro de localização",
            description: "Não foi possível obter sua localização atual.",
            variant: "destructive"
          });
        }
      );
    }
  };
  
  return (
    <Card className="w-full overflow-hidden shadow-md relative animate-fade-up">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-lg font-semibold text-gray-800">Rastreamento de Viaturas</h2>
      </div>
      
      {isLoading ? (
        <div className="w-full h-[300px] md:h-[400px] p-4 flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[250px] md:h-[350px] w-full rounded-md" />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div 
            id="vehicleTrackingMap" 
            ref={mapRef} 
            className="w-full h-[300px] md:h-[400px]"
          />
          
          <div className="p-4 border-t">
            <h3 className="font-semibold mb-2">Viaturas Monitoradas: {vehicles.length}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {vehicles.slice(0, 4).map(vehicle => (
                <div key={vehicle.id} className="p-2 border rounded-md text-sm">
                  <p className="font-medium">{vehicle.placa}</p>
                  <p className="text-gray-600 text-xs">
                    {vehicle.modelo} • Última atualização: {formatDate(vehicle.lastUpdate || '')}
                  </p>
                </div>
              ))}
            </div>
            
            {vehicles.length > 4 && (
              <p className="text-sm text-gray-500 mt-2">
                + {vehicles.length - 4} viaturas não exibidas
              </p>
            )}
            
            <div className="mt-4">
              <button 
                onClick={getUserLocation}
                className="text-xs bg-gcm-600 text-white px-3 py-1 rounded-md hover:bg-gcm-700 transition-colors"
              >
                Ir para minha localização
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VehicleTrackingMap;
