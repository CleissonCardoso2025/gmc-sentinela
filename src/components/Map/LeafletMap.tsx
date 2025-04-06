
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarker } from '@/types/maps';

// Fix for default marker icon paths in Leaflet
// This is needed because Leaflet's assets are not properly loaded in bundled apps
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// These need to be accessed outside the component's lifecycle
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl
});

// Marker icons
const defaultIcon = new Icon({
  iconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl,
  shadowSize: [41, 41]
});

const policeIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl,
  shadowSize: [41, 41]
});

const incidentIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl,
  shadowSize: [41, 41]
});

interface MapViewProps {
  center: LatLngExpression;
  zoom: number;
}

// Helper component to update map view
const MapViewControl: React.FC<MapViewProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

interface LeafletMapProps {
  center: [number, number];
  markers: MapMarker[];
  zoom?: number;
  height?: string;
  className?: string;
  onMapClick?: (e: { lat: number, lng: number }) => void;
  markerType?: 'default' | 'police' | 'incident';
  showUserLocation?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  markers,
  zoom = 12,
  height = 'h-[400px]',
  className = '',
  onMapClick,
  markerType = 'default',
  showUserLocation = false
}) => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(center);
  const [mapZoom, setMapZoom] = useState<number>(zoom);
  
  useEffect(() => {
    setMapCenter(center);
  }, [center]);
  
  useEffect(() => {
    setMapZoom(zoom);
  }, [zoom]);
  
  // Determine which icon to use
  const getMarkerIcon = (type?: string) => {
    switch (type || markerType) {
      case 'police':
        return policeIcon;
      case 'incident':
        return incidentIcon;
      default:
        return defaultIcon;
    }
  };
  
  return (
    <div className={`${height} w-full ${className}`}>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={true}
        whenCreated={map => {
          if (onMapClick) {
            map.on('click', (e) => {
              onMapClick(e.latlng);
            });
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewControl center={mapCenter} zoom={mapZoom} />
        
        {markers.map(marker => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            icon={getMarkerIcon(marker.icon)}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{marker.title}</h3>
                {marker.content && <div dangerouslySetInnerHTML={{ __html: marker.content }} />}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;

