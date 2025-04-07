
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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
  const [apiKey, setApiKey] = useState<string>('');
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Fetch Google Maps API key from Supabase Edge Function
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
  }, []);
  
  // Handle map unmount
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);
  
  // Define marker icons based on type - now only used inside the loaded map context
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
  
  if (!apiKey) {
    return (
      <div className={`${height} w-full ${className} flex items-center justify-center bg-gray-100`}>
        <p className="text-gray-500">Carregando mapa...</p>
      </div>
    );
  }
  
  return (
    <div className={`${height} w-full ${className}`}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={mapZoom}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
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
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
