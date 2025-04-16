
import React from 'react';
import { Card } from "@/components/ui/card";
import MaintenanceForm from "@/components/Viaturas/MaintenanceForm";
import MaintenanceHistory from "@/components/Viaturas/MaintenanceHistory";
import { Skeleton } from '@/components/ui/skeleton';
import { useVehicles } from '@/contexts/VehicleContext';

interface MaintenanceTabProps {
  maintenanceMode: boolean;
  selectedVehicle: any;
  onCancel: () => void;
}

const MaintenanceTab: React.FC<MaintenanceTabProps> = ({ 
  maintenanceMode, 
  selectedVehicle, 
  onCancel 
}) => {
  const { maintenances, vehicles, isLoading, handleSaveMaintenance } = useVehicles();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {maintenanceMode ? "Adicionar Manutenção" : "Histórico de Manutenções"}
      </h2>
      {maintenanceMode ? (
        <MaintenanceForm 
          vehicle={selectedVehicle}
          onSave={handleSaveMaintenance}
          onCancel={onCancel}
        />
      ) : (
        isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <MaintenanceHistory 
            maintenances={maintenances} 
            vehicles={vehicles} 
            fullHistory 
          />
        )
      )}
    </Card>
  );
};

export default MaintenanceTab;
