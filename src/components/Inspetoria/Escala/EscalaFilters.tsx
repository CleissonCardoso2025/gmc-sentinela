
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Calendar, ChevronDown } from "lucide-react";
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
import { GuarnicaoOption, RotaOption, ViaturaOption } from './types';

interface EscalaFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
  selectedGuarnicao: string;
  setSelectedGuarnicao: (value: string) => void;
  selectedRota: string;
  setSelectedRota: (value: string) => void;
  selectedViatura: string;
  setSelectedViatura: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  handleFilter: () => void;
  guarnicoes: GuarnicaoOption[];
  rotas: RotaOption[];
  viaturas: ViaturaOption[];
}

const EscalaFilters: React.FC<EscalaFiltersProps> = ({
  selectedPeriod,
  setSelectedPeriod,
  selectedGuarnicao,
  setSelectedGuarnicao,
  selectedRota,
  setSelectedRota,
  selectedViatura,
  setSelectedViatura,
  selectedDate,
  setSelectedDate,
  handleFilter,
  guarnicoes,
  rotas,
  viaturas
}) => {
  const [dateOpen, setDateOpen] = useState(false);

  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
        <div>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left font-normal",
                  "transition-all duration-200 hover:bg-primary/10"
                )}
              >
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Data inicial</span>}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
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
        
        <Select 
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        >
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Guarnição" />
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
          <SelectTrigger className="w-full">
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
      
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <Select 
          value={selectedViatura}
          onValueChange={setSelectedViatura}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Viatura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {viaturas.map(v => (
              <SelectItem key={v.id} value={v.codigo}>
                {v.codigo} ({v.modelo})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      
        <Button 
          variant="default" 
          onClick={handleFilter}
          className="transition-all duration-200 hover:scale-105 ml-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default EscalaFilters;
