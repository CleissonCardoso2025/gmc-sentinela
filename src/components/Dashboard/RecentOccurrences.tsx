
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Occurrence {
  id: number;
  titulo: string;
  tipo: string;
  data: string;
  hora: string;
  local: string;
  status: 'aberta' | 'concluída' | 'em andamento' | 'arquivada';
}

export const RecentOccurrences: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data for recent occurrences
  const occurrences: Occurrence[] = [
    {
      id: 1234,
      titulo: "Perturbação do sossego público",
      tipo: "Contravenção",
      data: "07/04/2025",
      hora: "15:30",
      local: "Rua das Flores, 123 - Centro",
      status: "aberta"
    },
    {
      id: 1233,
      titulo: "Acidente de trânsito sem vítima",
      tipo: "Trânsito",
      data: "07/04/2025",
      hora: "11:45",
      local: "Av. Principal, 500 - Jardim Europa",
      status: "concluída"
    },
    {
      id: 1232,
      titulo: "Apoio à Polícia Militar",
      tipo: "Apoio",
      data: "06/04/2025",
      hora: "21:15",
      local: "Praça da República - Centro",
      status: "concluída"
    },
    {
      id: 1231,
      titulo: "Fiscalização de comércio ambulante",
      tipo: "Fiscalização",
      data: "06/04/2025",
      hora: "14:20",
      local: "Calçadão da Rua Direita - Centro",
      status: "em andamento"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Aberta</Badge>;
      case 'concluída':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Concluída</Badge>;
      case 'em andamento':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Em andamento</Badge>;
      case 'arquivada':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Arquivada</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const handleViewOccurrence = (id: number) => {
    navigate(`/ocorrencias/${id}`);
  };

  const handleViewAll = () => {
    navigate('/ocorrencias?tab=lista');
  };

  return (
    <Card className="shadow-md animate-fade-up" style={{ animationDelay: '300ms' }}>
      <CardHeader className="p-6 border-b flex flex-row items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-gcm-600" />
          <h2 className="text-lg font-semibold text-gcm-700">Ocorrências Recentes</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gcm-600 hover:text-gcm-700 hover:bg-gcm-50"
          onClick={handleViewAll}
        >
          Ver todas
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y">
          {occurrences.map((occurrence, index) => (
            <div 
              key={occurrence.id} 
              className={cn(
                "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${400 + index * 100}ms` }}
              onClick={() => handleViewOccurrence(occurrence.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-gray-900">{occurrence.titulo}</h3>
                  <div className="flex flex-wrap gap-y-1 gap-x-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {occurrence.data} às {occurrence.hora}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {occurrence.local}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(occurrence.status)}
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    #{occurrence.id}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
