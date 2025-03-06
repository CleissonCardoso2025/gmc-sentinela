
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuarnicaoOption, SupervisorOption, RotaOption } from './types';

interface EscalaFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
  selectedGuarnicao: string;
  setSelectedGuarnicao: (value: string) => void;
  selectedSupervisor: string;
  setSelectedSupervisor: (value: string) => void;
  selectedRota: string;
  setSelectedRota: (value: string) => void;
  selectedWeek: string;
  setSelectedWeek: (value: string) => void;
  handleFilter: () => void;
  guarnicoes: GuarnicaoOption[];
  supervisores: SupervisorOption[];
  rotas: RotaOption[];
}

const EscalaFilters: React.FC<EscalaFiltersProps> = ({
  selectedPeriod,
  setSelectedPeriod,
  selectedGuarnicao,
  setSelectedGuarnicao,
  selectedSupervisor,
  setSelectedSupervisor,
  selectedRota,
  setSelectedRota,
  selectedWeek,
  setSelectedWeek,
  handleFilter,
  guarnicoes,
  supervisores,
  rotas
}) => {
  return (
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
            <SelectItem value="todas">Todas</SelectItem>
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
            <SelectItem value="todos">Todos</SelectItem>
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
            <SelectItem value="todas">Todas</SelectItem>
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
  );
};

export default EscalaFilters;
