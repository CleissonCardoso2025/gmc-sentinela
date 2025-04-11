
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Car, 
  UserX, 
  CheckCircle, 
  Clock,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import EmptyState from '../Dashboard/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  time: string;
}

const AlertPanel: React.FC = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with a real API call
        // For now, we're setting an empty array to simulate no data
        setAlerts([]);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        toast({
          title: "Erro ao carregar alertas",
          description: "Não foi possível carregar os alertas do sistema.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [toast]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "plantao":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "viatura":
        return <Car className="h-5 w-5 text-yellow-500" />;
      case "agente":
        return <UserX className="h-5 w-5 text-red-500" />;
      case "ocorrencia":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getAlertBorder = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-4 border-l-red-500";
      case "medium":
        return "border-l-4 border-l-yellow-500";
      case "low":
        return "border-l-4 border-l-blue-500";
      default:
        return "border-l-4 border-l-gray-500";
    }
  };

  const handleMarkResolved = async (id: string) => {
    try {
      // This would be replaced with a real API call
      // For now, we just remove the alert from the state
      setAlerts(alerts.filter(alert => alert.id !== id));
      toast({
        title: "Alerta resolvido",
        description: "O alerta foi marcado como resolvido."
      });
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast({
        title: "Erro ao resolver alerta",
        description: "Não foi possível marcar o alerta como resolvido.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <EmptyState
          title="Sem alertas"
          description="Não há alertas pendentes no momento."
          icon="info"
        />
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={cn("flex items-start", getAlertBorder(alert.severity))}>
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-grow">
                <AlertTitle className="mb-1">{alert.title}</AlertTitle>
                <AlertDescription className="text-sm">
                  {alert.description}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{alert.time}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => handleMarkResolved(alert.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolver
                    </Button>
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
