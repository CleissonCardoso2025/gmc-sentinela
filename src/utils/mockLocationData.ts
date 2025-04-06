
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';

type VehicleLocation = Database['public']['Tables']['vehicle_locations']['Insert'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface LocationParams {
  vehicleId: number;
  userId?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  accuracy?: number;
}

/**
 * Adds a mock location entry for testing
 */
export const addMockLocation = async (params: LocationParams) => {
  const { vehicleId, userId, latitude, longitude, locationName, accuracy } = params;
  
  const { data, error } = await supabase
    .from('vehicle_locations')
    .insert({
      vehicle_id: vehicleId,
      user_id: userId,
      latitude: latitude,
      longitude: longitude,
      location_name: locationName,
      accuracy: accuracy
    })
    .select();
  
  if (error) {
    console.error('Error adding location data:', error);
    throw error;
  }
  
  return data;
};

/**
 * Generates mock location data for all vehicles
 * This is just for testing purposes to simulate having location data
 */
export const generateMockLocationsForAllVehicles = async () => {
  try {
    // Get all vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id');
    
    if (vehiclesError) throw vehiclesError;
    if (!vehicles || vehicles.length === 0) return;
    
    // São Paulo coordinates (random points within the city)
    const baseLatitude = -23.55;
    const baseLongitude = -46.64;
    
    // Generate random locations for each vehicle
    for (const vehicle of vehicles) {
      // Generate coordinates within ~5km of São Paulo center
      const latitude = baseLatitude + (Math.random() - 0.5) * 0.1;
      const longitude = baseLongitude + (Math.random() - 0.5) * 0.1;
      
      await addMockLocation({
        vehicleId: vehicle.id,
        latitude: latitude,
        longitude: longitude,
        accuracy: Math.random() * 50, // Random accuracy between 0-50 meters
        locationName: null // Let the UI format based on coordinates
      });
    }
    
    console.log('Generated mock locations for all vehicles');
    return true;
  } catch (error) {
    console.error('Error generating mock locations:', error);
    return false;
  }
};
