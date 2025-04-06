
import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Vehicle, Maintenance } from "@/pages/Viaturas";
import { Calendar, Filter, Download } from "lucide-react";

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
  const [filters, setFilters] = useState({
    vehicleId: 0,
    type: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
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
  
  const getVehiclePlate = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.placa : 'Desconhecido';
  };
  
  const handleFilterChange = (name: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const filteredMaintenances = maintenances.filter(m => {
    if (filters.vehicleId && m.veiculoId !== filters.vehicleId) return false;
    if (filters.type && m.tipo !== filters.type) return false;
    if (filters.status && m.status !== filters.status) return false;
    if (filters.dateFrom && new Date(m.data) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(m.data) > new Date(filters.dateTo)) return false;
    return true;
  });
  
  const handleExport = () => {
    // In a real app, this would generate and download a PDF or Excel file
    alert("Exportação de relatório simulada! Em uma aplicação real, isso geraria um arquivo para download.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">
          {fullHistory ? "Histórico de Manutenções" : "Últimas Manutenções"}
        </CardTitle>
        {fullHistory && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {fullHistory && showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-md bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="vehicleFilter">Viatura</Label>
              <Select
                value={filters.vehicleId.toString()}
                onValueChange={(value) => handleFilterChange("vehicleId", Number(value))}
              >
                <SelectTrigger id="vehicleFilter">
                  <SelectValue placeholder="Todas as viaturas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todas as viaturas</SelectItem>
                  {vehicles.map(v => (
                    <SelectItem key={v.id} value={v.id.toString()}>
                      {v.placa} - {v.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="typeFilter">Tipo</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger id="typeFilter">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Todos os tipos</SelectItem>
                  <SelectItem value="Preventiva">Preventiva</SelectItem>
                  <SelectItem value="Corretiva">Corretiva</SelectItem>
                  <SelectItem value="Revisão">Revisão</SelectItem>
                  <SelectItem value="Troca de Óleo">Troca de Óleo</SelectItem>
                  <SelectItem value="Troca de Pneus">Troca de Pneus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statusFilter">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger id="statusFilter">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Todos os status</SelectItem>
                  <SelectItem value="Agendada">Agendada</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Data Inicial</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Data Final</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </div>
        )}
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Viatura</TableHead>
                <TableHead className="font-medium">Data</TableHead>
                <TableHead className="font-medium">Tipo</TableHead>
                <TableHead className="font-medium">Quilometragem</TableHead>
                <TableHead className="font-medium">Descrição</TableHead>
                <TableHead className="font-medium">Custo</TableHead>
                <TableHead className="font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenances.length > 0 ? (
                filteredMaintenances.map((maintenance) => (
                  <TableRow key={maintenance.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{getVehiclePlate(maintenance.veiculoId)}</TableCell>
                    <TableCell>{new Date(maintenance.data).toLocaleDateString()}</TableCell>
                    <TableCell>{maintenance.tipo}</TableCell>
                    <TableCell>{maintenance.quilometragem.toLocaleString()} km</TableCell>
                    <TableCell className="max-w-[200px] truncate">{maintenance.descricao}</TableCell>
                    <TableCell>R$ {maintenance.custo.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-normal", getStatusColor(maintenance.status))}>
                        {maintenance.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    Nenhuma manutenção encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {!fullHistory && maintenances.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Ver Histórico Completo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceHistory;
