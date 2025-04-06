
import { supabase } from "@/integrations/supabase/client";

/**
 * Enable realtime updates for vehicle locations
 * This can be called from the application startup
 */
export const enableRealtimeForVehicleLocations = async () => {
  try {
    // Enable realtime for the channel
    await supabase.realtime.setConfig({
      presence: {
        key: 'vehicle-monitoring',
      },
    });
    
    console.log('Realtime enabled for vehicle locations');
    return true;
  } catch (error) {
    console.error('Error enabling realtime for vehicle locations:', error);
    return false;
  }
};
