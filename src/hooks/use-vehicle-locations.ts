
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the interface for the vehicle location data
export interface VehicleData {
  id: number;
  plate: string;
  status: string;
  type: string;
  marker_color: string;
  last_location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    location_name?: string;
  };
}

// Define the interface for the query response data
export interface VehicleQueryResponse {
  data: VehicleData[];
  error: Error | null;
}

// Define the interface for the data returned from the get_latest_vehicle_locations function
interface VehicleLocation {
  user_id: string;
  vehicle_id: number; 
  latitude: number;
  longitude: number;
  recorded_at: string;
  location_name?: string;
}

export const useVehicleLocations = () => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Query to get vehicle data
  const { data: vehicleData, isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("id");
      
      return { data, error } as VehicleQueryResponse;
    },
  });

  // Query to get latest locations
  const { data: locationData, isLoading: locationsLoading } = useQuery({
    queryKey: ["vehicle_locations"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_latest_vehicle_locations");
      
      if (error) {
        throw error;
      }
      
      return data as VehicleLocation[];
    },
    // Refresh every minute
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (vehicleData?.error) {
      setError(vehicleData.error);
      toast.error("Falha ao carregar dados das viaturas");
      setIsLoading(false);
      return;
    }

    if (!vehicleData?.data || vehiclesLoading || locationsLoading) {
      setIsLoading(true);
      return;
    }

    try {
      // Combine vehicle data with location data
      const enrichedVehicles = vehicleData.data.map((vehicle) => {
        // Find matching location for this vehicle
        const location = locationData?.find(
          (loc) => loc.vehicle_id === vehicle.id
        );

        if (location) {
          return {
            ...vehicle,
            last_location: {
              latitude: location.latitude,
              longitude: location.longitude,
              timestamp: location.recorded_at,
              location_name: location.location_name || "Localização desconhecida",
            },
          };
        }

        return vehicle;
      });

      setVehicles(enrichedVehicles);
    } catch (err) {
      console.error("Error processing vehicle data:", err);
      setError(err as Error);
      toast.error("Erro ao processar dados de localização");
    } finally {
      setIsLoading(false);
    }
  }, [vehicleData, locationData, vehiclesLoading, locationsLoading]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: () => {
      // Both queries will be refetched
    },
  };
};
