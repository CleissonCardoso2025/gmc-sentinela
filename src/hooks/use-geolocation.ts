
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
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
    setState(prev => ({ ...prev, loading: true }));
    
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
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido ao obter localização"
      }));
      
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização atual. Verifique as permissões do navegador.",
        variant: "destructive"
      });
    }
  }, [getPosition, toast]);
  
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
          setState(prev => ({
            ...prev,
            loading: false,
            error: `Erro ao monitorar localização: ${error.message}`
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
