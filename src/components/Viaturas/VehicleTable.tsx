
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Edit, Wrench, AlertTriangle } from "lucide-react";
import { Vehicle } from "@/pages/Viaturas";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onAddMaintenance: (vehicle: Vehicle) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ 
  vehicles, 
  onEdit, 
  onAddMaintenance 
}) => {
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

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Placa</TableHead>
            <TableHead>Modelo/Marca</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quilometragem</TableHead>
            <TableHead>Próxima Manutenção</TableHead>
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
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhuma viatura encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;
