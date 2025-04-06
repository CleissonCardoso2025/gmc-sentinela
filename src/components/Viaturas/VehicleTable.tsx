
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Edit, Wrench, AlertTriangle, MapPin } from "lucide-react";
import { Vehicle } from "@/pages/Viaturas";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VehicleMap from "./VehicleMap";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onAddMaintenance: (vehicle: Vehicle) => void;
}

interface VehicleLocation {
  vehicle_id: number;
  latitude: number;
  longitude: number;
  recorded_at: string;
  location_name: string | null;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ 
  vehicles, 
  onEdit, 
  onAddMaintenance 
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  // Fetch the latest locations for all vehicles
  const { data: locationsData } = useQuery({
    queryKey: ['vehicleLocations'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_latest_vehicle_locations');
      if (error) throw error;
      return data as VehicleLocation[];
    }
  });

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em serviço':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'manutenção':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inoperante':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'reserva':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Function to determine if maintenance warning should be shown
  const shouldShowMaintenanceWarning = (vehicle: Vehicle) => {
    const today = new Date();
    const maintenanceDate = new Date(vehicle.proximaManutencao);
    const diffTime = maintenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  // Function to format the location information
  const getLocationInfo = (vehicleId: number) => {
    if (!locationsData) return "Não disponível";
    
    const vehicleLocation = locationsData.find(loc => loc.vehicle_id === vehicleId);
    if (!vehicleLocation) return "Não disponível";
    
    if (vehicleLocation.location_name) {
      return vehicleLocation.location_name;
    }
    
    // Format the date as "10-Apr 14:30"
    const date = new Date(vehicleLocation.recorded_at);
    return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Function to handle opening the map dialog
  const handleShowMap = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setMapDialogOpen(true);
  };

  // Function to get the latitude and longitude for a vehicle
  const getVehicleCoordinates = (vehicleId: number) => {
    if (!locationsData) return null;
    
    const vehicleLocation = locationsData.find(loc => loc.vehicle_id === vehicleId);
    if (!vehicleLocation) return null;
    
    return {
      latitude: vehicleLocation.latitude,
      longitude: vehicleLocation.longitude,
      timestamp: vehicleLocation.recorded_at
    };
  };

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Placa</TableHead>
              <TableHead>Modelo/Marca</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quilometragem</TableHead>
              <TableHead>Próxima Manutenção</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{vehicle.placa}</TableCell>
                  <TableCell>{vehicle.modelo} - {vehicle.marca}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", getStatusColor(vehicle.status))}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vehicle.quilometragem.toLocaleString()} km</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {new Date(vehicle.proximaManutencao).toLocaleDateString('pt-BR')}
                      {shouldShowMaintenanceWarning(vehicle) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" aria-label="Manutenção próxima" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getLocationInfo(vehicle.id)}
                      {getVehicleCoordinates(vehicle.id) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0" 
                          onClick={() => handleShowMap(vehicle)}
                        >
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="sr-only">Ver no mapa</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEdit(vehicle)}
                        className="h-8 px-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onAddMaintenance(vehicle)}
                        className="h-8 px-2"
                      >
                        <Wrench className="h-4 w-4" />
                        <span className="sr-only">Manutenção</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhuma viatura encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Map Dialog */}
      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicle ? `Localização: ${selectedVehicle.placa} - ${selectedVehicle.modelo}` : 'Localização'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="h-[400px] w-full">
              <VehicleMap vehicleId={selectedVehicle.id} />
            </div>
          )}
          
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleTable;
