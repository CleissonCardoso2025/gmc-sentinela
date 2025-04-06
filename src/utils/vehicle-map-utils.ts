
import { formatDateBR } from './maps-utils';
import { Vehicle } from '@/hooks/use-vehicle-locations';

/**
 * Calculates the center point for the vehicle map
 */
export const calculateVehicleMapCenter = (vehicles: Vehicle[]) => {
  const validVehicles = vehicles.filter(v => v.latitude && v.longitude);
  
  if (validVehicles.length === 0) {
    // Default to São Paulo if no valid coordinates
    return { lat: -23.550520, lng: -46.633308 };
  }
  
  const sumLat = validVehicles.reduce((sum, v) => sum + (v.latitude || 0), 0);
  const sumLng = validVehicles.reduce((sum, v) => sum + (v.longitude || 0), 0);
  
  return { 
    lat: sumLat / validVehicles.length, 
    lng: sumLng / validVehicles.length 
  };
};

/**
 * Creates the HTML content for the vehicle info window
 */
export const createVehicleInfoContent = (vehicle: Vehicle): string => {
  const formattedDate = formatDateBR(vehicle.lastUpdate || '');
  
  return `
    <div style="padding: 10px; max-width: 200px;">
      <h3 style="margin-top: 0; font-weight: bold;">${vehicle.placa}</h3>
      <p>${vehicle.marca || ""} ${vehicle.modelo || ""}</p>
      ${vehicle.condutor ? `<p>Condutor: ${vehicle.condutor}</p>` : ''}
      ${vehicle.location_name ? `<p>Local: ${vehicle.location_name}</p>` : ''}
      <p>Última atualização: ${formattedDate}</p>
    </div>
  `;
};
