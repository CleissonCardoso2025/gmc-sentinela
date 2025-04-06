
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/pages/Viaturas";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onAddMaintenance: (vehicle: Vehicle) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onEdit, onAddMaintenance }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em serviço':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'manutenção':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inoperante':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const needsMaintenance = (vehicle: Vehicle) => {
    // Check if maintenance is due soon (within 7 days or 1000 km)
    const today = new Date();
    const maintenanceDate = new Date(vehicle.proximaManutencao);
    const daysUntilMaintenance = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Using logic: if either less than 7 days until scheduled maintenance or within 1000km of maintenance threshold
    return daysUntilMaintenance <= 7 || 
           (vehicle.quilometragem >= 5000 && vehicle.quilometragem % 5000 >= 4000);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Placa</TableHead>
            <TableHead className="font-medium">Modelo</TableHead>
            <TableHead className="font-medium">Marca</TableHead>
            <TableHead className="font-medium">Ano</TableHead>
            <TableHead className="font-medium">Tipo</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">KM</TableHead>
            <TableHead className="font-medium">Próxima Manutenção</TableHead>
            <TableHead className="font-medium">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {needsMaintenance(vehicle) && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                  )}
                  {vehicle.placa}
                </div>
              </TableCell>
              <TableCell>{vehicle.modelo}</TableCell>
              <TableCell>{vehicle.marca}</TableCell>
              <TableCell>{vehicle.ano}</TableCell>
              <TableCell>{vehicle.tipo}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-normal", getStatusColor(vehicle.status))}>
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell>{vehicle.quilometragem.toLocaleString()} km</TableCell>
              <TableCell>{new Date(vehicle.proximaManutencao).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onAddMaintenance(vehicle)}>
                    <Wrench className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;
