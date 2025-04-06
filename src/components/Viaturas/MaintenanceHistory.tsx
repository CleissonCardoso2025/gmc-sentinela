
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Vehicle, Maintenance } from "@/pages/Viaturas";

interface MaintenanceHistoryProps {
  maintenances: Maintenance[];
  vehicles: Vehicle[];
  fullHistory?: boolean;
}

const MaintenanceHistory: React.FC<MaintenanceHistoryProps> = ({
  maintenances,
  vehicles,
  fullHistory = false
}) => {
  // Function to get vehicle info by ID
  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.placa} (${vehicle.modelo})` : "N/A";
  };
  
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'em andamento':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'agendada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Get the correct title based on whether this is full history or not
  const title = fullHistory ? "Histórico Completo de Manutenções" : "Últimas Manutenções";
  
  // Sort maintenance records by date (newest first)
  const sortedMaintenances = [...maintenances].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Viatura</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMaintenances.length > 0 ? (
              sortedMaintenances.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell className="font-medium">
                    {new Date(maintenance.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{getVehicleInfo(maintenance.veiculoId)}</TableCell>
                  <TableCell>{maintenance.tipo}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{maintenance.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-normal", getStatusColor(maintenance.status))}>
                      {maintenance.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum registro de manutenção encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {!fullHistory && maintenances.length > 3 && (
        <div className="text-right">
          <a href="#" className="text-sm text-gcm-600 hover:underline">
            Ver histórico completo →
          </a>
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory;
