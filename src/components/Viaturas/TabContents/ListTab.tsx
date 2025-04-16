
import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VehicleTable from "@/components/Viaturas/VehicleTable";
import AlertPanel from "@/components/Viaturas/AlertPanel";
import MaintenanceHistory from "@/components/Viaturas/MaintenanceHistory";
import { Skeleton } from '@/components/ui/skeleton';
import { useVehicles, Vehicle } from '@/contexts/VehicleContext';

interface ListTabProps {
  onEditVehicle: (vehicle: Vehicle) => void;
  onAddMaintenance: (vehicle: Vehicle) => void;
}

const ListTab: React.FC<ListTabProps> = ({ onEditVehicle, onAddMaintenance }) => {
  const { 
    vehicles, 
    maintenances,
    isLoading, 
    searchTerm, 
    statusFilter, 
    setSearchTerm, 
    setStatusFilter 
  } = useVehicles();

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? vehicle.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between mb-4">
          <div className="w-1/3">
            <Input
              placeholder="Buscar por placa, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === null ? "default" : "outline"}
              onClick={() => setStatusFilter(null)}
            >
              Todos
            </Button>
            <Button
              variant={statusFilter === "Em serviço" ? "default" : "outline"}
              onClick={() => setStatusFilter("Em serviço")}
            >
              Em serviço
            </Button>
            <Button
              variant={statusFilter === "Manutenção" ? "default" : "outline"}
              onClick={() => setStatusFilter("Manutenção")}
            >
              Em manutenção
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <VehicleTable 
            vehicles={filteredVehicles} 
            onEdit={onEditVehicle} 
            onAddMaintenance={onAddMaintenance}
            isAdmin={true}
          />
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertPanel vehicles={vehicles} />
        <MaintenanceHistory 
          maintenances={maintenances.slice(0, 3)} 
          vehicles={vehicles} 
        />
      </div>
    </div>
  );
};

export default ListTab;
