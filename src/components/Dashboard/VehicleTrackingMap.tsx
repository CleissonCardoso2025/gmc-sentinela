import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import LeafletMap from '@/components/Map/LeafletMap';
import { useGeolocation } from '@/hooks/use-geolocation';

interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
}

const VehicleTrackingMap = () => {
  const [vehicleLocation, setVehicleLocation] = useState<MapMarker>({
    id: 'vehicle-1',
    position: [-23.5505, -46.6333], // Initial vehicle location (São Paulo)
    title: 'Viatura XYZ-1234',
  });

  const { location, refreshPosition } = useGeolocation();

  React.useEffect(() => {
    // Call refreshPosition without arguments
    refreshPosition();
  }, [refreshPosition]);

  const updateVehicleLocation = () => {
    // Simulate vehicle moving to a new location
    const newLat = vehicleLocation.position[0] + (Math.random() - 0.5) * 0.01;
    const newLng = vehicleLocation.position[1] + (Math.random() - 0.5) * 0.01;

    setVehicleLocation({
      ...vehicleLocation,
      position: [newLat, newLng],
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
        <LeafletMap markers={[vehicleLocation]} />
      </div>
    </Card>
  );
};

export default VehicleTrackingMap;
