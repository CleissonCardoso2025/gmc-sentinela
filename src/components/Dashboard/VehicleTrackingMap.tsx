
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicleLocations } from "@/hooks/use-vehicle-locations";
import VehicleList from "./VehicleList";
import { useToast } from "@/hooks/use-toast";
import GoogleMapComponent from '../Map/GoogleMap';
import { MapMarker } from '@/types/maps';
import { useGeolocation } from '@/hooks/use-geolocation';
import { formatDateBR } from '@/utils/maps-utils';

const VehicleTrackingMap: React.FC = () => {
  const { vehicles, isLoading: vehiclesLoading, refetchVehicles } = useVehicleLocations();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const geolocation = useGeolocation();
  
  // If failed to load vehicles, retry with exponential backoff
  useEffect(() => {
    if (vehiclesLoading && retryCount < 3) {
      const timeout = setTimeout(() => {
        console.log(`Retrying vehicle load (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        refetchVehicles();
      }, Math.pow(2, retryCount) * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [vehiclesLoading, retryCount, refetchVehicles]);
  
  // Prepare markers for the map
  const markers: MapMarker[] = vehicles
    .filter(v => v.latitude && v.longitude)
    .map(vehicle => ({
      id: vehicle.id,
      position: [vehicle.latitude || -23.550520, vehicle.longitude || -46.633308],
      title: `${vehicle.placa} - ${vehicle.modelo || ""}`,
      content: `
        <div>
          <p>${vehicle.marca || ""} ${vehicle.modelo || ""}</p>
          ${vehicle.condutor ? `<p>Condutor: ${vehicle.condutor}</p>` : ''}
          ${vehicle.location_name ? `<p>Local: ${vehicle.location_name}</p>` : ''}
          <p>Última atualização: ${formatDateBR(vehicle.lastUpdate || '')}</p>
        </div>
      `,
      icon: 'police'
    }));
  
  // Add user's location as a marker if available
  const allMarkers = [...markers];
  if (geolocation.location.latitude && geolocation.location.longitude) {
    allMarkers.push({
      id: 'user-location',
      position: [geolocation.location.latitude, geolocation.location.longitude],
      title: 'Sua localização',
      icon: 'default'
    });
  }
  
  // Calculate center point - prioritize user location if available
  const calculateCenter = () => {
    if (geolocation.location.latitude && geolocation.location.longitude) {
      return {
        lat: geolocation.location.latitude,
        lng: geolocation.location.longitude
      };
    }
    
    const validVehicles = vehicles.filter(v => v.latitude && v.longitude);
    if (validVehicles.length === 0) {
      // Default to São Paulo if no valid coordinates
      return { lat: -23.550520, lng: -46.633308 };
    }
    
    const sumLat = validVehicles.reduce((sum, v) => sum + (v.latitude || 0), 0);
    const sumLng = validVehicles.reduce((sum, v) => sum + (v.longitude || 0), 0);
    
    return {
      lat: sumLat / validVehicles.length,
      lng: sumLng / validVehicles.length
    };
  };
  
  const handleRefresh = () => {
    refetchVehicles();
    toast({
      title: "Atualizando dados",
      description: "Buscando a localização mais recente das viaturas."
    });
  };
  
  const handleGetUserLocation = () => {
    if (geolocation.error) {
      toast({
        title: "Erro de localização",
        description: geolocation.error,
        variant: "destructive"
      });
      return;
    }
    
    if (geolocation.location.latitude && geolocation.location.longitude) {
      toast({
        title: "Localização encontrada",
        description: "O mapa foi centralizado na sua localização atual."
      });
    } else {
      toast({
        title: "Obtendo localização",
        description: "Aguarde enquanto obtemos sua localização atual."
      });
    }
  };
  
  // Add mock data explicitly if vehicles array is empty
  useEffect(() => {
    if (!vehiclesLoading && vehicles.length === 0) {
      console.log("No vehicles found, using mock data");
    }
  }, [vehicles, vehiclesLoading]);
  
  return (
    <Card className="w-full overflow-hidden shadow-md relative animate-fade-up">
      {vehiclesLoading ? (
        <div className="w-full h-[300px] md:h-[400px] p-4 flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[250px] md:h-[350px] w-full rounded-md" />
          </div>
        </div>
      ) : (
        <div className="w-full" style={{ position: 'relative', zIndex: 1 }}>
          <GoogleMapComponent 
            center={calculateCenter()} 
            markers={allMarkers}
            zoom={13}
            height="h-[300px] md:h-[400px]"
            markerType="police"
            showUserLocation={true}
          />
          
          {vehicles.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
              <p className="text-gray-600 italic">
                Nenhuma viatura encontrada. Adicione viaturas na seção de Gestão de Viaturas.
              </p>
            </div>
          )}
          
          <VehicleList vehicles={vehicles} />
          
          <div className="p-4 pt-0 flex space-x-2">
            <button 
              onClick={handleGetUserLocation}
              className="text-xs bg-gcm-600 text-white px-3 py-1 rounded-md hover:bg-gcm-700 transition-colors"
              disabled={geolocation.loading}
            >
              Ir para minha localização
            </button>
            <button 
              onClick={handleRefresh}
              className="text-xs bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            >
              Atualizar dados
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VehicleTrackingMap;
