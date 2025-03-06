
import React from 'react';
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

const AlertPanel: React.FC = () => {
  const { toast } = useToast();

  // Mock data for alerts
  const alerts = [
    {
      id: 1,
      type: "plantao",
      title: "Plantão não aberto",
      description: "O supervisor Sgt. Marcos Oliveira não abriu o plantão noturno.",
      severity: "high",
      time: "Há 2 horas"
    },
    {
      id: 2,
      type: "viatura",
      title: "Viatura requer manutenção",
      description: "GCM-5678 está com manutenção programada vencida há 3 dias.",
      severity: "medium",
      time: "Há 1 dia"
    },
    {
      id: 3,
      type: "agente",
      title: "Agente ausente",
      description: "Agente Paulo Santos não se apresentou para o plantão diurno.",
      severity: "high",
      time: "Hoje, 08:15"
    },
    {
      id: 4,
      type: "ocorrencia",
      title: "Ocorrência grave registrada",
      description: "Ocorrência de código 3 registrada na região central.",
      severity: "high",
      time: "Há 30 minutos"
    },
  ];

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

  const handleMarkResolved = (id: number) => {
    toast({
      title: "Alerta resolvido",
      description: "O alerta foi marcado como resolvido."
    });
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6">
          <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
          <p className="text-gray-500">Não há alertas pendentes.</p>
        </div>
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
