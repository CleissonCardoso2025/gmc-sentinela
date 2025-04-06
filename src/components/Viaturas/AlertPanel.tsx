
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/pages/Viaturas";
import { AlertTriangle, Calendar, Gauge } from "lucide-react";

interface AlertPanelProps {
  vehicles: Vehicle[];
}

const AlertPanel: React.FC<AlertPanelProps> = ({ vehicles }) => {
  const getMaintenanceAlerts = () => {
    const alerts = [];
    const today = new Date();
    
    for (const vehicle of vehicles) {
      // Check scheduled maintenance date
      const maintenanceDate = new Date(vehicle.proximaManutencao);
      const daysUntilMaintenance = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilMaintenance <= 7 && daysUntilMaintenance >= 0) {
        alerts.push({
          vehicleId: vehicle.id,
          placa: vehicle.placa,
          modelo: vehicle.modelo,
          tipo: "data",
          message: `Manutenção programada em ${daysUntilMaintenance} dias`,
          daysOrKm: daysUntilMaintenance,
          severity: daysUntilMaintenance <= 3 ? "high" : "medium"
        });
      }
      
      // Check maintenance based on mileage (every 5000 km)
      const kmUntilMaintenance = 5000 - (vehicle.quilometragem % 5000);
      
      if (kmUntilMaintenance <= 1000) {
        alerts.push({
          vehicleId: vehicle.id,
          placa: vehicle.placa,
          modelo: vehicle.modelo,
          tipo: "quilometragem",
          message: `Manutenção preventiva em ${kmUntilMaintenance} km`,
          daysOrKm: kmUntilMaintenance,
          severity: kmUntilMaintenance <= 500 ? "high" : "medium"
        });
      }
    }
    
    // Sort by severity (high first) and then by days/km
    return alerts.sort((a, b) => {
      if (a.severity === "high" && b.severity !== "high") return -1;
      if (a.severity !== "high" && b.severity === "high") return 1;
      return a.daysOrKm - b.daysOrKm;
    });
  };
  
  const alerts = getMaintenanceAlerts();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Alertas de Manutenção</CardTitle>
      </CardHeader>
      
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={`${alert.vehicleId}-${alert.tipo}-${index}`}
                className={`p-3 rounded-md border flex items-start space-x-3 ${
                  alert.severity === "high" 
                    ? "bg-red-50 border-red-200" 
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className={`p-2 rounded-full ${
                  alert.severity === "high" 
                    ? "bg-red-100 text-red-600" 
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {alert.tipo === "data" ? (
                    <Calendar className="h-5 w-5" />
                  ) : (
                    <Gauge className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {alert.placa} - {alert.modelo}
                  </h4>
                  <p className={`text-sm ${
                    alert.severity === "high" 
                      ? "text-red-600" 
                      : "text-yellow-600"
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <AlertTriangle className="h-12 w-12 mb-2 text-gray-300" />
            <p>Nenhum alerta de manutenção no momento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertPanel;
