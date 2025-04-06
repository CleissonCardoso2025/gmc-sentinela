
import React from 'react';
import { Vehicle } from '@/hooks/use-vehicle-locations';
import { formatDateBR } from '@/utils/maps-utils';

interface VehicleListProps {
  vehicles: Vehicle[];
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
  return (
    <div className="p-4 border-t">
      <h3 className="font-semibold mb-2">Viaturas Monitoradas: {vehicles.length}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {vehicles.slice(0, 4).map(vehicle => (
          <div key={vehicle.id} className="p-2 border rounded-md text-sm">
            <p className="font-medium">{vehicle.placa}</p>
            <p className="text-gray-600 text-xs">
              {vehicle.modelo} • Última atualização: {formatDateBR(vehicle.lastUpdate || '')}
            </p>
          </div>
        ))}
      </div>
      
      {vehicles.length > 4 && (
        <p className="text-sm text-gray-500 mt-2">
          + {vehicles.length - 4} viaturas não exibidas
        </p>
      )}
    </div>
  );
};

export default VehicleList;
