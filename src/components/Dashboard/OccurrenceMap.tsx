import React from 'react';
import { Card } from '@/components/ui/card';
import LeafletMap from '@/components/Map/LeafletMap';
import { useGeolocation } from '@/hooks/use-geolocation';

interface OccurrenceMapProps {
  latitude?: number | null;
  longitude?: number | null;
}

const OccurrenceMap: React.FC<OccurrenceMapProps> = ({ latitude, longitude }) => {
  const { location, refreshPosition } = useGeolocation();
  
  React.useEffect(() => {
    // Call refreshPosition without arguments
    refreshPosition();
  }, [refreshPosition]);

  const mapCenter = (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null)
    ? [latitude, longitude]
    : (location.latitude && location.longitude)
      ? [location.latitude, location.longitude]
      : [51.505, -0.09]; // Default London coordinates

  const markers = (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null)
    ? [{ id: 'occurrence-location', position: [latitude, longitude], title: 'Occurrence Location', lat: latitude, lng: longitude }]
    : (location.latitude && location.longitude)
      ? [{ id: 'user-location', position: [location.latitude, location.longitude], title: 'My Location', lat: location.latitude, lng: location.longitude }]
      : [];

  return (
    <Card className="col-span-4">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Localização da Ocorrência</h2>
        <div style={{ height: '300px', width: '100%' }}>
          <LeafletMap markers={markers} center={mapCenter} zoom={13} />
        </div>
      </div>
    </Card>
  );
};

export default OccurrenceMap;
