
import React, { useState } from 'react';
import { AlertTriangle, Megaphone, Package, BookOpen, ClipboardList, CheckCircle, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: number;
  title: string;
  description: string;
  type: 'urgente' | 'ordem' | 'diligencia' | 'procedimento' | 'administrativo';
  createdAt: string;
  author: string;
  status: 'ativo' | 'resolvido';
  read: boolean;
}

interface AlertBoardProps {
  maxDisplayedAlerts?: number;
}

export const AlertBoard: React.FC<AlertBoardProps> = ({ maxDisplayedAlerts = 5 }) => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      title: "Atualização de protocolo operacional",
      description: "Todos os GCMs devem adotar o novo protocolo de abordagem a partir de hoje.",
      type: "procedimento",
      createdAt: "2025-04-07T10:30:00",
      author: "Inspetor Geral",
      status: "ativo",
      read: false
    },
    {
      id: 2,
      title: "Veículos não identificados na região central",
      description: "Atenção redobrada a veículos sem identificação circulando no centro.",
      type: "urgente",
      createdAt: "2025-04-07T09:15:00",
      author: "Comandante Operacional",
      status: "ativo",
      read: false
    },
    {
      id: 3,
      title: "Reunião extraordinária",
      description: "Presença obrigatória na sede administrativa às 14h.",
      type: "ordem",
      createdAt: "2025-04-06T16:45:00",
      author: "Secretário Municipal",
      status: "ativo",
      read: true
    },
    {
      id: 4,
      title: "Apoio à Polícia Civil",
      description: "Solicitação de apoio para diligências na zona leste no dia 10/04.",
      type: "diligencia",
      createdAt: "2025-04-05T11:20:00",
      author: "Coordenador de Operações",
      status: "ativo",
      read: true
    },
    {
      id: 5,
      title: "Manutenção do sistema de rádio",
      description: "Sistema de rádio estará em manutenção das 22h às 23h de hoje.",
      type: "administrativo",
      createdAt: "2025-04-07T08:00:00",
      author: "Suporte Técnico",
      status: "ativo",
      read: false
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgente":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "ordem":
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      case "diligencia":
        return <Package className="h-5 w-5 text-orange-500" />;
      case "procedimento":
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case "administrativo":
        return <ClipboardList className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "urgente":
        return {
          bg: "bg-red-50",
          border: "border-l-4 border-l-red-500",
          badge: "bg-red-100 text-red-800"
        };
      case "ordem":
        return {
          bg: "bg-blue-50",
          border: "border-l-4 border-l-blue-500",
          badge: "bg-blue-100 text-blue-800"
        };
      case "diligencia":
        return {
          bg: "bg-orange-50",
          border: "border-l-4 border-l-orange-500",
          badge: "bg-orange-100 text-orange-800"
        };
      case "procedimento":
        return {
          bg: "bg-purple-50",
          border: "border-l-4 border-l-purple-500",
          badge: "bg-purple-100 text-purple-800"
        };
      case "administrativo":
        return {
          bg: "bg-gray-50",
          border: "border-l-4 border-l-gray-500",
          badge: "bg-gray-100 text-gray-800"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-l-4 border-l-gray-500",
          badge: "bg-gray-100 text-gray-800"
        };
    }
  };

  const getAlertTypeName = (type: string) => {
    switch (type) {
      case "urgente":
        return "Urgente";
      case "ordem":
        return "Ordem do Inspetor";
      case "diligencia":
        return "Nova Diligência";
      case "procedimento":
        return "Mudança de Procedimento";
      case "administrativo":
        return "Aviso Administrativo";
      default:
        return "Aviso";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleMarkAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
    
    toast({
      title: "Alerta marcado como lido",
      description: "O alerta foi marcado como lido com sucesso."
    });
  };

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    
    toast({
      title: "Alerta removido",
      description: "O alerta foi removido da sua lista."
    });
  };

  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.read).length;

  // Limit displayed alerts
  const displayedAlerts = alerts.slice(0, Math.floor(maxDisplayedAlerts));
  const hasMoreAlerts = alerts.length > displayedAlerts.length;

  return (
    <Card className="shadow-md animate-fade-up" style={{ animationDelay: '200ms' }}>
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Megaphone className="h-5 w-5 mr-2 text-gcm-600" />
          <h2 className="text-lg font-semibold text-gcm-700">Mural de Alertas</h2>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="bg-red-100 text-red-800 animate-pulse">
            {unreadCount} novos
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto p-4">
          {displayedAlerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedAlerts.map((alert, index) => {
                const colors = getAlertColor(alert.type);
                return (
                  <div 
                    key={alert.id} 
                    className={cn(
                      "rounded-lg p-4 transition-all duration-300 relative h-full",
                      colors.bg,
                      colors.border,
                      alert.read ? "opacity-80" : "shadow-sm",
                      "animate-fade-up"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start flex-wrap">
                            <h3 className="font-medium text-gray-900">{alert.title}</h3>
                            <Badge variant="outline" className={colors.badge}>
                              {getAlertTypeName(alert.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto pt-3 text-xs text-gray-500">
                        <div>
                          <p>Por: {alert.author}</p>
                          <p className="mt-1">{formatDate(alert.createdAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          {!alert.read && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs bg-white"
                              onClick={() => handleMarkAsRead(alert.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Lido
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-xs text-gray-500"
                            onClick={() => handleDismiss(alert.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
              <p>Não há alertas para exibir.</p>
            </div>
          )}
          
          {hasMoreAlerts && (
            <div className="text-center pt-4">
              <Badge variant="outline" className="bg-gray-50 cursor-pointer">
                + {alerts.length - displayedAlerts.length} mais alertas
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
