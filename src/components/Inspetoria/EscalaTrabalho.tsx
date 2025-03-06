
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Download, Edit, Printer, Calendar as CalendarIcon, Filter, AlertTriangle, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NovaEscala from './NovaEscala';

const EscalaTrabalho: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("semanal");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedGuarnicao, setSelectedGuarnicao] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedRota, setSelectedRota] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<number | null>(null);

  // Mock data for the schedule
  const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  
  const escalaData = [
    {
      id: 1,
      guarnicao: "Guarnição Alpha",
      supervisor: "Sgt. Roberto Silva",
      rota: "Rota Centro-Norte",
      viatura: "GCM-1234 (Spin)",
      periodo: "01/07/2024 - 30/07/2024",
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
      guarnicao: "Guarnição Alpha",
      supervisor: "Sgt. Roberto Silva",
      rota: "Rota Centro-Norte",
      viatura: "GCM-1234 (Spin)",
      periodo: "01/07/2024 - 30/07/2024",
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
      guarnicao: "Guarnição Bravo",
      supervisor: "Sgt. Marcos Oliveira",
      rota: "Rota Leste",
      viatura: "GCM-5678 (Hilux)",
      periodo: "01/07/2024 - 30/07/2024",
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
      guarnicao: "Guarnição Bravo",
      supervisor: "Sgt. Marcos Oliveira",
      rota: "Rota Leste",
      viatura: "GCM-5678 (Hilux)",
      periodo: "01/07/2024 - 30/07/2024",
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

  // Mock data for filters
  const guarnicoes = [
    { id: "1", nome: "Guarnição Alpha" },
    { id: "2", nome: "Guarnição Bravo" },
    { id: "3", nome: "Guarnição Charlie" }
  ];

  const supervisores = [
    { id: "1", nome: "Sgt. Roberto Silva" },
    { id: "2", nome: "Sgt. Marcos Oliveira" },
    { id: "3", nome: "Sgt. Pedro Costa" }
  ];

  const rotas = [
    { id: "1", nome: "Rota Centro-Norte" },
    { id: "2", nome: "Rota Leste" },
    { id: "3", nome: "Rota Escolar" }
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

  const handleFilter = () => {
    toast({
      title: "Filtro aplicado",
      description: "A escala foi filtrada com os parâmetros selecionados."
    });
  };

  const handleDeleteShift = (id: number) => {
    toast({
      title: "Turno removido",
      description: "O turno foi removido da escala."
    });
  };

  const handleSubstituteAgent = (id: number) => {
    toast({
      title: "Substituição de agente",
      description: "Selecione um agente para substituição."
    });
  };

  const handleEditSchedule = (id: number) => {
    setEditingSchedule(id);
    setIsCreateModalOpen(true);
  };

  const handleSaveSchedule = () => {
    setIsCreateModalOpen(false);
    setEditingSchedule(null);
    toast({
      title: "Escala salva",
      description: editingSchedule ? "Escala atualizada com sucesso." : "Nova escala criada com sucesso."
    });
  };

  const filteredData = escalaData.filter(item => {
    if (selectedGuarnicao && item.guarnicao !== selectedGuarnicao) return false;
    if (selectedSupervisor && item.supervisor !== selectedSupervisor) return false;
    if (selectedRota && item.rota !== selectedRota) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-2">
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
            
            <Select 
              value={selectedGuarnicao}
              onValueChange={setSelectedGuarnicao}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Guarnição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {guarnicoes.map(g => (
                  <SelectItem key={g.id} value={g.nome}>{g.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedSupervisor}
              onValueChange={setSelectedSupervisor}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Supervisor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {supervisores.map(s => (
                  <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedRota}
              onValueChange={setSelectedRota}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Rota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {rotas.map(r => (
                  <SelectItem key={r.id} value={r.nome}>{r.nome}</SelectItem>
                ))}
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
          
          <Button variant="outline" size="sm" onClick={handleFilter}>
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
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Nova Escala
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Informações da escala</h3>
            <p className="text-sm text-yellow-700 mt-1">
              As escalas seguem o turno de 24h por 72h. A guarnição, viatura e rota selecionadas ficarão 
              disponíveis para todos os guardas escalados. O supervisor do plantão tem acesso à lista completa da escala.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Guarnição</TableHead>
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
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap">{row.guarnicao}</TableCell>
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
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditSchedule(row.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Substituir agente" onClick={() => handleSubstituteAgent(row.id)}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Remover turno" onClick={() => handleDeleteShift(row.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  Nenhuma escala encontrada com os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4">
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
        
        <div className="text-sm text-gray-500">
          Exibindo {filteredData.length} de {escalaData.length} escalas
        </div>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? "Editar Escala" : "Nova Escala de Trabalho"}</DialogTitle>
            <DialogDescription>
              Crie uma escala para o período de 30 dias com turnos de 24h por 72h.
            </DialogDescription>
          </DialogHeader>
          <NovaEscala 
            onSave={handleSaveSchedule}
            onCancel={() => setIsCreateModalOpen(false)}
            editingId={editingSchedule}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscalaTrabalho;
