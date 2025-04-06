
import React, { useRef, useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicleLocations } from "@/hooks/use-vehicle-locations";
import { useVehicleMap } from "@/hooks/use-vehicle-map";
import VehicleList from "./VehicleList";
import { useToast } from "@/hooks/use-toast";

const VehicleTrackingMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { vehicles, isLoading: vehiclesLoading, refetchVehicles } = useVehicleLocations();
  const { isLoaded, getUserLocation, mapError } = useVehicleMap(mapRef, vehicles, vehiclesLoading);
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  
  // If map failed to load, retry with exponential backoff
  useEffect(() => {
    if (mapError && retryCount < 3) {
      const timeout = setTimeout(() => {
        console.log(`Retrying map load (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        refetchVehicles();
      }, Math.pow(2, retryCount) * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [mapError, retryCount, refetchVehicles]);
  
  const handleRefresh = () => {
    refetchVehicles();
    toast({
      title: "Atualizando dados",
      description: "Buscando a localização mais recente das viaturas."
    });
  };
  
  return (
    <Card className="w-full overflow-hidden shadow-md relative animate-fade-up">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-lg font-semibold text-gray-800">Rastreamento de Viaturas</h2>
      </div>
      
      {vehiclesLoading || !isLoaded ? (
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
          
          {mapError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
              <div className="text-center p-4">
                <p className="text-red-600 mb-2">Erro ao carregar o mapa</p>
                <button 
                  className="bg-gcm-600 text-white px-3 py-1 rounded-md hover:bg-gcm-700 transition-colors"
                  onClick={() => setRetryCount(prev => prev + 1)}
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : null}
          
          <VehicleList vehicles={vehicles} />
          
          <div className="p-4 pt-0 flex space-x-2">
            <button 
              onClick={getUserLocation}
              className="text-xs bg-gcm-600 text-white px-3 py-1 rounded-md hover:bg-gcm-700 transition-colors"
            >
              Ir para minha localização
            </button>
            <button 
              onClick={handleRefresh}
              className="text-xs bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
            >
              Atualizar dados
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VehicleTrackingMap;
