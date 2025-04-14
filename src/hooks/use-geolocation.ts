
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: {
    latitude: number | null;
    longitude: number | null;
    accuracy?: number;
    timestamp?: number;
  };
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    location: {
      latitude: null,
      longitude: null,
    }
  });
  
  const getPosition = useCallback(async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não é suportada pelo seu navegador."));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: options.enableHighAccuracy !== false, // Default to true
        timeout: options.timeout || 10000, // Increase timeout to 10s
        maximumAge: options.maximumAge || 0 // Don't use cached positions
      });
    });
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);
  
  const updatePosition = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const position = await getPosition();
      
      setState({
        loading: false,
        error: null,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        }
      });
      
      console.log("Geolocation updated:", {
        lat: position.coords.latitude, 
        lng: position.coords.longitude,
        accuracy: `${position.coords.accuracy} meters`
      });
    } catch (error) {
      console.error("Geolocation error:", error);
      
      // Convert error to string to ensure we're not trying to stringify an empty object
      let errorMessage = "Erro desconhecido ao obter localização";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        // GeolocationPositionError handling
        if ('code' in error && 'message' in error) {
          switch ((error as GeolocationPositionError).code) {
            case 1:
              errorMessage = "Acesso à localização negado. Verifique as permissões do navegador.";
              break;
            case 2:
              errorMessage = "Localização indisponível no momento. Tente novamente.";
              break;
            case 3:
              errorMessage = "Tempo limite excedido ao obter localização.";
              break;
          }
        }
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      toast.error("Não foi possível obter sua localização atual. Verifique as permissões do navegador.", {
        description: errorMessage
      });
    }
  }, [getPosition]);
  
  useEffect(() => {
    // Initial position update
    updatePosition();
    
    // Setup watchPosition for continuous updates
    let watchId: number | null = null;
    
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setState({
            loading: false,
            error: null,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            }
          });
          
          console.log("Geolocation watch update:", {
            lat: position.coords.latitude, 
            lng: position.coords.longitude,
            accuracy: `${position.coords.accuracy} meters`
          });
        },
        (error) => {
          console.error("Geolocation watch error:", error);
          
          // Same error handling as in updatePosition
          let errorMessage = "Erro ao monitorar localização";
          
          // Properly type-check the error
          if (error instanceof GeolocationPositionError) {
            switch (error.code) {
              case 1:
                errorMessage = "Acesso à localização negado. Verifique as permissões do navegador.";
                break;
              case 2:
                errorMessage = "Localização indisponível no momento. Tente novamente.";
                break;
              case 3:
                errorMessage = "Tempo limite excedido ao obter localização.";
                break;
            }
          } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
          }
          
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage
          }));
        },
        {
          enableHighAccuracy: options.enableHighAccuracy !== false,
          timeout: options.timeout || 10000,
          maximumAge: options.maximumAge || 0
        }
      );
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [updatePosition, options.enableHighAccuracy, options.timeout, options.maximumAge]);
  
  // Provide a method to manually refresh the position
  return {
    ...state,
    refreshPosition: updatePosition
  };
};
