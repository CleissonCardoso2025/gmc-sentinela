
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart2, TrendingUp, Calendar } from "lucide-react";
import { Vehicle, Maintenance } from "@/contexts/VehicleContext";

interface ReportPanelProps {
  vehicles: Vehicle[];
  maintenances: Maintenance[];
}

const ReportPanel: React.FC<ReportPanelProps> = ({ vehicles, maintenances }) => {
  const [reportType, setReportType] = useState<string>("status");
  const [period, setPeriod] = useState<string>("month");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Relatório</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status das Viaturas</SelectItem>
              <SelectItem value="maintenance">Manutenções Realizadas</SelectItem>
              <SelectItem value="utilization">Utilização por Período</SelectItem>
              <SelectItem value="costs">Custos e Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Período</label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="chart">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Gráfico</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 px-4">
                <BarChart2 className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Visualização de Gráfico</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Selecione as opções acima e clique em "Gerar Relatório" para ver os dados em formato de gráfico.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 px-4">
                <TrendingUp className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Visualização de Tabela</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Selecione as opções acima e clique em "Gerar Relatório" para ver os dados em formato de tabela.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Dica: O período selecionado afeta os dados mostrados no relatório.</span>
        </div>
      </div>
    </div>
  );
};

export default ReportPanel;
