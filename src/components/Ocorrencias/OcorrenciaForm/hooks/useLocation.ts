
import { useState, useEffect } from 'react';
import { MapMarker } from '@/types/maps';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLocation = (setLocal: (value: string) => void) => {
  const [position, setPosition] = useState<MapMarker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<GeolocationPositionError | null>(null);

  const handleMapClick = (marker: MapMarker) => {
    setPosition(marker);
    
    // Close map after selection
    setShowMap(false);
    
    // Reverse geocode the location if possible
    reverseGeocode(marker.lat, marker.lng);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { lat, lng, mode: 'reverse' }
      });
      
      if (error) throw error;
      
      if (data && data.address) {
        setLocal(data.address);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      // Still set coordinates as fallback
      setLocal(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada pelo seu navegador');
      setLocationLoading(false);
      return;
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      setPosition({
        lat: latitude,
        lng: longitude
      });
      
      await reverseGeocode(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      if (error instanceof GeolocationPositionError) {
        setLocationError(error);
        
        let errorMessage = 'Erro ao obter localização';
        if (error.code === 1) {
          errorMessage = 'Permissão para acessar a localização foi negada';
        } else if (error.code === 2) {
          errorMessage = 'Localização indisponível';
        } else if (error.code === 3) {
          errorMessage = 'Tempo esgotado ao obter localização';
        }
        
        toast.error(errorMessage);
      } else {
        toast.error('Erro ao obter localização');
      }
    } finally {
      setLocationLoading(false);
    }
  };

  const resetLocation = () => {
    setPosition(null);
    setShowMap(false);
    setLocationError(null);
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
