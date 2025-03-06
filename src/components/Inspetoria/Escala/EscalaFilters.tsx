import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { GuarnicaoOption, RotaOption } from './types';

interface EscalaFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
  selectedGuarnicao: string;
  setSelectedGuarnicao: (value: string) => void;
  selectedRota: string;
  setSelectedRota: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  handleFilter: () => void;
  guarnicoes: GuarnicaoOption[];
  rotas: RotaOption[];
}

const EscalaFilters: React.FC<EscalaFiltersProps> = ({
  selectedPeriod,
  setSelectedPeriod,
  selectedGuarnicao,
  setSelectedGuarnicao,
  selectedRota,
  setSelectedRota,
  selectedDate,
  setSelectedDate,
  handleFilter,
  guarnicoes,
  rotas
}) => {
  const [dateOpen, setDateOpen] = useState(false);

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
          <SelectTrigger className="w-full md:w-60">
            <SelectValue placeholder="Guarnição/Supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {guarnicoes.map(g => (
              <SelectItem key={g.id} value={g.nome}>
                {g.nome} ({g.supervisor})
              </SelectItem>
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
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Selecione data inicial</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setDateOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button variant="outline" size="sm" onClick={handleFilter}>
        <Filter className="h-4 w-4 mr-2" />
        Filtrar
      </Button>
    </div>
  );
};

export default EscalaFilters;
