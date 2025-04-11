
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
        // No mock data - just set empty array
        setVehicles([]);
      }
    } catch (error) {
      console.error("Error fetching vehicle locations:", error);
      toast({
        title: "Erro ao carregar localizações",
        description: "Não foi possível obter as localizações das viaturas.",
        variant: "destructive"
      });
      
      // No mock data on error - just set empty array
      setVehicles([]);
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
