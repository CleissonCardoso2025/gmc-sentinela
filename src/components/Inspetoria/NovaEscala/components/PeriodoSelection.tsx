
import React from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PeriodoSelectionProps } from '../types';

const PeriodoSelection: React.FC<PeriodoSelectionProps> = ({
  startDate,
  setStartDate,
  startDateOpen,
  setStartDateOpen,
  periodoDuration,
  setPeriodoDuration
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">1. Selecione o Período</CardTitle>
        <CardDescription>Defina o período inicial e duração da escala</CardDescription>
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
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="periodoSelect">Duração da Escala</Label>
            <Select value={periodoDuration} onValueChange={setPeriodoDuration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="15">15 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              A escala será gerada para {periodoDuration} dias a partir da data inicial
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodoSelection;
