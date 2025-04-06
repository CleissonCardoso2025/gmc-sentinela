
import React from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  ArrowDownCircle 
} from "lucide-react";
import { Vehicle } from "@/pages/Viaturas";

interface AlertPanelProps {
  vehicles: Vehicle[];
}

const AlertPanel: React.FC<AlertPanelProps> = ({ vehicles }) => {
  // Find vehicles that need maintenance soon (within the next 7 days)
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);
  
  const vehiclesNeedingMaintenance = vehicles.filter(vehicle => {
    const maintenanceDate = new Date(vehicle.proximaManutencao);
    return maintenanceDate >= today && maintenanceDate <= sevenDaysFromNow;
  });
  
  // Sort by closest maintenance date first
  vehiclesNeedingMaintenance.sort((a, b) => 
    new Date(a.proximaManutencao).getTime() - new Date(b.proximaManutencao).getTime()
  );
  
  // Find vehicles with status issues
  const vehiclesWithIssues = vehicles.filter(vehicle => 
    vehicle.status === 'Manutenção' || vehicle.status === 'Inoperante'
  );

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Alertas e Notificações</h3>
      </div>
      
      {vehiclesNeedingMaintenance.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            Manutenções Programadas
          </h4>
          <ul className="text-sm space-y-1">
            {vehiclesNeedingMaintenance.slice(0, 3).map(vehicle => (
              <li key={vehicle.id} className="bg-blue-50 p-2 rounded-md">
                <span className="font-medium">{vehicle.placa} ({vehicle.modelo})</span>: 
                Manutenção programada para {new Date(vehicle.proximaManutencao).toLocaleDateString('pt-BR')}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {vehiclesWithIssues.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            Viaturas Indisponíveis
          </h4>
          <ul className="text-sm space-y-1">
            {vehiclesWithIssues.slice(0, 3).map(vehicle => (
              <li key={vehicle.id} className="bg-red-50 p-2 rounded-md">
                <span className="font-medium">{vehicle.placa} ({vehicle.modelo})</span>: 
                {vehicle.status === 'Manutenção' ? ' Em manutenção' : ' Inoperante'}
                {vehicle.observacoes && ` - ${vehicle.observacoes}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {vehiclesNeedingMaintenance.length === 0 && vehiclesWithIssues.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p>Nenhum alerta ou notificação pendente</p>
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
