
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, addDays } from "date-fns";
import { Calendar, Shuffle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface NovaEscalaProps {
  onSave: () => void;
  onCancel: () => void;
  editingId?: number | null;
}

// Mock data
const guarnicoes = [
  { 
    id: "1", 
    nome: "Guarnição Alpha",
    membros: [
      { id: "1", nome: "Sgt. Roberto Silva", funcao: "Supervisor" },
      { id: "2", nome: "Agente Carlos Pereira", funcao: "Agente" },
      { id: "3", nome: "Agente Ana Melo", funcao: "Agente" },
      { id: "4", nome: "Agente Paulo Santos", funcao: "Agente" }
    ]
  },
  { 
    id: "2", 
    nome: "Guarnição Bravo", 
    membros: [
      { id: "5", nome: "Sgt. Marcos Oliveira", funcao: "Supervisor" },
      { id: "6", nome: "Agente Juliana Campos", funcao: "Agente" },
      { id: "7", nome: "Agente Ricardo Alves", funcao: "Agente" },
      { id: "8", nome: "Agente Fernanda Lima", funcao: "Agente" }
    ]
  },
  { 
    id: "3", 
    nome: "Guarnição Charlie", 
    membros: [
      { id: "9", nome: "Sgt. Pedro Costa", funcao: "Supervisor" },
      { id: "10", nome: "Agente Lucas Martins", funcao: "Agente" },
      { id: "11", nome: "Agente Carla Dias", funcao: "Agente" },
      { id: "12", nome: "Agente Bruno Sousa", funcao: "Agente" }
    ]
  }
];

const viaturas = [
  { id: "1", codigo: "GCM-1234", modelo: "Spin" },
  { id: "2", codigo: "GCM-5678", modelo: "Hilux" },
  { id: "3", codigo: "GCM-9012", modelo: "Duster" }
];

const rotas = [
  { id: "1", nome: "Rota Centro-Norte" },
  { id: "2", nome: "Rota Leste" },
  { id: "3", nome: "Rota Escolar" }
];

// Function to generate dates for 30 days
const generate30DaysFromDate = (startDate: Date) => {
  const days = [];
  for (let i = 0; i < 30; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
};

interface ScheduleEntry {
  date: Date;
  agentId: string;
  shift: "24h" | "Folga";
  supervisor?: boolean;
}

const NovaEscala: React.FC<NovaEscalaProps> = ({ onSave, onCancel, editingId }) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedGuarnicaoId, setSelectedGuarnicaoId] = useState("");
  const [selectedGuarnicao, setSelectedGuarnicao] = useState<any>(null);
  const [selectedViaturaId, setSelectedViaturaId] = useState("");
  const [selectedRotaId, setSelectedRotaId] = useState("");
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [startDateOpen, setStartDateOpen] = useState(false);

  // Get selected guarnicao objects
  useEffect(() => {
    if (selectedGuarnicaoId) {
      const guarnicao = guarnicoes.find(g => g.id === selectedGuarnicaoId);
      setSelectedGuarnicao(guarnicao);
    } else {
      setSelectedGuarnicao(null);
    }
  }, [selectedGuarnicaoId]);

  // Initialize schedule with empty data
  useEffect(() => {
    if (selectedGuarnicao) {
      createEmptySchedule();
    }
  }, [selectedGuarnicao, startDate]);

  const createEmptySchedule = () => {
    if (!selectedGuarnicao) return;
    
    const newSchedule: ScheduleEntry[] = [];
    const days = generate30DaysFromDate(startDate);
    
    selectedGuarnicao.membros.forEach(membro => {
      days.forEach(day => {
        newSchedule.push({
          date: day,
          agentId: membro.id,
          shift: "Folga",
          supervisor: membro.funcao === "Supervisor"
        });
      });
    });
    
    setScheduleData(newSchedule);
  };

  const handleSortSchedule = () => {
    if (!selectedGuarnicao) {
      toast({
        title: "Selecione uma guarnição",
        description: "Você precisa selecionar uma guarnição antes de sortear a escala.",
        variant: "destructive"
      });
      return;
    }

    // Implementation of 24h/72h shift scheduling algorithm
    const newSchedule = [...scheduleData];
    const days = generate30DaysFromDate(startDate);
    const agents = selectedGuarnicao.membros;
    
    // Reset all to folga first
    newSchedule.forEach(entry => {
      entry.shift = "Folga";
    });
    
    // For each agent, start assigning 24h shifts with 72h gaps
    agents.forEach((agent, agentIndex) => {
      // Each agent starts at a different day (offset by agentIndex)
      const startOffset = agentIndex % 4;
      
      for (let i = startOffset; i < 30; i += 4) {
        const day = days[i];
        
        // Find entry for this agent and day
        const entryIndex = newSchedule.findIndex(
          entry => entry.agentId === agent.id && 
                  entry.date.getDate() === day.getDate() &&
                  entry.date.getMonth() === day.getMonth()
        );
        
        if (entryIndex !== -1) {
          newSchedule[entryIndex].shift = "24h";
        }
      }
    });
    
    setScheduleData(newSchedule);
    
    toast({
      title: "Escala sorteada",
      description: "A escala de 24h/72h foi distribuída automaticamente."
    });
  };

  const getAgentById = (id: string) => {
    for (const guarnicao of guarnicoes) {
      const agent = guarnicao.membros.find(m => m.id === id);
      if (agent) return agent;
    }
    return null;
  };

  const changeAgentShift = (agentId: string, date: Date, newShift: "24h" | "Folga") => {
    setScheduleData(prev => 
      prev.map(entry => {
        if (entry.agentId === agentId && 
            entry.date.getDate() === date.getDate() &&
            entry.date.getMonth() === date.getMonth()) {
          return { ...entry, shift: newShift };
        }
        return entry;
      })
    );
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case '24h':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Folga':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Group schedule data by agent for display
  const getAgentSchedule = () => {
    if (!selectedGuarnicao) return [];
    
    const result = [];
    for (const membro of selectedGuarnicao.membros) {
      const agentEntries = scheduleData.filter(entry => entry.agentId === membro.id);
      result.push({
        agentId: membro.id,
        agentName: membro.nome,
        role: membro.funcao,
        schedule: agentEntries.sort((a, b) => a.date.getTime() - b.date.getTime())
      });
    }
    return result;
  };

  // Calculate days to display (first 7 for preview)
  const daysToDisplay = generate30DaysFromDate(startDate).slice(0, 7);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Selecione o Período</CardTitle>
            <CardDescription>Defina o período inicial da escala</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateInput">Data de Início</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          setStartDateOpen(false);
                        }
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground mt-1">
                  A escala será gerada para 30 dias a partir desta data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Selecione os Recursos</CardTitle>
            <CardDescription>Guarnição, viatura e rota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="guarnicao">Guarnição</Label>
                <Select 
                  value={selectedGuarnicaoId}
                  onValueChange={setSelectedGuarnicaoId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma guarnição" />
                  </SelectTrigger>
                  <SelectContent>
                    {guarnicoes.map(guarnicao => (
                      <SelectItem key={guarnicao.id} value={guarnicao.id}>
                        {guarnicao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="viatura">Viatura</Label>
                <Select 
                  value={selectedViaturaId}
                  onValueChange={setSelectedViaturaId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma viatura" />
                  </SelectTrigger>
                  <SelectContent>
                    {viaturas.map(viatura => (
                      <SelectItem key={viatura.id} value={viatura.id}>
                        {viatura.codigo} ({viatura.modelo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rota">Rota de Patrulhamento</Label>
                <Select 
                  value={selectedRotaId}
                  onValueChange={setSelectedRotaId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma rota" />
                  </SelectTrigger>
                  <SelectContent>
                    {rotas.map(rota => (
                      <SelectItem key={rota.id} value={rota.id}>
                        {rota.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Distribua os Turnos</CardTitle>
            <CardDescription>Distribuição automática 24h/72h</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                  <p className="text-xs text-yellow-700">
                    Ao sortear, o sistema distribuirá automaticamente os turnos no padrão 24h de trabalho seguido por 72h de folga.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleSortSchedule} 
                className="w-full"
                disabled={!selectedGuarnicao}
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Sortear Escala
              </Button>
              
              <p className="text-xs text-muted-foreground mt-1">
                Você poderá ajustar manualmente os turnos após o sorteio.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedGuarnicao && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Visualização da Escala (Primeiros 7 dias)</h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Agente</TableHead>
                  <TableHead className="font-medium">Função</TableHead>
                  {daysToDisplay.map((day, index) => (
                    <TableHead key={index} className="font-medium text-center whitespace-nowrap">
                      {format(day, "dd/MM")} <br />
                      <span className="text-xs">{format(day, "EEE", { locale: require('date-fns/locale/pt-BR') })}</span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAgentSchedule().map((agent) => (
                  <TableRow key={agent.agentId}>
                    <TableCell>{agent.agentName}</TableCell>
                    <TableCell>{agent.role}</TableCell>
                    {agent.schedule.slice(0, 7).map((day, index) => (
                      <TableCell key={index} className="text-center">
                        <Badge 
                          className={`cursor-pointer ${getShiftColor(day.shift)}`}
                          onClick={() => changeAgentShift(
                            agent.agentId, 
                            day.date, 
                            day.shift === "24h" ? "Folga" : "24h"
                          )}
                        >
                          {day.shift}
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Clique nos turnos para alternar entre 24h e Folga. Visualização limitada aos primeiros 7 dias.
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button 
          onClick={onSave}
          disabled={!selectedGuarnicao || !selectedViaturaId || !selectedRotaId}
        >
          Salvar Escala
        </Button>
      </div>
    </div>
  );
};

export default NovaEscala;
