
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader, Circle } from '@react-google-maps/api';
import { MapMarker } from '@/types/maps';
import { supabase } from '@/integrations/supabase/client';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (São Paulo, Brazil)
const defaultCenter = {
  lat: -23.550520,
  lng: -46.633308
};

interface GoogleMapComponentProps {
  center?: google.maps.LatLngLiteral;
  markers?: MapMarker[];
  zoom?: number;
  height?: string;
  className?: string;
  onMapClick?: (location: { lat: number, lng: number }) => void;
  markerType?: 'default' | 'police' | 'incident';
  showUserLocation?: boolean;
}

// Optimize map loading with useJsApiLoader
const MapWrapper: React.FC<GoogleMapComponentProps> = (props) => {
  const [apiKey, setApiKey] = useState<string>('');
  
  useEffect(() => {
    async function fetchApiKey() {
      try {
        const { data, error } = await supabase.functions.invoke('geocode', {
          body: { getApiKey: true }
        });
        
        if (error) {
          console.error('Error fetching API key:', error);
          return;
        }
        
        if (data && data.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (error) {
        console.error('Failed to fetch Google Maps API key:', error);
      }
    }
    
    fetchApiKey();
  }, []);
  
  if (!apiKey) {
    return (
      <div className={`${props.height} w-full ${props.className} flex items-center justify-center bg-gray-100`}>
        <p className="text-gray-500">Carregando mapa...</p>
      </div>
    );
  }
  
  return (
    <LoadScript googleMapsApiKey={apiKey} loadingElement={<div className="h-full w-full flex items-center justify-center"><p>Carregando Google Maps...</p></div>}>
      <GoogleMapComponent {...props} />
    </LoadScript>
  );
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center,
  markers = [],
  zoom = 12,
  height = 'h-[400px]',
  className = '',
  onMapClick,
  markerType = 'default',
  showUserLocation = false
}) => {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(center || defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(zoom);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  
  // Update map center when the center prop changes
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);
  
  // Update map zoom when the zoom prop changes
  useEffect(() => {
    setMapZoom(zoom);
  }, [zoom]);
  
  // Get user's location if showUserLocation is true
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      const successCallback = (position: GeolocationPosition) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(userPos);
        setLocationAccuracy(position.coords.accuracy);
        console.log("User location set:", userPos, "Accuracy:", position.coords.accuracy);
        
        // If no center is provided and we have user location, center the map on user
        if (!center && mapRef.current) {
          mapRef.current.panTo(userPos);
          setMapCenter(userPos);
        }
      };
      
      const errorCallback = (error: GeolocationPositionError) => {
        console.error("Error getting user location:", error.message);
      };
      
      const watchId = navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        options
      );
      
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [showUserLocation, center]);
  
  // Handle map click event
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (onMapClick && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onMapClick({ lat, lng });
    }
  }, [onMapClick]);
  
  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log("Map loaded successfully");
  }, []);
  
  // Handle map unmount
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);
  
  // Define marker icons based on type
  const getMarkerIcon = (type?: string) => {
    const iconType = type || markerType;
    
    switch (iconType) {
      case 'police':
        return {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        };
      case 'incident':
        return {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        };
      default:
        return {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        };
    }
  };
  
  // Add user location circle to show accuracy radius
  const renderUserLocationMarker = () => {
    if (!userLocation || !window.google) return null;
    
    return (
      <>
        <Marker
          position={userLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          }}
          zIndex={1000}
          title="Sua localização"
        />
        {locationAccuracy && (
          <Circle
            center={userLocation}
            radius={locationAccuracy}
            options={{
              strokeColor: "#4285F4",
              strokeOpacity: 0.5,
              strokeWeight: 1,
              fillColor: "#4285F4",
              fillOpacity: 0.15,
            }}
          />
        )}
      </>
    );
  };
  
  return (
    <div className={`${height} w-full ${className}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          disableDefaultUI: false,
          clickableIcons: false
        }}
        onClick={handleMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{
              lat: marker.position[0],
              lng: marker.position[1]
            }}
            icon={window.google && getMarkerIcon(marker.icon)}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
        
        {showUserLocation && userLocation && renderUserLocationMarker()}
        
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.position[0],
              lng: selectedMarker.position[1]
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-gray-800">{selectedMarker.title}</h3>
              {selectedMarker.content && (
                <div className="text-sm text-gray-600 mt-1" 
                  dangerouslySetInnerHTML={{ __html: selectedMarker.content }} 
                />
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapWrapper;
