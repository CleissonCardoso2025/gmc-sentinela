
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, AlertTriangle, Bell } from 'lucide-react';
import { Alert, getAlerts } from '@/services/alertService';
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from '../Dashboard/EmptyState';

const AlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const data = await getAlerts();
        setAlerts(data as Alert[]);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const unreadCount = alerts.filter(alert => !alert.read).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <EmptyState
        title="Sem alertas"
        description="Não há alertas pendentes no momento."
        icon="info"
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-gcm-600" />
            <h2 className="text-lg font-semibold">Alertas Pendentes</h2>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {unreadCount} não lido{unreadCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'urgente' 
                    ? 'border-l-red-500 bg-red-50' 
                    : alert.type === 'ordem' 
                    ? 'border-l-blue-500 bg-blue-50'
                    : 'border-l-gray-500 bg-gray-50'
                } ${!alert.read ? 'font-medium' : ''}`}
              >
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{alert.title}</h3>
                  {!alert.read && (
                    <Badge variant="outline" className="bg-red-100 text-red-800 text-xs">
                      Novo
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{alert.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertPanel;
