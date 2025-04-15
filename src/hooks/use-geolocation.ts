
import { useState, useEffect, useCallback } from 'react';

interface GeolocationPosition {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number | null;
  timestamp?: number | null;
}

interface UseGeolocationReturn {
  location: GeolocationPosition;
  loading: boolean;
  error: string | null;
  refreshPosition: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationPosition>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const clearWatch = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.latitude,
      longitude: position.longitude,
      accuracy: position.accuracy || null,
      timestamp: position.timestamp || Date.now(),
    });
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((error: any) => {
    setLoading(false);
    
    let errorMessage = 'Erro desconhecido ao obter localização';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case 1:
          errorMessage = 'Permissão de localização negada';
          break;
        case 2:
          errorMessage = 'Localização indisponível';
          break;
        case 3:
          errorMessage = 'Tempo de espera esgotado';
          break;
        default:
          errorMessage = `Erro de localização: ${error.message || 'Desconhecido'}`;
      }
    }
    
    setError(errorMessage);
  }, []);

  const refreshPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada por este navegador');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Clear any existing watch
      clearWatch();

      // Get current position first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSuccess({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });

          // Then start watching position
          const id = navigator.geolocation.watchPosition(
            (watchPosition) => {
              handleSuccess({
                latitude: watchPosition.coords.latitude,
                longitude: watchPosition.coords.longitude,
                accuracy: watchPosition.coords.accuracy,
                timestamp: watchPosition.timestamp,
              });
            },
            (err) => handleError(err),
            {
              enableHighAccuracy: true,
              maximumAge: 30000,
              timeout: 27000,
            }
          );

          setWatchId(id);
        },
        (err) => handleError(err),
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        }
      );
    } catch (err) {
      handleError(err);
    }
  }, [clearWatch, handleSuccess, handleError]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearWatch();
  }, [clearWatch]);

  return {
    location,
    loading,
    error,
    refreshPosition,
  };
};
