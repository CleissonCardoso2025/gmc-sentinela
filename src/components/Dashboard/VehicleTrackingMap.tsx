
import React, { useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicleLocations } from "@/hooks/use-vehicle-locations";
import { useVehicleMap } from "@/hooks/use-vehicle-map";
import VehicleList from "./VehicleList";

const VehicleTrackingMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { vehicles, isLoading } = useVehicleLocations();
  const { isLoaded, getUserLocation } = useVehicleMap(mapRef, vehicles, isLoading);
  
  return (
    <Card className="w-full overflow-hidden shadow-md relative animate-fade-up">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-lg font-semibold text-gray-800">Rastreamento de Viaturas</h2>
      </div>
      
      {isLoading || !isLoaded ? (
        <div className="w-full h-[300px] md:h-[400px] p-4 flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[250px] md:h-[350px] w-full rounded-md" />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div 
            id="vehicleTrackingMap" 
            ref={mapRef} 
            className="w-full h-[300px] md:h-[400px]"
          />
          
          <VehicleList vehicles={vehicles} />
          
          <div className="p-4 pt-0">
            <button 
              onClick={getUserLocation}
              className="text-xs bg-gcm-600 text-white px-3 py-1 rounded-md hover:bg-gcm-700 transition-colors"
            >
              Ir para minha localização
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VehicleTrackingMap;
