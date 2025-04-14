import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScheduleDay } from "@/types/database";

const RelatoriosOperacionais: React.FC = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [escalaData, setEscalaData] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEscalaData = async () => {
      try {
        const { data, error } = await supabase
          .from('escala')
          .select('*')
          .gte('created_at', date?.from?.toISOString() || new Date(new Date().getFullYear(), 0, 1).toISOString())
          .lte('created_at', date?.to?.toISOString() || new Date().toISOString());
        
        if (error) {
          throw new Error(error.message);
        }
        
        setEscalaData(data || []);
      } catch (error: any) {
        console.error("Error fetching escala data:", error.message);
        toast({
          title: "Erro ao carregar dados da escala",
          description: "Não foi possível obter os dados da escala de trabalho.",
          variant: "destructive"
        });
      }
    };
    
    fetchEscalaData();
  }, [date, toast]);

  const downloadRelatorio = () => {
    if (!date?.from || !date?.to) {
      toast({
        title: "Datas inválidas",
        description: "Por favor, selecione um período válido para gerar o relatório.",
        variant: "destructive"
      });
      return;
    }

    const startDate = format(date.from, "dd/MM/yyyy", { locale: ptBR });
    const endDate = format(date.to, "dd/MM/yyyy", { locale: ptBR });

    // Calculate total de agentes por dia e turno
    const agentesPorDiaTurno = escalaData.reduce((acc, escala) => {
      if (!escala.schedule || !Array.isArray(escala.schedule)) {
        console.warn(`Invalid schedule data for escala item ${escala.id}`);
        return acc;
      }
      
      escala.schedule.forEach(dia => {
        const key = `${dia.day}-${dia.shift}`;
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    }, {});

    // Calculate total de horas trabalhadas por período
    const totalHorasPorPeriodo = escalaData.reduce((acc, escala) => {
      if (!escala.schedule || !Array.isArray(escala.schedule)) {
        console.warn(`Invalid schedule data for escala item ${escala.id}`);
        return acc;
      }

      escala.schedule.forEach(dia => {
        const key = dia.shift;
        const horas = key === 'Manhã' ? 8 : 12; // Assumindo turnos de 8h ou 12h
        acc[key] = (acc[key] || 0) + horas;
      });
      return acc;
    }, {});

    // Calculate turnos manhã e noite
    const turnosManha = (escalaData[0]?.schedule as any) as ScheduleDay[];
    const turnosNoite = (escalaData[0]?.schedule as any) as ScheduleDay[];

    // Calculate total de ocorrências por tipo
    const totalOcorrenciasPorTipo = escalaData.reduce((acc, escala) => {
      const tipo = escala.tipo || 'Não especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    // Calculate total de rotas percorridas
    const totalRotasPercorridas = escalaData.length;

    // Create the content for the report
    let content = `Relatório Operacional\nPeríodo: ${startDate} - ${endDate}\n\n`;
    content += "--- Estatísticas Gerais ---\n";
    content += `Total de agentes em serviço por dia/turno:\n${JSON.stringify(agentesPorDiaTurno, null, 2)}\n\n`;
    content += `Total de horas trabalhadas por período:\n${JSON.stringify(totalHorasPorPeriodo, null, 2)}\n\n`;
    content += `Total de ocorrências por tipo:\n${JSON.stringify(totalOcorrenciasPorTipo, null, 2)}\n\n`;
    content += `Total de rotas percorridas: ${totalRotasPercorridas}\n\n`;
    content += "--- Detalhes da Escala ---\n";
    escalaData.forEach((escala, index) => {
      content += `Escala ${index + 1}:\n`;
      content += `  Guarnição: ${escala.guarnicao}\n`;
      content += `  Supervisor: ${escala.supervisor}\n`;
      content += `  Rota: ${escala.rota}\n`;
      content += `  Viatura: ${escala.viatura}\n`;
      content += `  Período: ${escala.periodo}\n`;
      content += `  Agente: ${escala.agent}\n`;
      content += `  Função: ${escala.role}\n`;
      content += `  Turnos Manhã: ${JSON.stringify(turnosManha, null, 2)}\n`;
      content += `  Turnos Noite: ${JSON.stringify(turnosNoite, null, 2)}\n`;
      content += `  Data de Criação: ${format(new Date(escala.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}\n`;
      content += `  Data de Atualização: ${format(new Date(escala.updated_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}\n`;
      content += "\n";
    });

    // Create a Blob from the content
    const blob = new Blob([content], { type: 'text/plain' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');

    // Set the link's href to the Blob URL
    link.href = url;

    // Set the link's download attribute
    link.download = `relatorio_operacional_${startDate}_${endDate}.txt`;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório gerado",
      description: "O relatório operacional foi gerado com sucesso e está pronto para download."
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold">Gerar Relatório Operacional</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="date">Período</Label>
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              className={cn("border rounded-md")}
            />
          </div>
          <Button onClick={downloadRelatorio}>
            <Download className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatoriosOperacionais;
