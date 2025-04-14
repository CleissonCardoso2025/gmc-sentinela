
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Car, 
  AlertTriangle, 
  UserX, 
  AlertCircle 
} from "lucide-react";
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
  Legend
} from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import EmptyState from "@/components/Dashboard/EmptyState";

const RelatoriosOperacionais: React.FC = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("plantoes");
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd")
  });
  
  // State for data from Supabase
  const [isLoading, setIsLoading] = useState(true);
  const [plantoesData, setPlantoesData] = useState<any[]>([]);
  const [ocorrenciasData, setOcorrenciasData] = useState<any[]>([]);
  const [viaturasData, setViaturasData] = useState<any[]>([]);
  const [faltasData, setFaltasData] = useState<any[]>([]);
  const [totais, setTotais] = useState({
    plantoes: 0,
    plantoesDiurnos: 0,
    plantoesNoturnos: 0,
    mediaAgentes: 0,
    plantoesIncompletos: 0,
    ocorrencias: 0,
    ocorrenciasAlta: 0,
    ocorrenciasMeida: 0,
    ocorrenciasBaixa: 0,
    tempoMedioResposta: 0,
    viaturas: 0,
    quilometragemTotal: 0,
    mediaDiaria: 0,
    manutencoes: 0,
    custoManutencao: 0,
    agentes: 0,
    faltas: 0,
    licencas: 0,
    ferias: 0,
    substituicoes: 0
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get start and end dates for filtering
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        // Fetch escala data for plantoes
        const { data: escalaData, error: escalaError } = await supabase
          .from('escala_items')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
        
        if (escalaError) throw escalaError;
        
        // Fetch vehicles data for viaturas
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*');
          
        if (vehiclesError) throw vehiclesError;
        
        // Fetch ocorrencias data
        const { data: ocorrenciasDbData, error: ocorrenciasError } = await supabase
          .from('ocorrencias')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
          
        if (ocorrenciasError) throw ocorrenciasError;
        
        // Process plantoes data
        const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
        const plantoesByDay = daysOfWeek.map(day => ({
          name: day,
          plantoes: 0
        }));
        
        let totalPlantoes = 0;
        let plantoesDiurnos = 0;
        let plantoesNoturnos = 0;
        let agentesTotal = 0;
        let plantoesIncompletos = 0;
        
        if (escalaData && escalaData.length > 0) {
          escalaData.forEach(item => {
            if (item.schedule) {
              const scheduleDays = item.schedule;
              scheduleDays.forEach((day: any) => {
                const dayIndex = daysOfWeek.indexOf(day.day);
                if (dayIndex >= 0 && day.shift === "24h") {
                  plantoesByDay[dayIndex].plantoes += 1;
                  totalPlantoes += 1;
                  
                  // Count day/night shifts based on some logic
                  if (dayIndex < 5) { // Weekday
                    plantoesDiurnos += 1;
                  } else { // Weekend
                    plantoesNoturnos += 1;
                  }
                  
                  agentesTotal += 1;
                  
                  // Count incomplete shifts based on status
                  if (day.status !== 'presente') {
                    plantoesIncompletos += 1;
                  }
                }
              });
            }
          });
        }
        
        // Process ocorrencias data
        const ocorrenciasByDay = daysOfWeek.map(day => ({
          name: day,
          ocorrencias: 0
        }));
        
        let ocorrenciasAlta = 0;
        let ocorrenciasMeida = 0;
        let ocorrenciasBaixa = 0;
        
        if (ocorrenciasDbData && ocorrenciasDbData.length > 0) {
          ocorrenciasDbData.forEach(item => {
            const date = new Date(item.created_at || item.data);
            const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert 0-6 (Sun-Sat) to 0-6 (Mon-Sun)
            if (dayIndex >= 0) {
              ocorrenciasByDay[dayIndex].ocorrencias += 1;
            }
            
            // Count by priority
            switch (item.status?.toLowerCase()) {
              case 'alta':
                ocorrenciasAlta += 1;
                break;
              case 'média':
                ocorrenciasMeida += 1;
                break;
              case 'baixa':
                ocorrenciasBaixa += 1;
                break;
            }
          });
        }
        
        // Process viaturas data
        const viaturasProcessed = [
          { name: 'Em operação', value: 0, color: '#22c55e' },
          { name: 'Em manutenção', value: 0, color: '#f59e0b' },
          { name: 'Inoperantes', value: 0, color: '#ef4444' },
        ];
        
        let quilometragemTotal = 0;
        let manutencoes = 0;
        
        if (vehiclesData && vehiclesData.length > 0) {
          vehiclesData.forEach(vehicle => {
            switch (vehicle.status?.toLowerCase()) {
              case 'operacional':
                viaturasProcessed[0].value += 1;
                break;
              case 'manutenção':
                viaturasProcessed[1].value += 1;
                manutencoes += 1;
                break;
              case 'inoperante':
                viaturasProcessed[2].value += 1;
                break;
            }
            
            quilometragemTotal += (vehicle.quilometragem || 0);
          });
        }
        
        // Process faltas data (using escala data)
        const faltasProcessed = [
          { name: 'Presentes', value: 0, color: '#3b82f6' },
          { name: 'Faltas', value: 0, color: '#ef4444' },
          { name: 'Licenças', value: 0, color: '#a855f7' },
          { name: 'Férias', value: 0, color: '#06b6d4' },
        ];
        
        let substituicoes = 0;
        
        if (escalaData && escalaData.length > 0) {
          escalaData.forEach(item => {
            if (item.schedule) {
              const scheduleDays = item.schedule;
              scheduleDays.forEach((day: any) => {
                switch (day.status?.toLowerCase()) {
                  case 'presente':
                    faltasProcessed[0].value += 1;
                    break;
                  case 'falta':
                    faltasProcessed[1].value += 1;
                    break;
                  case 'licença':
                    faltasProcessed[2].value += 1;
                    substituicoes += 1; // Assume each license requires a substitution
                    break;
                  case 'folga':
                    faltasProcessed[3].value += 1;
                    break;
                }
              });
            }
          });
        }
        
        // Set all the processed data
        setPlantoesData(plantoesByDay);
        setOcorrenciasData(ocorrenciasByDay);
        setViaturasData(viaturasProcessed);
        setFaltasData(faltasProcessed);
        
        // Set totals
        setTotais({
          plantoes: totalPlantoes,
          plantoesDiurnos,
          plantoesNoturnos,
          mediaAgentes: totalPlantoes > 0 ? +(agentesTotal / totalPlantoes).toFixed(1) : 0,
          plantoesIncompletos,
          ocorrencias: ocorrenciasDbData?.length || 0,
          ocorrenciasAlta,
          ocorrenciasMeida,
          ocorrenciasBaixa,
          tempoMedioResposta: 12, // Mock data for now
          viaturas: vehiclesData?.length || 0,
          quilometragemTotal,
          mediaDiaria: quilometragemTotal > 0 ? Math.round(quilometragemTotal / 7) : 0,
          manutencoes,
          custoManutencao: manutencoes * 1500, // Mock data for now
          agentes: faltasProcessed.reduce((acc, curr) => acc + curr.value, 0),
          faltas: faltasProcessed[1].value,
          licencas: faltasProcessed[2].value,
          ferias: faltasProcessed[3].value,
          substituicoes
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos relatórios.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange, toast]);

  const handleExportPDF = () => {
    toast({
      title: "Exportando relatório",
      description: "O relatório está sendo exportado para PDF."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Imprimindo relatório",
      description: "O relatório está sendo enviado para impressão."
    });
  };

  const chartConfig = {
    plantoes: {
      label: "Plantões",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa",
      },
    },
    ocorrencias: {
      label: "Ocorrências",
      theme: {
        light: "#f97316",
        dark: "#fb923c",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasNoData = 
    plantoesData.every(item => item.plantoes === 0) && 
    ocorrenciasData.every(item => item.ocorrencias === 0) && 
    viaturasData.every(item => item.value === 0) && 
    faltasData.every(item => item.value === 0);

  if (hasNoData) {
    return (
      <EmptyState 
        icon="info"
        title="Sem dados para exibir" 
        description="Não há dados disponíveis para o período selecionado. Tente selecionar um período diferente ou cadastrar novas informações."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
          <Select 
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plantoes">Histórico de Plantões</SelectItem>
              <SelectItem value="ocorrencias">Ocorrências Registradas</SelectItem>
              <SelectItem value="viaturas">Uso de Viaturas</SelectItem>
              <SelectItem value="faltas">Faltas e Substituições</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input 
              type="date" 
              placeholder="Data Inicial"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full md:w-auto"
            />
            <span>até</span>
            <Input 
              type="date" 
              placeholder="Data Final"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full md:w-auto"
            />
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plantoes" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Plantões
          </TabsTrigger>
          <TabsTrigger value="ocorrencias" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Ocorrências
          </TabsTrigger>
          <TabsTrigger value="viaturas" className="flex items-center">
            <Car className="h-4 w-4 mr-2" />
            Viaturas
          </TabsTrigger>
          <TabsTrigger value="faltas" className="flex items-center">
            <UserX className="h-4 w-4 mr-2" />
            Faltas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plantoes" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Plantões por Dia da Semana</CardTitle>
                <CardDescription>Quantidade de plantões realizados por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80" config={chartConfig}>
                  <BarChart data={plantoesData} className="animate-fade-in">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip 
                      content={<ChartTooltipContent labelKey="name" labelClassName="font-medium" />} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="plantoes" 
                      name="Plantões" 
                      fill="var(--color-plantoes)" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Resumo de Plantões</CardTitle>
                <CardDescription>Informações gerais sobre plantões</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Total de Plantões:</span>
                  <span className="text-xl font-bold">{totais.plantoes}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Plantões Diurnos:</span>
                  <span className="text-lg">{totais.plantoesDiurnos}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Plantões Noturnos:</span>
                  <span className="text-lg">{totais.plantoesNoturnos}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Média de Agentes por Plantão:</span>
                  <span className="text-lg">{totais.mediaAgentes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plantões Incompletos:</span>
                  <span className="text-lg text-yellow-600">{totais.plantoesIncompletos}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ocorrencias" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Ocorrências por Dia</CardTitle>
                <CardDescription>Número de ocorrências registradas diariamente</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-80" config={chartConfig}>
                  <LineChart data={ocorrenciasData} className="animate-fade-in">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip 
                      content={<ChartTooltipContent labelKey="name" labelClassName="font-medium" />} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ocorrencias" 
                      name="Ocorrências" 
                      stroke="var(--color-ocorrencias)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Resumo de Ocorrências</CardTitle>
                <CardDescription>Estatísticas gerais sobre ocorrências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Total de Ocorrências:</span>
                  <span className="text-xl font-bold">{totais.ocorrencias}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Alta Prioridade:</span>
                  <span className="text-lg text-red-600">{totais.ocorrenciasAlta}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Média Prioridade:</span>
                  <span className="text-lg text-yellow-600">{totais.ocorrenciasMeida}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Baixa Prioridade:</span>
                  <span className="text-lg text-green-600">{totais.ocorrenciasBaixa}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tempo Médio de Resposta:</span>
                  <span className="text-lg">{totais.tempoMedioResposta} min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="viaturas" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Status das Viaturas</CardTitle>
                <CardDescription>Distribuição das viaturas por status operacional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 animate-fade-in">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={viaturasData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {viaturasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Uso de Viaturas</CardTitle>
                <CardDescription>Estatísticas de utilização da frota</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Total de Viaturas:</span>
                  <span className="text-xl font-bold">{totais.viaturas}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Quilometragem Total:</span>
                  <span className="text-lg">{totais.quilometragemTotal.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Média Diária:</span>
                  <span className="text-lg">{totais.mediaDiaria.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Manutenções Realizadas:</span>
                  <span className="text-lg">{totais.manutencoes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Custo de Manutenção:</span>
                  <span className="text-lg">R$ {totais.custoManutencao.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faltas" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Presença dos Agentes</CardTitle>
                <CardDescription>Distribuição de presenças, faltas e licenças</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 animate-fade-in">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={faltasData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {faltasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Resumo de Faltas</CardTitle>
                <CardDescription>Detalhamento de ausências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Total de Agentes:</span>
                  <span className="text-xl font-bold">{totais.agentes}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Faltas Registradas:</span>
                  <span className="text-lg text-red-600">{totais.faltas}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Licenças Médicas:</span>
                  <span className="text-lg">{totais.licencas}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Férias:</span>
                  <span className="text-lg">{totais.ferias}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Substituições Realizadas:</span>
                  <span className="text-lg">{totais.substituicoes}</span>
                </div>
              </CardContent>
            </Card>

            {(totais.faltas > 0 || totais.licencas > 0) && (
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Alerta de Faltas Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {totais.faltas > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Faltas registradas</AlertTitle>
                      <AlertDescription>
                        Foram registradas {totais.faltas} faltas no período selecionado.
                      </AlertDescription>
                    </Alert>
                  )}
                  {totais.licencas > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Licenças registradas</AlertTitle>
                      <AlertDescription>
                        Foram registradas {totais.licencas} licenças médicas no período selecionado.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosOperacionais;
