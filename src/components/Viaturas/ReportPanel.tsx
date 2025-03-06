
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Vehicle, Maintenance } from "@/pages/Viaturas";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";

interface ReportPanelProps {
  vehicles: Vehicle[];
  maintenances: Maintenance[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportPanel: React.FC<ReportPanelProps> = ({ vehicles, maintenances }) => {
  const [reportType, setReportType] = useState("viatura");
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
    to: new Date().toISOString().split('T')[0] // Today
  });
  
  // Prepare data for charts
  const prepareMaintenanceByTypeData = () => {
    const filteredMaintenances = maintenances.filter(m => {
      const inDateRange = new Date(m.data) >= new Date(dateRange.from) && 
                          new Date(m.data) <= new Date(dateRange.to);
      const matchesVehicle = selectedVehicle ? m.veiculoId === selectedVehicle : true;
      return inDateRange && matchesVehicle;
    });
    
    const typeCount: Record<string, number> = {};
    
    filteredMaintenances.forEach(m => {
      typeCount[m.tipo] = (typeCount[m.tipo] || 0) + 1;
    });
    
    return Object.keys(typeCount).map(type => ({
      name: type,
      value: typeCount[type]
    }));
  };
  
  const prepareMaintenanceCostData = () => {
    const filteredMaintenances = maintenances.filter(m => {
      const inDateRange = new Date(m.data) >= new Date(dateRange.from) && 
                          new Date(m.data) <= new Date(dateRange.to);
      const matchesVehicle = selectedVehicle ? m.veiculoId === selectedVehicle : true;
      return inDateRange && matchesVehicle;
    });
    
    if (selectedVehicle) {
      // Cost over time for a single vehicle
      const costByMonth: Record<string, number> = {};
      
      filteredMaintenances.forEach(m => {
        const month = m.data.substring(0, 7); // YYYY-MM format
        costByMonth[month] = (costByMonth[month] || 0) + m.custo;
      });
      
      return Object.keys(costByMonth)
        .sort()
        .map(month => {
          const date = new Date(month);
          return {
            month: `${date.getMonth() + 1}/${date.getFullYear()}`,
            custo: costByMonth[month]
          };
        });
    } else {
      // Cost by vehicle
      const costByVehicle: Record<number, number> = {};
      
      filteredMaintenances.forEach(m => {
        costByVehicle[m.veiculoId] = (costByVehicle[m.veiculoId] || 0) + m.custo;
      });
      
      return Object.keys(costByVehicle).map(vehicleId => {
        const vehicle = vehicles.find(v => v.id === Number(vehicleId));
        return {
          placa: vehicle ? vehicle.placa : `Viatura ${vehicleId}`,
          custo: costByVehicle[Number(vehicleId)]
        };
      }).sort((a, b) => b.custo - a.custo);
    }
  };
  
  const maintenanceByTypeData = prepareMaintenanceByTypeData();
  const maintenanceCostData = prepareMaintenanceCostData();
  
  const totalCost = maintenances
    .filter(m => {
      const inDateRange = new Date(m.data) >= new Date(dateRange.from) && 
                          new Date(m.data) <= new Date(dateRange.to);
      const matchesVehicle = selectedVehicle ? m.veiculoId === selectedVehicle : true;
      return inDateRange && matchesVehicle;
    })
    .reduce((sum, m) => sum + m.custo, 0);
  
  const totalMaintenance = maintenances
    .filter(m => {
      const inDateRange = new Date(m.data) >= new Date(dateRange.from) && 
                          new Date(m.data) <= new Date(dateRange.to);
      const matchesVehicle = selectedVehicle ? m.veiculoId === selectedVehicle : true;
      return inDateRange && matchesVehicle && m.status === "Concluída";
    }).length;
  
  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    alert("Geração de relatório simulada! Em uma aplicação real, isso geraria um PDF para download.");
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-gray-50">
        <div className="space-y-2">
          <Label htmlFor="reportType">Tipo de Relatório</Label>
          <Select
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger id="reportType">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viatura">Por Viatura</SelectItem>
              <SelectItem value="geral">Relatório Geral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {reportType === "viatura" && (
          <div className="space-y-2">
            <Label htmlFor="vehicleSelect">Viatura</Label>
            <Select
              value={selectedVehicle?.toString() || ""}
              onValueChange={(value) => setSelectedVehicle(value ? Number(value) : null)}
            >
              <SelectTrigger id="vehicleSelect">
                <SelectValue placeholder="Todas as viaturas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as viaturas</SelectItem>
                {vehicles.map(v => (
                  <SelectItem key={v.id} value={v.id.toString()}>
                    {v.placa} - {v.modelo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">Data Inicial</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateTo">Data Final</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-blue-900">Total de Manutenções</h3>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-700 mt-2">{totalMaintenance}</p>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-green-900">Custo Total</h3>
            <PieChartIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-700 mt-2">R$ {totalCost.toFixed(2)}</p>
        </Card>
        
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-purple-900">Custo Médio</h3>
            <BarChartIcon className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-700 mt-2">
            R$ {totalMaintenance > 0 ? (totalCost / totalMaintenance).toFixed(2) : "0.00"}
          </p>
        </Card>
      </div>
      
      <Tabs defaultValue="tipomnt" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="tipomnt">Manutenções por Tipo</TabsTrigger>
          <TabsTrigger value="custos">Custos de Manutenção</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tipomnt" className="pt-4">
          <Card className="p-4">
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={maintenanceByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {maintenanceByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custos" className="pt-4">
          <Card className="p-4">
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={maintenanceCostData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={selectedVehicle ? "month" : "placa"} />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="custo" name="Custo" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Baixar Relatório Completo
        </Button>
      </div>
    </div>
  );
};

export default ReportPanel;
