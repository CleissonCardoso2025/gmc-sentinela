
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type GoogleMapsOptions = {
  callback?: string;
  apiKey?: string;
  libraries?: string[];
};

/**
 * Custom hook for loading and initializing Google Maps
 */
export const useGoogleMaps = (options: GoogleMapsOptions = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { toast } = useToast();
  const callbackName = options.callback || 'mapsCallback';
  
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }
    
    const loadGoogleMaps = () => {
      console.log("Loading Google Maps");
      
      // Define the callback function
      window[callbackName as keyof Window] = () => {
        console.log(`${callbackName} triggered`);
        setIsLoaded(true);
        setIsLoading(false);
      };
      
      // Check if the script already exists
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        return;
      }
      
      try {
        // Create and append the script
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        const apiKey = options.apiKey || 'AIzaSyAQWzSfxrMNrsQ64PhLJGrBZEYNjA4UJY0';
        const libraries = options.libraries?.join(',') || 'places';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        
        script.onerror = (error) => {
          console.error("Error loading Google Maps script", error);
          setLoadError(new Error('Failed to load Google Maps'));
          setIsLoading(false);
          toast({
            title: "Erro ao carregar o mapa",
            description: "Não foi possível carregar o Google Maps.",
            variant: "destructive"
          });
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error setting up Google Maps", error);
        setLoadError(error instanceof Error ? error : new Error('Unknown error loading Google Maps'));
        setIsLoading(false);
      }
    };
    
    loadGoogleMaps();
    
    return () => {
      // Clean up the callback when the component unmounts
      if (window[callbackName as keyof Window]) {
        delete window[callbackName as keyof Window];
      }
    };
  }, [callbackName, toast, options.apiKey, options.libraries]);
  
  return { isLoaded, isLoading, loadError };
};
