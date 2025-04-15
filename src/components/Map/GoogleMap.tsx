
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapMarker } from '@/types/maps';
import { supabase } from '@/integrations/supabase/client';

// Cache for the script loading state to prevent multiple loads
const scriptCache = {
  loaded: false,
  loading: false,
  callbacks: [] as (() => void)[],
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export interface GoogleMapComponentProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showUserLocation?: boolean;
  draggable?: boolean;
  onClick?: (marker: MapMarker) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  markers = [],
  center = [-23.5505, -46.6333], // Default to São Paulo
  zoom = 12,
  className = '',
  showUserLocation = false,
  draggable = false,
  onClick,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(scriptCache.loaded);
  const [isMapReady, setIsMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load the Google Maps script with the API key
  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      // If script is already loaded or loading, don't proceed
      if (scriptCache.loaded || scriptCache.loading) {
        if (scriptCache.loaded) {
          setIsScriptLoaded(true);
        } else {
          // If script is currently loading, register a callback
          scriptCache.callbacks.push(() => setIsScriptLoaded(true));
        }
        return;
      }

      try {
        scriptCache.loading = true;
        
        // Fetch API key from Supabase Edge Function
        const { data: configData, error: configError } = await supabase
          .from('app_config')
          .select('value')
          .eq('key', 'google_maps_api_key')
          .single();
          
        // Fallback to environment variable if DB lookup fails
        let apiKey = '';
        if (configError) {
          console.warn('Failed to fetch API key from database, using environment variable', configError);
          apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        } else {
          apiKey = configData?.value || '';
        }
        
        if (!apiKey) {
          throw new Error('Google Maps API key not found');
        }

        // Create and load the script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=googleMapsCallback`;
        script.async = true;
        script.defer = true;
        
        // Create a global callback that will be called when the script loads
        window.googleMapsCallback = () => {
          scriptCache.loaded = true;
          scriptCache.loading = false;
          setIsScriptLoaded(true);
          
          // Call all registered callbacks
          scriptCache.callbacks.forEach(callback => callback());
          scriptCache.callbacks = [];
        };
        
        // Handle script load error
        script.onerror = () => {
          document.body.removeChild(script);
          scriptCache.loading = false;
          setApiError('Failed to load Google Maps. Please try again later.');
          console.error('Google Maps script failed to load');
        };
        
        document.body.appendChild(script);
      } catch (error) {
        scriptCache.loading = false;
        console.error('Error loading Google Maps:', error);
        setApiError('Failed to load Google Maps. Please try again later.');
      }
    };
    
    loadGoogleMapsScript();
    
    return () => {
      // Cleanup function - but don't remove the script
      // as other components might be using it
    };
  }, []);

  // Handle user location
  useEffect(() => {
    if (showUserLocation && isMapReady) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [showUserLocation, isMapReady]);

  // Initialize the map once the script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapContainerRef.current || isMapReady) return;
    
    try {
      const newMap = new google.maps.Map(mapContainerRef.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: zoom,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
      });
      
      geocoderRef.current = new google.maps.Geocoder();
      setMap(newMap);
      setIsMapReady(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      setApiError('Failed to initialize map. Please try again later.');
    }
  }, [isScriptLoaded, center, zoom, isMapReady]);

  // Update the map when center or zoom changes
  useEffect(() => {
    if (!map) return;
    
    map.setCenter({ lat: center[0], lng: center[1] });
    map.setZoom(zoom);
  }, [map, center, zoom]);

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!onClick || !e.latLng || !geocoderRef.current) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    try {
      const response = await geocoderRef.current.geocode({
        location: { lat, lng }
      });
      
      const address = response.results[0]?.formatted_address || 'Endereço não identificado';
      
      const newMarker: MapMarker = {
        id: `marker-${Date.now()}`,
        position: [lat, lng],
        title: address,
        lat,
        lng,
        address
      };
      
      onClick(newMarker);
    } catch (error) {
      console.error('Error in geocoding:', error);
      
      const newMarker: MapMarker = {
        id: `marker-${Date.now()}`,
        position: [lat, lng],
        title: 'Localização selecionada',
        lat,
        lng,
        address: `Coordenadas: ${lat}, ${lng}`
      };
      
      onClick(newMarker);
    }
  };

  // Render markers on the map
  useEffect(() => {
    if (!map || !isMapReady) return;
    
    // Clear existing markers (if needed)
    const mapDiv = map.getDiv();
    const existingMarkers = mapDiv.querySelectorAll('[title^="marker-"]');
    existingMarkers.forEach(marker => marker.remove());
    
    // Add new markers
    markers.forEach((marker) => {
      const markerInstance = new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map,
        title: marker.title,
        draggable: draggable,
      });
      
      // You can add click handlers, info windows, etc. here
    });
    
    // Add user location marker if available
    if (userPosition) {
      new google.maps.Marker({
        position: { lat: userPosition[0], lng: userPosition[1] },
        map: map,
        title: "Sua localização",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
    }
    
    // Set up map click handler
    if (onClick) {
      google.maps.event.clearListeners(map, 'click');
      map.addListener('click', handleMapClick);
    }
    
  }, [map, markers, userPosition, draggable, isMapReady, onClick]);

  if (apiError) {
    return (
      <div className={`flex items-center justify-center w-full h-full min-h-[200px] bg-red-50 text-red-500 rounded-md ${className}`}>
        <p>{apiError}</p>
      </div>
    );
  }

  if (!isScriptLoaded || !isMapReady) {
    return <Skeleton className={`w-full h-full min-h-[200px] rounded-md ${className}`} />;
  }

  return (
    <div ref={mapContainerRef} className={`relative w-full h-full min-h-[200px] ${className}`} />
  );
};

// Add this to ensure that typescript works with the global callback
declare global {
  interface Window {
    googleMapsCallback: () => void;
  }
}

export default GoogleMapComponent;
