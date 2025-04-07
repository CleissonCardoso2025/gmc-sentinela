
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Vehicle {
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

export const useVehicleLocations = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchVehicleLocations = useCallback(async () => {
    console.log("Fetching vehicle locations");
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .rpc('get_latest_vehicle_locations');
      
      if (error) {
        throw error;
      }
      
      console.log("Vehicle locations data:", data);
      
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
        
        console.log("Vehicles with location:", vehiclesWithLocation);
        setVehicles(vehiclesWithLocation);
      } else {
        // Always provide mock data for development purposes when no real data exists
        const mockVehicles: Vehicle[] = [
          {
            id: 1,
            placa: "GCM-1234",
            marca: "Chevrolet",
            modelo: "Spin",
            condutor: "Carlos Silva",
            latitude: -23.550520,
            longitude: -46.633308,
            lastUpdate: new Date().toISOString(),
            location_name: "Centro, São Paulo"
          },
          {
            id: 2,
            placa: "GCM-5678",
            marca: "Toyota",
            modelo: "Hilux",
            condutor: "Ana Oliveira",
            latitude: -23.555520,
            longitude: -46.639308,
            lastUpdate: new Date().toISOString(),
            location_name: "Bela Vista, São Paulo"
          }
        ];
        
        console.log("Using mock vehicle data for development");
        setVehicles(mockVehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicle locations:", error);
      toast({
        title: "Erro ao carregar localizações",
        description: "Não foi possível obter as localizações das viaturas. Usando dados fictícios.",
        variant: "destructive"
      });
      
      // Provide mock data even in case of error
      const mockVehicles: Vehicle[] = [
        {
          id: 1,
          placa: "GCM-1234",
          marca: "Chevrolet",
          modelo: "Spin",
          condutor: "Carlos Silva",
          latitude: -23.550520,
          longitude: -46.633308,
          lastUpdate: new Date().toISOString(),
          location_name: "Centro, São Paulo"
        },
        {
          id: 2,
          placa: "GCM-5678",
          marca: "Toyota",
          modelo: "Hilux",
          condutor: "Ana Oliveira",
          latitude: -23.555520,
          longitude: -46.639308,
          lastUpdate: new Date().toISOString(),
          location_name: "Bela Vista, São Paulo"
        }
      ];
      
      setVehicles(mockVehicles);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVehicleLocations();
    
    const intervalId = setInterval(fetchVehicleLocations, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchVehicleLocations]);

  return { 
    vehicles, 
    isLoading,
    refetchVehicles: fetchVehicleLocations
  };
};
