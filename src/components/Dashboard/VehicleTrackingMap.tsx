
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import LeafletMap from '@/components/Map/LeafletMap';
import { useGeolocation } from '@/hooks/use-geolocation';
import { MapMarker } from '@/types/maps';

const VehicleTrackingMap = () => {
  const [vehicleLocation, setVehicleLocation] = useState<MapMarker>({
    id: 'vehicle-1',
    position: [-23.5505, -46.6333] as [number, number], // Initial vehicle location (São Paulo)
    title: 'Viatura XYZ-1234',
    lat: -23.5505,
    lng: -46.6333
  });

  const { location, refreshPosition } = useGeolocation();

  React.useEffect(() => {
    refreshPosition();
  }, [refreshPosition]);

  const updateVehicleLocation = () => {
    // Simulate vehicle moving to a new location
    const newLat = vehicleLocation.position[0] + (Math.random() - 0.5) * 0.01;
    const newLng = vehicleLocation.position[1] + (Math.random() - 0.5) * 0.01;

    setVehicleLocation({
      ...vehicleLocation,
      position: [newLat, newLng] as [number, number],
      lat: newLat,
      lng: newLng
    });
  };

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Rastreamento da Viatura</h2>
        <Button variant="outline" size="sm" onClick={updateVehicleLocation}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar Localização
        </Button>
      </div>
      <div className="h-[400px]">
        <LeafletMap 
          markers={[vehicleLocation]} 
          center={vehicleLocation.position}
        />
      </div>
    </Card>
  );
};

export default VehicleTrackingMap;
