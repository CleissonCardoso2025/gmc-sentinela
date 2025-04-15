
import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapMarker } from '@/types/maps';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (showUserLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [showUserLocation]);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    geocoderRef.current = new google.maps.Geocoder();
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

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

  if (!isLoaded) {
    return <Skeleton className={`w-full h-full min-h-[200px] rounded-md ${className}`} />;
  }

  return (
    <div className={`relative w-full h-full min-h-[200px] ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: center[0], lng: center[1] }}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            draggable={draggable}
          />
        ))}
        
        {userPosition && (
          <Marker
            position={{ lat: userPosition[0], lng: userPosition[1] }}
            title="Sua localização"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
