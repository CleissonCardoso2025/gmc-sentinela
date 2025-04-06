
import { supabase } from "@/integrations/supabase/client";

/**
 * Enable realtime updates for vehicle locations
 * This can be called from the application startup
 */
export const enableRealtimeForVehicleLocations = async () => {
  try {
    // Create and subscribe to a channel for vehicle monitoring
    const channel = supabase.channel('vehicle-monitoring');
    
    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Realtime enabled for vehicle locations');
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error enabling realtime for vehicle locations:', error);
    return false;
  }
};
