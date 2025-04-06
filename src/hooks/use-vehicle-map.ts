
import { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleMaps } from '@/hooks/use-google-maps';
import { Vehicle } from '@/hooks/use-vehicle-locations';
import { createVehicleInfoContent, calculateVehicleMapCenter } from '@/utils/vehicle-map-utils';
import { useToast } from '@/hooks/use-toast';

export const useVehicleMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  vehicles: Vehicle[],
  isLoading: boolean
) => {
  const { isLoaded, loadError } = useGoogleMaps({
    callback: 'vehicleMapCallback',
    libraries: ['places']
  });
  const { toast } = useToast();
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});
  const mapInitialized = useRef(false);
  const [mapError, setMapError] = useState<Error | null>(null);
  
  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || isLoading) return;
    
    const initializeMap = () => {
      console.log("Initializing vehicle tracking map");
      
      if (!mapRef.current) return;
      
      try {
        // Define map center based on vehicles
        const center = calculateVehicleMapCenter(vehicles);
        
        // Create new map if it doesn't exist
        if (window.google && !googleMapRef.current) {
          googleMapRef.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 12,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: false,
            styles: [
              {
                featureType: "administrative",
                elementType: "geometry",
                stylers: [{ visibility: "on" }]
              },
              {
                featureType: "poi",
                stylers: [{ visibility: "off" }]
              }
            ]
          });
          
          // Add a listener for idle event to confirm map is fully loaded
          window.google.maps.event.addListener(googleMapRef.current, 'idle', () => {
            console.log("Map is fully loaded and idle");
            mapInitialized.current = true;
            setMapError(null);
          });
          
        } else if (googleMapRef.current) {
          // Update center if map exists
          googleMapRef.current.setCenter(center);
        }
        
        // Clear any previous error
        setMapError(null);
        
        // Add markers for vehicles with valid coordinates
        updateVehicleMarkers(vehicles);
        
      } catch (error) {
        console.error("Error initializing vehicle map:", error);
        setMapError(error instanceof Error ? error : new Error("Failed to initialize map"));
      }
    };
    
    // Initialize the map
    window.vehicleMapCallback = initializeMap;
    
    if (window.google && window.google.maps) {
      initializeMap();
    }
    
    return () => {
      // Clean up markers when component unmounts
      if (mapInitialized.current) {
        Object.values(markersRef.current).forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
      
      // Remove callback
      if (window.vehicleMapCallback) {
        delete window.vehicleMapCallback;
      }
    };
  }, [isLoaded, vehicles, isLoading, mapRef, toast]);
  
  // Update markers when vehicles change
  const updateVehicleMarkers = useCallback((vehicles: Vehicle[]) => {
    if (!window.google || !googleMapRef.current) return;
    
    try {
      // Clear existing markers
      Object.values(markersRef.current).forEach(marker => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = {};
      
      // Add new markers for vehicles with valid coordinates
      const validVehicles = vehicles.filter(v => v.latitude && v.longitude);
      
      validVehicles.forEach(vehicle => {
        if (vehicle.latitude && vehicle.longitude && googleMapRef.current) {
          const marker = new window.google.maps.Marker({
            position: { lat: vehicle.latitude, lng: vehicle.longitude },
            map: googleMapRef.current,
            title: `${vehicle.placa} - ${vehicle.modelo || ""}`,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/police.png",
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });
          
          const infoContent = createVehicleInfoContent(vehicle);
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: infoContent
          });
          
          marker.addListener('click', () => {
            infoWindow.open(googleMapRef.current, marker);
          });
          
          markersRef.current[vehicle.id] = marker;
        }
      });
    } catch (error) {
      console.error("Error updating vehicle markers:", error);
      setMapError(error instanceof Error ? error : new Error("Failed to update vehicle markers"));
    }
  }, []);
  
  // Function to center map on user's location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation && googleMapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          googleMapRef.current?.setCenter(userPos);
          googleMapRef.current?.setZoom(14);
          
          if (window.google && googleMapRef.current) {
            new window.google.maps.Marker({
              position: userPos,
              map: googleMapRef.current,
              title: "Sua localização",
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });
          }
          
          toast({
            title: "Localização encontrada",
            description: "O mapa foi centralizado na sua localização atual."
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast({
            title: "Erro de localização",
            description: "Não foi possível obter sua localização atual.",
            variant: "destructive"
          });
        }
      );
    }
  }, [toast]);
  
  return { 
    isLoaded, 
    getUserLocation, 
    mapError: loadError || mapError 
  };
};
