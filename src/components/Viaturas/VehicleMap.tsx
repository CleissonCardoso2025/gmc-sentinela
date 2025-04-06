
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface VehicleMapProps {
  vehicleId: number;
}

type VehicleLocation = Database['public']['Tables']['vehicle_locations']['Row'];

/**
 * This is a placeholder component that would use react-native-maps
 * in a React Native application. For web, we're displaying the coordinates.
 */
const VehicleMap: React.FC<VehicleMapProps> = ({ vehicleId }) => {
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

  // Format date for display
  const formattedDate = new Date(location.recorded_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const formattedTime = new Date(location.recorded_at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="bg-gray-100 h-full w-full flex items-center justify-center rounded-md border p-4">
        <div className="text-center space-y-2">
          <h3 className="font-medium">Informações de Localização</h3>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left mt-4">
            <p className="text-gray-600">Latitude:</p>
            <p>{location.latitude.toFixed(6)}</p>
            
            <p className="text-gray-600">Longitude:</p>
            <p>{location.longitude.toFixed(6)}</p>
            
            <p className="text-gray-600">Data:</p>
            <p>{formattedDate}</p>
            
            <p className="text-gray-600">Hora:</p>
            <p>{formattedTime}</p>
            
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
          
          <div className="mt-4">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Abrir no Google Maps
            </a>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center">
        Este é um componente temporário. Para implementação completa, será necessário utilizar o componente 
        react-native-maps no aplicativo móvel.
      </p>
    </div>
  );
};

export default VehicleMap;
