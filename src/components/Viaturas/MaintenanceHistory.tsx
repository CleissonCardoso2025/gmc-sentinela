
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle, Maintenance } from "@/pages/Viaturas";
import { History } from "lucide-react";

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
  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.placa} (${vehicle.modelo})` : "Veículo não encontrado";
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Concluída":
        return <Badge className="bg-green-500">Concluída</Badge>;
      case "Em andamento":
        return <Badge className="bg-yellow-500">Em andamento</Badge>;
      case "Agendada":
        return <Badge className="bg-blue-500">Agendada</Badge>;
      case "Cancelada":
        return <Badge className="bg-red-500">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <History className="h-5 w-5 mr-2" />
          {fullHistory ? "Histórico de Manutenções" : "Últimas Manutenções"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Viatura</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Custo (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.length > 0 ? (
                maintenances.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell>
                      {new Date(maintenance.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{getVehicleInfo(maintenance.veiculoId)}</TableCell>
                    <TableCell>{maintenance.tipo}</TableCell>
                    <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                    <TableCell>{maintenance.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum registro de manutenção encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceHistory;
