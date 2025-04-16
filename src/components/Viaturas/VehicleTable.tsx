
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/contexts/VehicleContext";
import { Edit, AlertTriangle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVehicles } from '@/contexts/VehicleContext';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onAddMaintenance: (vehicle: Vehicle) => void;
  isAdmin?: boolean;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ 
  vehicles, 
  onEdit: propOnEdit, 
  onAddMaintenance: propOnAddMaintenance,
  isAdmin = true
}) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Em serviço":
        return <Badge className="bg-green-500">Em serviço</Badge>;
      case "Manutenção":
        return <Badge className="bg-yellow-500">Manutenção</Badge>;
      case "Inoperante":
        return <Badge className="bg-red-500">Inoperante</Badge>;
      case "Reserva":
        return <Badge className="bg-blue-500">Reserva</Badge>;
      default:
        return <Badge>{status || "Desconhecido"}</Badge>;
    }
  };
  
  const isMaintenanceNeeded = (vehicle: Vehicle) => {
    if (!vehicle.proximaManutencao) return false;
    
    const today = new Date();
    const maintenanceDate = new Date(vehicle.proximaManutencao);
    const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntil <= 15;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Placa</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quilometragem</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.placa}</TableCell>
                <TableCell>{vehicle.marca} {vehicle.modelo}</TableCell>
                <TableCell>{vehicle.tipo}</TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                <TableCell>{vehicle.quilometragem.toLocaleString()} km</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => propOnEdit(vehicle)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => propOnAddMaintenance(vehicle)}
                      className={isMaintenanceNeeded(vehicle) ? "text-yellow-600" : ""}
                      title="Adicionar manutenção"
                    >
                      {isMaintenanceNeeded(vehicle) ? 
                        <AlertTriangle className="h-4 w-4" /> : 
                        <Wrench className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum veículo encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;
