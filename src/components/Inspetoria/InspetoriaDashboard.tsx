
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/Dashboard/StatCard";
import { 
  Shield, 
  Users, 
  Car, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  FileText,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import OccurrenceList from "@/components/Dashboard/OccurrenceList";
import VehicleTable from "@/components/Dashboard/VehicleTable";
import AlertPanel from "@/components/Inspetoria/AlertPanel";
import { useToast } from "@/hooks/use-toast";

const InspetoriaDashboard: React.FC = () => {
  const { toast } = useToast();

  // Mock data for the current shift
  const currentShift = {
    supervisor: "Sgt. Roberto Silva",
    team: ["Agente Carlos Pereira", "Agente Ana Melo", "Agente Paulo Santos"],
    vehicle: "GCM-1234 (Spin)",
    status: "Em andamento",
    startTime: "08:00",
    endTime: "20:00"
  };

  // Mock data for upcoming shifts
  const upcomingShifts = [
    {
      id: 1,
      date: "Hoje - Noturno",
      supervisor: "Sgt. Marcos Oliveira",
      team: ["Agente Juliana Campos", "Agente Ricardo Alves", "Agente Fernanda Lima"],
      vehicle: "GCM-5678 (Hilux)"
    },
    {
      id: 2,
      date: "Amanhã - Diurno",
      supervisor: "Sgt. Pedro Costa",
      team: ["Agente Lucas Martins", "Agente Carla Dias", "Agente Bruno Sousa"],
      vehicle: "GCM-9012 (Duster)"
    }
  ];

  // Mock data for occurrences
  const mockOccurrences = [
    {
      titulo: "Perturbação do sossego",
      local: "Rua das Flores, 123",
      hora: "Hoje, 14:30"
    },
    {
      titulo: "Acidente de trânsito",
      local: "Av. Paulista, 1000",
      hora: "Hoje, 11:15"
    },
    {
      titulo: "Fiscalização de comércio",
      local: "Rua Comercial, 456",
      hora: "Hoje, 09:45"
    },
    {
      titulo: "Apoio ao SAMU",
      local: "Praça Central",
      hora: "Ontem, 23:20"
    },
    {
      titulo: "Fiscalização de som alto",
      local: "Rua das Palmeiras, 789",
      hora: "Ontem, 22:10"
    }
  ];

  // Mock data for vehicles
  const mockVehicles = [
    {
      id: 1,
      placa: "GCM-1234",
      status: "Em serviço",
      condutor: "Agente Carlos Pereira",
      quilometragem: "45.890",
      proximaManutencao: "15/12/2023"
    },
    {
      id: 2,
      placa: "GCM-5678",
      status: "Em serviço",
      condutor: "Agente Ricardo Alves",
      quilometragem: "32.450",
      proximaManutencao: "20/12/2023"
    },
    {
      id: 3,
      placa: "GCM-9012",
      status: "Disponível",
      condutor: "-",
      quilometragem: "28.760",
      proximaManutencao: "05/01/2024"
    },
    {
      id: 4,
      placa: "GCM-3456",
      status: "Manutenção",
      condutor: "-",
      quilometragem: "52.120",
      proximaManutencao: "Em andamento"
    },
    {
      id: 5,
      placa: "GCM-7890",
      status: "Inoperante",
      condutor: "-",
      quilometragem: "68.540",
      proximaManutencao: "Indeterminado"
    }
  ];

  // Mock data for maintenances
  const mockMaintenances = [
    {
      id: 1,
      placa: "GCM-3456",
      tipo: "Revisão Completa",
      dataInicio: "10/12/2023",
      previsaoTermino: "15/12/2023",
      descricao: "Troca de óleo, filtros e verificação geral",
      status: "Em andamento"
    },
    {
      id: 2,
      placa: "GCM-7890",
      tipo: "Reparo no Motor",
      dataInicio: "05/12/2023",
      previsaoTermino: "Indeterminado",
      descricao: "Problema no sistema de injeção eletrônica",
      status: "Em andamento"
    },
    {
      id: 3,
      placa: "GCM-2345",
      tipo: "Troca de Pneus",
      dataInicio: "01/12/2023",
      previsaoTermino: "01/12/2023",
      descricao: "Substituição dos 4 pneus",
      status: "Concluída"
    }
  ];

  const handleDesignateSupervisor = () => {
    toast({
      title: "Supervisor designado",
      description: "O supervisor foi designado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Guarnições Ativas"
          value="4"
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard 
          title="Viaturas Disponíveis"
          value="6"
          icon={<Car className="h-5 w-5 text-green-600" />}
          color="text-green-600"
        />
        <StatCard 
          title="Ocorrências (Hoje)"
          value="12"
          icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
          color="text-yellow-600"
        />
        <StatCard 
          title="Agentes em Serviço"
          value="18"
          icon={<UserCheck className="h-5 w-5 text-purple-600" />}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Shift */}
        <Card className="col-span-1 p-5 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Plantão Atual
            </h3>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              {currentShift.status}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Supervisor</p>
              <p className="font-medium">{currentShift.supervisor}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Equipe</p>
              <ul className="list-disc list-inside">
                {currentShift.team.map((member, index) => (
                  <li key={index} className="text-sm">{member}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Viatura</p>
              <p className="font-medium">{currentShift.vehicle}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Horário</p>
              <p className="font-medium">{`${currentShift.startTime} - ${currentShift.endTime}`}</p>
            </div>
          </div>
        </Card>

        {/* Upcoming Shifts */}
        <Card className="col-span-1 p-5">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2 text-purple-500" />
            Próximos Plantões
          </h3>
          
          <div className="space-y-4">
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{shift.date}</p>
                </div>
                <p className="text-sm mt-1"><span className="text-gray-500">Supervisor:</span> {shift.supervisor}</p>
                <p className="text-sm mt-1"><span className="text-gray-500">Viatura:</span> {shift.vehicle}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Equipe:</p>
                  <ul className="list-disc list-inside">
                    {shift.team.map((member, index) => (
                      <li key={index} className="text-xs text-gray-600">{member}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleDesignateSupervisor}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Designar Supervisor do Dia
            </Button>
          </div>
        </Card>

        {/* Alerts */}
        <Card className="col-span-1 p-5">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Alertas Importantes
          </h3>
          <AlertPanel />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Occurrences */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <FileText className="h-5 w-5 mr-2 text-indigo-500" />
            Ocorrências Recentes
          </h3>
          <OccurrenceList occurrences={mockOccurrences} limit={5} />
        </Card>

        {/* Available Vehicles */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Car className="h-5 w-5 mr-2 text-green-500" />
            Viaturas Disponíveis
          </h3>
          <VehicleTable vehicles={mockVehicles} maintenances={mockMaintenances} limit={5} />
        </Card>
      </div>
    </div>
  );
};

export default InspetoriaDashboard;
