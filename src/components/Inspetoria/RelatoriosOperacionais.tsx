
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Printer, Download, BarChart2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EscalaItem } from './Escala/types';

const RelatoriosOperacionais: React.FC = () => {
  const [reportType, setReportType] = useState<string>('escalas');
  const [escalaItems, setEscalaItems] = useState<EscalaItem[]>([]);
  const [guarnicoesStats, setGuarnicoesStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEscalaData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('escala_items')  // Use 'escala_items' instead of 'escala'
          .select('*');
          
        if (error) throw error;
        
        // Convert JSON data to ScheduleDay array
        const transformedData = data.map(item => ({
          ...item,
          schedule: Array.isArray(item.schedule) ? item.schedule.map((scheduleItem: any) => ({
            day: scheduleItem.day || '',
            shift: scheduleItem.shift || '',
            status: scheduleItem.status || ''
          })) : []
        }));
        
        setEscalaItems(transformedData);
        
        // Calculate statistics for each guarnição
        const stats = calculateGuarnicaoStats(transformedData);
        setGuarnicoesStats(stats);
      } catch (error) {
        console.error("Error fetching escala data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados das escalas.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEscalaData();
  }, [toast]);

  const calculateGuarnicaoStats = (data: EscalaItem[]): any[] => {
    const guarnicoesMap = new Map();
    
    data.forEach(item => {
      if (!guarnicoesMap.has(item.guarnicao)) {
        guarnicoesMap.set(item.guarnicao, {
          guarnicao: item.guarnicao,
          supervisor: item.supervisor,
          agentCount: 0,
          totalShifts: 0,
          completedShifts: 0,
          pendingShifts: 0
        });
      }
      
      const stats = guarnicoesMap.get(item.guarnicao);
      stats.agentCount += 1;
      
      if (Array.isArray(item.schedule)) {
        item.schedule.forEach((day: any) => {
          stats.totalShifts += 1;
          if (day.status === 'Completo') {
            stats.completedShifts += 1;
          } else if (day.status === 'Pendente') {
            stats.pendingShifts += 1;
          }
        });
      }
    });
    
    return Array.from(guarnicoesMap.values());
  };

  const renderReport = () => {
    switch (reportType) {
      case 'escalas':
        return renderEscalasReport();
      case 'estatisticas':
        return renderEstatisticasReport();
      default:
        return (
          <div className="text-center py-10">
            <p>Selecione um tipo de relatório para visualizar</p>
          </div>
        );
    }
  };

  const renderEscalasReport = () => {
    return (
      <Table>
        <TableCaption>Relatório de Escalas de Trabalho</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Guarnição</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Agente</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escalaItems.length > 0 ? (
            escalaItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.guarnicao}</TableCell>
                <TableCell>{item.supervisor}</TableCell>
                <TableCell>{item.agent}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.periodo}</TableCell>
                <TableCell>
                  {Array.isArray(item.schedule) && item.schedule.length > 0 
                    ? `${item.schedule.filter((day: any) => day.status === 'Completo').length} / ${item.schedule.length} dias completos` 
                    : 'Sem dados'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Nenhum dado de escala encontrado</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const renderEstatisticasReport = () => {
    return (
      <div>
        <Table>
          <TableCaption>Estatísticas por Guarnição</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Guarnição</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Agentes</TableHead>
              <TableHead>Turnos Completos</TableHead>
              <TableHead>Turnos Pendentes</TableHead>
              <TableHead>Taxa de Conclusão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guarnicoesStats.length > 0 ? (
              guarnicoesStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.guarnicao}</TableCell>
                  <TableCell>{stat.supervisor}</TableCell>
                  <TableCell>{stat.agentCount}</TableCell>
                  <TableCell>{stat.completedShifts}</TableCell>
                  <TableCell>{stat.pendingShifts}</TableCell>
                  <TableCell>
                    {stat.totalShifts > 0 
                      ? `${Math.round((stat.completedShifts / stat.totalShifts) * 100)}%` 
                      : '0%'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Nenhum dado estatístico encontrado</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "";
    
    if (reportType === 'escalas') {
      // Header
      csvContent = "Guarnição,Supervisor,Agente,Função,Período,Status\n";
      
      // Rows
      escalaItems.forEach(item => {
        const statusText = Array.isArray(item.schedule) && item.schedule.length > 0 
          ? `${item.schedule.filter((day: any) => day.status === 'Completo').length} / ${item.schedule.length} dias completos` 
          : 'Sem dados';
          
        csvContent += `"${item.guarnicao}","${item.supervisor}","${item.agent}","${item.role}","${item.periodo}","${statusText}"\n`;
      });
    } else {
      // Header
      csvContent = "Guarnição,Supervisor,Agentes,Turnos Completos,Turnos Pendentes,Taxa de Conclusão\n";
      
      // Rows
      guarnicoesStats.forEach(stat => {
        const completionRate = stat.totalShifts > 0 
          ? `${Math.round((stat.completedShifts / stat.totalShifts) * 100)}%` 
          : '0%';
          
        csvContent += `"${stat.guarnicao}","${stat.supervisor}","${stat.agentCount}","${stat.completedShifts}","${stat.pendingShifts}","${completionRate}"\n`;
      });
    }
    
    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Label htmlFor="report-type" className="block mb-2">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="escalas">Escalas de Trabalho</SelectItem>
                  <SelectItem value="estatisticas">Estatísticas por Guarnição</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              {reportType === 'escalas' ? (
                <>
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Relatório de Escalas de Trabalho
                </>
              ) : (
                <>
                  <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                  Estatísticas por Guarnição
                </>
              )}
            </h3>
            
            {isLoading ? (
              <div className="py-10 text-center">
                <p>Carregando dados...</p>
              </div>
            ) : (
              renderReport()
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosOperacionais;
