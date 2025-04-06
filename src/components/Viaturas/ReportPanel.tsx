
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FileText, Download } from "lucide-react";
import { Vehicle, Maintenance } from "@/pages/Viaturas";

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ReportPanelProps {
  vehicles: Vehicle[];
  maintenances: Maintenance[];
}

const ReportPanel: React.FC<ReportPanelProps> = ({ vehicles, maintenances }) => {
  const [reportType, setReportType] = useState("fleet-status");
  const [timeFrame, setTimeFrame] = useState("monthly");
  
  // Data for fleet status pie chart
  const fleetStatusData = [
    { name: 'Em serviço', value: vehicles.filter(v => v.status === 'Em serviço').length },
    { name: 'Manutenção', value: vehicles.filter(v => v.status === 'Manutenção').length },
    { name: 'Inoperante', value: vehicles.filter(v => v.status === 'Inoperante').length },
    { name: 'Reserva', value: vehicles.filter(v => v.status === 'Reserva').length },
  ].filter(item => item.value > 0); // Only include statuses that have at least one vehicle

  // Data for maintenance costs bar chart (mock data)
  const maintenanceCostsData = [
    { month: 'Jan', preventive: 1200, corrective: 800 },
    { month: 'Fev', preventive: 900, corrective: 1700 },
    { month: 'Mar', preventive: 1500, corrective: 500 },
    { month: 'Abr', preventive: 1000, corrective: 1300 },
    { month: 'Mai', preventive: 1800, corrective: 400 },
    { month: 'Jun', preventive: 1300, corrective: 600 },
  ];

  // Generate PDF report (mock function)
  const generateReport = () => {
    console.log("Generating report:", reportType, timeFrame);
    // In a real app, this would generate a PDF or export data
    alert("Relatório gerado com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Tipo de Relatório</Label>
          <Select 
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fleet-status">Status da Frota</SelectItem>
              <SelectItem value="maintenance-costs">Custos de Manutenção</SelectItem>
              <SelectItem value="vehicle-usage">Uso de Veículos</SelectItem>
              <SelectItem value="maintenance-history">Histórico de Manutenções</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time-frame">Período</Label>
          <Select 
            value={timeFrame}
            onValueChange={setTimeFrame}
          >
            <SelectTrigger id="time-frame">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        {reportType === 'fleet-status' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Status da Frota</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fleetStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fleetStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        {reportType === 'maintenance-costs' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Custos de Manutenção</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceCostsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Custo']} />
                    <Legend />
                    <Bar dataKey="preventive" name="Preventiva" fill="#0088FE" />
                    <Bar dataKey="corrective" name="Corretiva" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        {(reportType === 'vehicle-usage' || reportType === 'maintenance-history') && (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Selecione um tipo de relatório para visualizar os dados</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={generateReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>
    </div>
  );
};

export default ReportPanel;
