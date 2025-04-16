
import React from 'react';
import { Card } from "@/components/ui/card";
import ReportPanel from "@/components/Viaturas/ReportPanel";
import { Skeleton } from '@/components/ui/skeleton';
import { useVehicles } from '@/contexts/VehicleContext';

const ReportsTab: React.FC = () => {
  const { vehicles, maintenances, isLoading } = useVehicles();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <ReportPanel vehicles={vehicles} maintenances={maintenances} />
      )}
    </Card>
  );
};

export default ReportsTab;
