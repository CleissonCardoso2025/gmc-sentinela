
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
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  // Use a valid API key - this is a crucial fix
  const API_KEY = 'AIzaSyBJAhQTTRpvYV6EzQgZhtm-gQHBCfwS2Tk'; // Using a valid API key
  
  useEffect(() => {
    if (window.google && window.google.maps) {
      console.log("Google Maps already loaded");
      setIsLoaded(true);
      setIsLoading(false);
      
      // If callback exists, trigger it
      if (window[callbackName as keyof Window] && typeof window[callbackName as keyof Window] === 'function') {
        window[callbackName as keyof Window]();
      }
      
      return;
    }
    
    const loadGoogleMaps = () => {
      console.log("Loading Google Maps with callback:", callbackName);
      
      // Define the callback function
      window[callbackName as keyof Window] = () => {
        console.log(`${callbackName} triggered`);
        setIsLoaded(true);
        setIsLoading(false);
      };
      
      // Check if the script already exists
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        console.log("Google Maps script already exists");
        return;
      }
      
      try {
        // Create and append the script
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        const apiKey = options.apiKey || API_KEY; // Use the provided valid API key
        const libraries = options.libraries?.join(',') || 'places';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&callback=${callbackName}&loading=async`;
        script.async = true;
        script.defer = true;
        scriptRef.current = script;
        
        script.onerror = (error) => {
          console.error("Error loading Google Maps script", error);
          setLoadError(new Error('Failed to load Google Maps'));
          setIsLoading(false);
          toast({
            title: "Erro ao carregar o mapa",
            description: "Não foi possível carregar o Google Maps. Verifique sua conexão com a internet.",
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
      
      // Optionally remove the script
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [callbackName, toast, options.apiKey, options.libraries]);
  
  return { isLoaded, isLoading, loadError };
};
