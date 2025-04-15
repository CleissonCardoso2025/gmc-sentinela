
import { useState } from 'react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapMarker } from '@/types/maps';

export const useLocation = (setLocal: (value: string) => void) => {
  const [position, setPosition] = useState<MapMarker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const { location, loading: locationLoading, error: locationError, refreshPosition } = useGeolocation();
  const { toast } = useToast();

  const handleMapClick = (marker: MapMarker) => {
    setPosition(marker);
    setLocal(marker.address || 'Endereço não identificado');
    setShowMap(false);
  };

  const handleGetCurrentLocation = async () => {
    try {
      toast({
        title: "Buscando localização",
        description: "Obtendo sua localização atual...",
      });

      refreshPosition();

      if (location.latitude && location.longitude) {
        setPosition({
          id: 'current-location',
          position: [location.latitude, location.longitude],
          title: 'Localização Atual',
          lat: location.latitude,
          lng: location.longitude,
          address: 'Obtendo endereço...'
        });

        try {
          const { data, error } = await supabase.functions.invoke('geocode', {
            body: {
              address: `${location.latitude},${location.longitude}`,
              reverse: true
            }
          });

          if (error) {
            console.error('Error getting address:', error);
            toast({
              title: "Erro ao obter endereço",
              description: "Suas coordenadas foram salvas, mas não foi possível obter o endereço completo.",
              variant: "destructive"
            });
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            return;
          }

          if (data && data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setLocal(address);
            toast({
              title: "Localização obtida",
              description: "Endereço encontrado com sucesso."
            });
          } else {
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            toast({
              title: "Localização obtida",
              description: "Endereço não identificado, apenas coordenadas.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
          toast({
            title: "Localização obtida",
            description: "Endereço não identificado, apenas coordenadas.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
        variant: "destructive"
      });
    }
  };

  const resetLocation = () => {
    setPosition(null);
    setShowMap(false);
  };

  return {
    position,
    setPosition,
    showMap,
    setShowMap,
    handleMapClick,
    locationLoading,
    locationError,
    handleGetCurrentLocation,
    resetLocation
  };
};
