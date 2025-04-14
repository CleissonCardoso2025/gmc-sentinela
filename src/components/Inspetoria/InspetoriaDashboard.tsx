
import React, { useState, useEffect } from 'react';
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
import { useOccurrenceStats } from '@/hooks/use-occurrence-stats';
import { useOccurrenceData } from '@/hooks/use-occurrence-data';
import { useVehicleLocations } from '@/hooks/use-vehicle-locations';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/Dashboard/EmptyState';

const InspetoriaDashboard: React.FC = () => {
  const { toast } = useToast();
  const { stats, isLoading: statsLoading } = useOccurrenceStats();
  const { occurrences, isLoading: occurrencesLoading } = useOccurrenceData('7d');
  const { vehicles, isLoading: vehiclesLoading } = useVehicleLocations();
  const [activeTab, setActiveTab] = useState("overview");
  const [guarnicoesCount, setGuarnicoesCount] = useState(0);
  const [agentsCount, setAgentsCount] = useState(0);
  const [currentShift, setCurrentShift] = useState<any>(null);
  const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [loadingMaintenances, setLoadingMaintenances] = useState(true);
  
  // For charts
  const [ocorrenciasPorDia, setOcorrenciasPorDia] = useState<any[]>([]);
  const [efetivoPorTurno, setEfetivoPorTurno] = useState<any[]>([]);
  const [tiposOcorrencias, setTiposOcorrencias] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch active "guarnicoes" count
    const fetchGuarnicoesCount = async () => {
      try {
        const { count, error } = await supabase
          .from('guarnicoes')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        setGuarnicoesCount(count || 0);
      } catch (error) {
        console.error("Error fetching guarnicoes count:", error);
        setGuarnicoesCount(0);
      }
    };
    
    // Fetch active agents count (from membros_guarnicao)
    const fetchAgentsCount = async () => {
      try {
        const { count, error } = await supabase
          .from('membros_guarnicao')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        setAgentsCount(count || 0);
      } catch (error) {
        console.error("Error fetching agents count:", error);
        setAgentsCount(0);
      }
    };
    
    // Fetch current and upcoming shifts
    const fetchShifts = async () => {
      setLoadingShifts(true);
      try {
        const { data, error } = await supabase
          .from('escala_items')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCurrentShift({
            supervisor: data[0].supervisor || "Não designado",
            team: data[0].agent ? [data[0].agent] : [],
            vehicle: data[0].viatura || "Não designada",
            status: "Em andamento",
            startTime: "08:00", // Default values since we don't have this info
            endTime: "20:00"
          });
          
          const upcoming = data.slice(1).map(item => ({
            id: item.id,
            date: item.periodo || "Não especificado",
            supervisor: item.supervisor || "Não designado",
            team: item.agent ? [item.agent] : [],
            vehicle: item.viatura || "Não designada"
          }));
          
          setUpcomingShifts(upcoming);
        } else {
          setCurrentShift(null);
          setUpcomingShifts([]);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setCurrentShift(null);
        setUpcomingShifts([]);
      } finally {
        setLoadingShifts(false);
      }
    };
    
    // Fetch vehicle maintenances
    const fetchMaintenances = async () => {
      setLoadingMaintenances(true);
      try {
        // We don't have a proper maintenance table, so we'll use vehicles with maintenance status
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('status', 'Manutenção')
          .limit(3);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedMaintenances = data.map(vehicle => ({
            id: vehicle.id,
            placa: vehicle.placa,
            tipo: "Manutenção Programada",
            dataInicio: vehicle.ultimamanutencao ? new Date(vehicle.ultimamanutencao).toLocaleDateString('pt-BR') : "Não especificada",
            previsaoTermino: vehicle.proximamanutencao ? new Date(vehicle.proximamanutencao).toLocaleDateString('pt-BR') : "Não especificada",
            descricao: vehicle.observacoes || "Sem descrição",
            status: "Em andamento"
          }));
          
          setMaintenances(formattedMaintenances);
        } else {
          setMaintenances([]);
        }
      } catch (error) {
        console.error("Error fetching maintenances:", error);
        setMaintenances([]);
      } finally {
        setLoadingMaintenances(false);
      }
    };
    
    // Fetch data for charts
    const fetchChartData = async () => {
      try {
        // Data for ocorrenciasPorDia (occurrences by day)
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const { data: ocorrenciasData, error: ocorrenciasError } = await supabase
          .from('ocorrencias')
          .select('*')
          .gte('created_at', lastWeek.toISOString());
          
        if (ocorrenciasError) throw ocorrenciasError;
        
        const occurrencesByDay = Array(7).fill(0);
        
        if (ocorrenciasData && ocorrenciasData.length > 0) {
          ocorrenciasData.forEach(item => {
            const date = new Date(item.created_at);
            const dayIndex = date.getDay();
            occurrencesByDay[dayIndex]++;
          });
        }
        
        const chartData = daysOfWeek.map((day, index) => ({
          name: day,
          ocorrencias: occurrencesByDay[index]
        }));
        
        setOcorrenciasPorDia(chartData);
        
        // Efetivo por turno (simplified with just the count from different periods)
        const { data: escalaData, error: escalaError } = await supabase
          .from('escala_items')
          .select('periodo');
          
        if (escalaError) throw escalaError;
        
        const turnoCounts = {
          'Manhã': 0,
          'Tarde': 0,
          'Noite': 0
        };
        
        if (escalaData && escalaData.length > 0) {
          escalaData.forEach(item => {
            if (item.periodo && item.periodo.includes('Manhã')) {
              turnoCounts['Manhã']++;
            } else if (item.periodo && item.periodo.includes('Tarde')) {
              turnoCounts['Tarde']++;
            } else if (item.periodo && item.periodo.includes('Noite')) {
              turnoCounts['Noite']++;
            }
          });
        }
        
        const turnoChartData = Object.entries(turnoCounts).map(([name, count]) => ({
          name,
          agentes: count
        }));
        
        setEfetivoPorTurno(turnoChartData);
        
        // Tipos de ocorrências
        const { data: tiposData, error: tiposError } = await supabase
          .from('ocorrencias')
          .select('tipo');
          
        if (tiposError) throw tiposError;
        
        const tiposCounts: Record<string, number> = {};
        
        if (tiposData && tiposData.length > 0) {
          tiposData.forEach(item => {
            if (item.tipo) {
              tiposCounts[item.tipo] = (tiposCounts[item.tipo] || 0) + 1;
            }
          });
        }
        
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
        
        const tiposChartData = Object.entries(tiposCounts)
          .map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
          }))
          .slice(0, 5); // Limit to top 5
        
        if (tiposChartData.length === 0) {
          // Default empty state
          setTiposOcorrencias([
            { name: 'Sem dados', value: 1, color: '#d1d5db' }
          ]);
        } else {
          setTiposOcorrencias(tiposChartData);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Set default empty chart data
        setOcorrenciasPorDia([
          { name: 'Seg', ocorrencias: 0 },
          { name: 'Ter', ocorrencias: 0 },
          { name: 'Qua', ocorrencias: 0 },
          { name: 'Qui', ocorrencias: 0 },
          { name: 'Sex', ocorrencias: 0 },
          { name: 'Sáb', ocorrencias: 0 },
          { name: 'Dom', ocorrencias: 0 },
        ]);
        
        setEfetivoPorTurno([
          { name: 'Manhã', agentes: 0 },
          { name: 'Tarde', agentes: 0 },
          { name: 'Noite', agentes: 0 },
        ]);
        
        setTiposOcorrencias([
          { name: 'Sem dados', value: 1, color: '#d1d5db' }
        ]);
      }
    };
    
    fetchGuarnicoesCount();
    fetchAgentsCount();
    fetchShifts();
    fetchMaintenances();
    fetchChartData();
  }, []);

  const handleDesignateSupervisor = () => {
    toast({
      title: "Supervisor designado",
      description: "O supervisor foi designado com sucesso.",
    });
  };

  const availableVehicles = vehicles.filter(v => v.placa && !v.placa.includes("Manutenção"));

  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Guarnições Ativas"
          value={statsLoading ? "..." : String(guarnicoesCount)}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="text-blue-600"
        />
        <StatCard 
          title="Viaturas Disponíveis"
          value={vehiclesLoading ? "..." : String(availableVehicles.length)}
          icon={<Car className="h-5 w-5 text-green-600" />}
          color="text-green-600"
        />
        <StatCard 
          title="Ocorrências (Hoje)"
          value={statsLoading ? "..." : String(stats.todayCount)}
          icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
          color="text-yellow-600"
        />
        <StatCard 
          title="Agentes em Serviço"
          value={statsLoading ? "..." : String(agentsCount)}
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
                {loadingShifts ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  currentShift && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      {currentShift.status}
                    </Badge>
                  )
                )}
              </div>
              
              {loadingShifts ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ) : currentShift ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Supervisor</p>
                    <p className="font-medium">{currentShift.supervisor}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Equipe</p>
                    {currentShift.team.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {currentShift.team.map((member: string, index: number) => (
                          <li key={index} className="text-sm">{member}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">Nenhum membro designado</p>
                    )}
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
              ) : (
                <EmptyState
                  title="Sem plantão ativo"
                  description="Não há plantão em andamento."
                  icon="info"
                />
              )}
            </Card>

            {/* Upcoming Shifts */}
            <Card className="col-span-1 p-5">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                Próximos Plantões
              </h3>
              
              {loadingShifts ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : upcomingShifts.length > 0 ? (
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
                        {shift.team.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {shift.team.map((member: string, index: number) => (
                              <li key={index} className="text-xs text-gray-600">{member}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-400">Nenhum membro designado</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Sem plantões agendados"
                  description="Não há plantões agendados para o futuro."
                  icon="info"
                />
              )}
              
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
              {occurrencesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="max-h-[350px] overflow-y-auto">
                  <OccurrenceList occurrences={occurrences} limit={5} />
                </div>
              )}
            </Card>

            {/* Available Vehicles */}
            <Card className="p-5">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Car className="h-5 w-5 mr-2 text-green-500" />
                Viaturas Disponíveis
              </h3>
              {vehiclesLoading || loadingMaintenances ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="max-h-[350px] overflow-y-auto">
                  <VehicleTable vehicles={vehicles} maintenances={maintenances} limit={5} />
                </div>
              )}
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
                Desempenho Sistema
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ocorrências Cadastradas</span>
                    <span className="text-sm font-medium">{stats.monthCount} este mês</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full animate-[grow_1.5s_ease-out]" 
                      style={{ width: `${Math.min(100, stats.monthCount > 0 ? 100 : 0)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Viaturas Operacionais</span>
                    <span className="text-sm font-medium">
                      {vehicles.length > 0 ? 
                        `${Math.round((availableVehicles.length / vehicles.length) * 100)}%` : 
                        '0%'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full animate-[grow_1.5s_ease-out]" 
                      style={{ 
                        width: `${vehicles.length > 0 ? 
                          (availableVehicles.length / vehicles.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Escalas Completas</span>
                    <span className="text-sm font-medium">
                      {upcomingShifts.length > 0 ? 
                        `${upcomingShifts.length} próximas` : 
                        '0'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full animate-[grow_1.5s_ease-out]" 
                      style={{ width: `${upcomingShifts.length > 0 ? 100 : 0}%` }}
                    ></div>
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
              <EmptyState
                title="Sem operações agendadas"
                description="Não há operações agendadas no momento."
                icon="info"
                actionLabel="Nova Operação"
                onAction={() => {
                  toast({
                    title: "Recurso em desenvolvimento",
                    description: "A funcionalidade de criar operações será implementada em breve."
                  });
                }}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InspetoriaDashboard;
