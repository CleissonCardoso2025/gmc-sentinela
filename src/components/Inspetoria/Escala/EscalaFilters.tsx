
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Calendar, ChevronDown, Search, ChevronsUpDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const periods = [
    { value: "semanal", label: "Semanal" },
    { value: "quinzenal", label: "Quinzenal" },
    { value: "mensal", label: "Mensal" }
  ];

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 flex-1 min-w-[280px] sm:min-w-0">
            <div className="flex items-center p-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
              <Input 
                placeholder="Buscar agente, código..." 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-between max-w-[180px] text-left font-normal",
                  "transition-all duration-200 hover:bg-primary/10 flex-shrink-0"
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

          <Select 
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <SelectTrigger className="w-[140px] transition-all duration-200">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="transition-all duration-200 hover:scale-105"
                onClick={toggleAdvancedFilters}
              >
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? "Ocultar filtros" : "Mais filtros"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setSelectedGuarnicao("todas")}>
                Todas as Guarnições
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRota("todas")}>
                Todas as Rotas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedViatura("todas")}>
                Todas as Viaturas
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setSelectedGuarnicao("todas");
                setSelectedRota("todas");
                setSelectedViatura("todas");
              }}>
                Limpar todos os filtros
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="default" 
            onClick={handleFilter}
            className="transition-all duration-200 hover:scale-105 ml-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>
        </div>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 animate-fade-in">
            <Select 
              value={selectedGuarnicao}
              onValueChange={setSelectedGuarnicao}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Guarnição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Guarnições</SelectItem>
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
                <SelectItem value="todas">Todas as Rotas</SelectItem>
                {rotas.map(r => (
                  <SelectItem key={r.id} value={r.nome}>{r.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedViatura}
              onValueChange={setSelectedViatura}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Viatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Viaturas</SelectItem>
                {viaturas.map(v => (
                  <SelectItem key={v.id} value={v.codigo}>
                    {v.codigo} ({v.modelo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscalaFilters;
