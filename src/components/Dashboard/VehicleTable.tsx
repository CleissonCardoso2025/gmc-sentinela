
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: number;
  placa: string;
  status: string;
  condutor: string;
  quilometragem: string;
  proximaManutencao: string;
}

interface Maintenance {
  id: number;
  placa: string;
  tipo: string;
  dataInicio: string;
  previsaoTermino: string;
  descricao: string;
  status: string;
}

interface VehicleTableProps {
  vehicles?: Vehicle[];
  maintenances?: Maintenance[];
  limit?: number;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ 
  vehicles = [], 
  maintenances = [],
  limit
}) => {
  // Apply limit if provided
  const displayedVehicles = limit ? vehicles.slice(0, limit) : vehicles;
  const displayedMaintenances = limit ? maintenances.slice(0, limit) : maintenances;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em serviço':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'manutenção':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inoperante':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'em andamento':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'concluída':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="shadow-md animate-fade-up">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Gestão de Viaturas</h2>
      </div>
      
      <Tabs defaultValue="vehicles" className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="vehicles" className="text-sm">Lista de Viaturas</TabsTrigger>
            <TabsTrigger value="maintenance" className="text-sm">Manutenções</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="vehicles" className="p-4 pt-2">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Placa</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Condutor</TableHead>
                  <TableHead className="font-medium">Quilometragem</TableHead>
                  <TableHead className="font-medium">Próxima Manutenção</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedVehicles.length > 0 ? (
                  displayedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{vehicle.placa}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("font-normal", getStatusColor(vehicle.status))}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.condutor}</TableCell>
                      <TableCell>{vehicle.quilometragem} km</TableCell>
                      <TableCell>{vehicle.proximaManutencao}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhuma viatura disponível
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="p-4 pt-2">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Placa</TableHead>
                  <TableHead className="font-medium">Tipo</TableHead>
                  <TableHead className="font-medium">Data Início</TableHead>
                  <TableHead className="font-medium">Previsão Término</TableHead>
                  <TableHead className="font-medium">Descrição</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedMaintenances.length > 0 ? (
                  displayedMaintenances.map((maintenance) => (
                    <TableRow key={maintenance.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{maintenance.placa}</TableCell>
                      <TableCell>{maintenance.tipo}</TableCell>
                      <TableCell>{maintenance.dataInicio}</TableCell>
                      <TableCell>{maintenance.previsaoTermino}</TableCell>
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma manutenção registrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VehicleTable;
