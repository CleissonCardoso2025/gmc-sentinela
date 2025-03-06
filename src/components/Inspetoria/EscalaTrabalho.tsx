
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Download, Edit, Printer, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EscalaTrabalho: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("semanal");
  const [selectedWeek, setSelectedWeek] = useState("");

  // Mock data for the schedule
  const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  
  const escalaData = [
    {
      id: 1,
      agent: "Sgt. Roberto Silva",
      role: "Supervisor",
      schedule: [
        { day: "Segunda", shift: "Diurno", status: "presente" },
        { day: "Terça", shift: "Diurno", status: "presente" },
        { day: "Quarta", shift: "Folga", status: "folga" },
        { day: "Quinta", shift: "Diurno", status: "presente" },
        { day: "Sexta", shift: "Diurno", status: "presente" },
        { day: "Sábado", shift: "Folga", status: "folga" },
        { day: "Domingo", shift: "Folga", status: "folga" },
      ]
    },
    {
      id: 2,
      agent: "Agente Carlos Pereira",
      role: "Agente",
      schedule: [
        { day: "Segunda", shift: "Diurno", status: "presente" },
        { day: "Terça", shift: "Diurno", status: "presente" },
        { day: "Quarta", shift: "Diurno", status: "presente" },
        { day: "Quinta", shift: "Folga", status: "folga" },
        { day: "Sexta", shift: "Folga", status: "folga" },
        { day: "Sábado", shift: "Noturno", status: "presente" },
        { day: "Domingo", shift: "Noturno", status: "presente" },
      ]
    },
    {
      id: 3,
      agent: "Agente Ana Melo",
      role: "Agente",
      schedule: [
        { day: "Segunda", shift: "Noturno", status: "presente" },
        { day: "Terça", shift: "Noturno", status: "presente" },
        { day: "Quarta", shift: "Folga", status: "folga" },
        { day: "Quinta", shift: "Folga", status: "folga" },
        { day: "Sexta", shift: "Noturno", status: "presente" },
        { day: "Sábado", shift: "Noturno", status: "presente" },
        { day: "Domingo", shift: "Noturno", status: "presente" },
      ]
    },
    {
      id: 4,
      agent: "Agente Paulo Santos",
      role: "Agente",
      schedule: [
        { day: "Segunda", shift: "Folga", status: "folga" },
        { day: "Terça", shift: "Folga", status: "folga" },
        { day: "Quarta", shift: "Diurno", status: "licença" },
        { day: "Quinta", shift: "Diurno", status: "licença" },
        { day: "Sexta", shift: "Diurno", status: "licença" },
        { day: "Sábado", shift: "Diurno", status: "presente" },
        { day: "Domingo", shift: "Diurno", status: "presente" },
      ]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'presente':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'folga':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'licença':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'falta':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "A escala de trabalho está sendo exportada para PDF."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Imprimindo",
      description: "A escala de trabalho está sendo enviada para impressão."
    });
  };

  const handleCreateSchedule = () => {
    toast({
      title: "Criar nova escala",
      description: "Abrindo formulário para criação de uma nova escala de trabalho."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center w-full md:w-auto">
            <Select 
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="quinzenal">Quinzenal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center w-full md:w-auto">
            <Input 
              type="week" 
              className="w-full md:w-auto"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button size="sm" onClick={handleCreateSchedule}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Nova Escala
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Agente</TableHead>
              <TableHead className="font-medium">Função</TableHead>
              {weekDays.map((day) => (
                <TableHead key={day} className="font-medium text-center">
                  {day}
                </TableHead>
              ))}
              <TableHead className="font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escalaData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.agent}</TableCell>
                <TableCell>{row.role}</TableCell>
                {row.schedule.map((day, index) => (
                  <TableCell key={index} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs">{day.shift}</span>
                      <Badge className={getStatusColor(day.status)}>
                        {day.status}
                      </Badge>
                    </div>
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Presente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Folga</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Licença</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Falta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscalaTrabalho;
