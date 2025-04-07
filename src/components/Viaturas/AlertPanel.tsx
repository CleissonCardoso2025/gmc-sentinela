
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/pages/Viaturas";
import { AlertTriangle } from "lucide-react";

interface AlertPanelProps {
  vehicles: Vehicle[];
}

const AlertPanel: React.FC<AlertPanelProps> = ({ vehicles }) => {
  const getMaintenanceAlerts = () => {
    const today = new Date();
    
    return vehicles
      .filter(vehicle => {
        const maintenanceDate = new Date(vehicle.proximaManutencao);
        const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 15 && vehicle.status !== "Manutenção";
      })
      .map(vehicle => {
        const maintenanceDate = new Date(vehicle.proximaManutencao);
        const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let severity = "bg-green-500";
        if (daysUntil <= 0) {
          severity = "bg-red-500";
        } else if (daysUntil <= 7) {
          severity = "bg-yellow-500";
        } else if (daysUntil <= 15) {
          severity = "bg-blue-500";
        }
        
        return {
          vehicle,
          daysUntil,
          severity
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };
  
  const alerts = getMaintenanceAlerts();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Alertas de Manutenção
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-3 relative" style={{ zIndex: 5 }}>
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{alert.vehicle.placa} - {alert.vehicle.modelo}</p>
                  <p className="text-sm text-gray-600">
                    Manutenção prevista: {new Date(alert.vehicle.proximaManutencao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge className={alert.severity}>
                  {alert.daysUntil <= 0 ? 
                    'Atrasada' : 
                    `${alert.daysUntil} dia${alert.daysUntil !== 1 ? 's' : ''}`
                  }
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-gray-600">Nenhum alerta de manutenção para os próximos 15 dias.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertPanel;
