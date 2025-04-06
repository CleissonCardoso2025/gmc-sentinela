
import { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Geolocalização não é suportada pelo seu navegador."
      }));
      return;
    }
    
    const geoOptions = {
      enableHighAccuracy: options.enableHighAccuracy || true,
      timeout: options.timeout || 5000,
      maximumAge: options.maximumAge || 0
    };
    
    const successHandler = (position: GeolocationPosition) => {
      setState({
        loading: false,
        error: null,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
      });
    };
    
    const errorHandler = (error: GeolocationPositionError) => {
      console.error("Geolocation error:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Erro ao obter localização: ${error.message}`
      }));
      
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização atual.",
        variant: "destructive"
      });
    };
    
    setState(prev => ({ ...prev, loading: true }));
    
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      geoOptions
    );
    
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [toast, options.enableHighAccuracy, options.timeout, options.maximumAge]);
  
  return state;
};

