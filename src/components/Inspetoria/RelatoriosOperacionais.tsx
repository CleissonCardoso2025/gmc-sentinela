
import React, { useState } from 'react';
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

const RelatoriosOperacionais: React.FC = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("plantoes");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  // Mock data
  const plantoesData = [
    { name: 'Segunda', plantoes: 4 },
    { name: 'Terça', plantoes: 5 },
    { name: 'Quarta', plantoes: 3 },
    { name: 'Quinta', plantoes: 4 },
    { name: 'Sexta', plantoes: 5 },
    { name: 'Sábado', plantoes: 2 },
    { name: 'Domingo', plantoes: 2 },
  ];

  const ocorrenciasData = [
    { name: 'Segunda', ocorrencias: 12 },
    { name: 'Terça', ocorrencias: 8 },
    { name: 'Quarta', ocorrencias: 15 },
    { name: 'Quinta', ocorrencias: 10 },
    { name: 'Sexta', ocorrencias: 18 },
    { name: 'Sábado', ocorrencias: 22 },
    { name: 'Domingo', ocorrencias: 14 },
  ];

  const viaturasData = [
    { name: 'Em operação', value: 6, color: '#22c55e' },
    { name: 'Em manutenção', value: 2, color: '#f59e0b' },
    { name: 'Inoperantes', value: 1, color: '#ef4444' },
  ];

  const faltasData = [
    { name: 'Presentes', value: 28, color: '#3b82f6' },
    { name: 'Faltas', value: 2, color: '#ef4444' },
    { name: 'Licenças', value: 4, color: '#a855f7' },
    { name: 'Férias', value: 3, color: '#06b6d4' },
  ];

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
                  <span className="text-xl font-bold">25</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Plantões Diurnos:</span>
                  <span className="text-lg">15</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Plantões Noturnos:</span>
                  <span className="text-lg">10</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Média de Agentes por Plantão:</span>
                  <span className="text-lg">3.5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plantões Incompletos:</span>
                  <span className="text-lg text-yellow-600">2</span>
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
                  <span className="text-xl font-bold">99</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Alta Prioridade:</span>
                  <span className="text-lg text-red-600">12</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Média Prioridade:</span>
                  <span className="text-lg text-yellow-600">35</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Baixa Prioridade:</span>
                  <span className="text-lg text-green-600">52</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tempo Médio de Resposta:</span>
                  <span className="text-lg">12 min</span>
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
                  <span className="text-xl font-bold">9</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Quilometragem Total:</span>
                  <span className="text-lg">125.489 km</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Média Diária:</span>
                  <span className="text-lg">356 km</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Manutenções Realizadas:</span>
                  <span className="text-lg">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Custo de Manutenção:</span>
                  <span className="text-lg">R$ 8.450,00</span>
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
                  <span className="text-xl font-bold">37</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Faltas Registradas:</span>
                  <span className="text-lg text-red-600">2</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Licenças Médicas:</span>
                  <span className="text-lg">4</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium">Férias:</span>
                  <span className="text-lg">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Substituições Realizadas:</span>
                  <span className="text-lg">6</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Alerta de Faltas Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Agente Carlos Pereira</AlertTitle>
                  <AlertDescription>
                    Falta não justificada em 12/03/2025. Segunda ocorrência no mês.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Agente Ana Melo</AlertTitle>
                  <AlertDescription>
                    Licença médica de 10/03/2025 a 17/03/2025. Atestado médico registrado.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosOperacionais;
