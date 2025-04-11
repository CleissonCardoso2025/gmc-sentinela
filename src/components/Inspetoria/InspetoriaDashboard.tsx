import React, { useState } from 'react';
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
  UserCheck,
  BarChart as ChartIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import OccurrenceList from "@/components/Dashboard/OccurrenceList";
import VehicleTable from "@/components/Dashboard/VehicleTable";
import AlertPanel from "@/components/Inspetoria/AlertPanel";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Occurrence } from '@/hooks/use-occurrence-data';

const InspetoriaDashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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

  // Mock data converted to match Occurrence type
  const mockOccurrences: Occurrence[] = [
    {
      id: 1,
      titulo: "Perturbação do sossego",
      local: "Rua das Flores, 123",
      data: new Date().toISOString(),
    },
    {
      id: 2,
      titulo: "Acidente de trânsito",
      local: "Av. Paulista, 1000",
      data: new Date().toISOString(),
    },
    {
      id: 3,
      titulo: "Fiscalização de comércio",
      local: "Rua Comercial, 456",
      data: new Date().toISOString(),
    },
    {
      id: 4,
      titulo: "Apoio ao SAMU",
      local: "Praça Central",
      data: new Date(Date.now() - 86400000).toISOString(), // yesterday
    },
    {
      id: 5,
      titulo: "Fiscalização de som alto",
      local: "Rua das Palmeiras, 789",
      data: new Date(Date.now() - 86400000).toISOString(), // yesterday
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

  // Mock data for charts
  const ocorrenciasPorDia = [
    { name: 'Seg', ocorrencias: 12 },
    { name: 'Ter', ocorrencias: 8 },
    { name: 'Qua', ocorrencias: 15 },
    { name: 'Qui', ocorrencias: 10 },
    { name: 'Sex', ocorrencias: 18 },
    { name: 'Sáb', ocorrencias: 22 },
    { name: 'Dom', ocorrencias: 14 },
  ];

  const efetivoPorTurno = [
    { name: 'Manhã', agentes: 12 },
    { name: 'Tarde', agentes: 15 },
    { name: 'Noite', agentes: 10 },
  ];

  const tiposOcorrencias = [
    { name: 'Perturbação', value: 35, color: '#3b82f6' },
    { name: 'Trânsito', value: 25, color: '#ef4444' },
    { name: 'Fiscalização', value: 20, color: '#10b981' },
    { name: 'Apoio', value: 15, color: '#f59e0b' },
    { name: 'Outros', value: 5, color: '#8b5cf6' },
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

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center">
            <ChartIcon className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Operações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 animate-fade-in">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
        </TabsContent>

        <TabsContent value="charts" className="mt-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ocorrências por Dia */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Ocorrências por Dia
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={ocorrenciasPorDia}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="ocorrencias" 
                      name="Ocorrências" 
                      stroke="#f97316" 
                      fill="#fdba74" 
                      animationDuration={1500} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Efetivo por Turno */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Efetivo por Turno
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={efetivoPorTurno}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="agentes" 
                      name="Agentes" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={1500} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Tipos de Ocorrências */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                Tipos de Ocorrências
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tiposOcorrencias}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {tiposOcorrencias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Desempenho Mensal */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <ChartIcon className="h-5 w-5 mr-2 text-green-500" />
                Desempenho Mensal
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ocorrências Resolvidas</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full animate-[grow_1.5s_ease-out]" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tempo de Resposta</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-[grow_1.5s_ease-out]" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Presença dos Agentes</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full animate-[grow_1.5s_ease-out]" style={{ width: "95%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Viaturas Operacionais</span>
                    <span className="text-sm font-medium">86%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-600 h-2.5 rounded-full animate-[grow_1.5s_ease-out]" style={{ width: "86%" }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="mt-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-3 p-5">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Operações Agendadas
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Operação</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Coordenador</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">Operação Rua Segura</td>
                      <td className="px-4 py-3 text-sm">15/04/2025 - 14:00</td>
                      <td className="px-4 py-3 text-sm">Sgt. Roberto Silva</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Confirmada
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">Fiscalização Noturna</td>
                      <td className="px-4 py-3 text-sm">18/04/2025 - 22:00</td>
                      <td className="px-4 py-3 text-sm">Sgt. Marcos Oliveira</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          Planejamento
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">Apoio Evento Municipal</td>
                      <td className="px-4 py-3 text-sm">20/04/2025 - 09:00</td>
                      <td className="px-4 py-3 text-sm">Sgt. Pedro Costa</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          Aguardando
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Nova Operação
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InspetoriaDashboard;
