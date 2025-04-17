
import React, { useState } from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EscalaPreviewProps } from '../types';
import { 
  ArrowLeftRight, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EscalaPreview: React.FC<EscalaPreviewProps> = ({
  selectedGuarnicao,
  daysToDisplay,
  scheduleData,
  changeAgentShift,
  getShiftColor,
  getAgentSchedule,
  showFullPeriod,
  setShowFullPeriod,
  swapShiftsBetweenAgents
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedShift, setSelectedShift] = useState<{agentId: string, date: Date} | null>(null);
  const pageSize = 7;
  
  // Calculate total number of days in the schedule
  const totalDays = daysToDisplay.length;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(totalDays / pageSize);
  
  // Get current page of days to display
  const currentDaysToDisplay = showFullPeriod 
    ? daysToDisplay 
    : daysToDisplay.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  if (!selectedGuarnicao) return null;

  const handleSwapShift = (agentId: string, date: Date) => {
    if (!selectedShift) {
      // First selection
      setSelectedShift({ agentId, date });
    } else if (selectedShift.date.toDateString() === date.toDateString() && 
               selectedShift.agentId !== agentId) {
      // Second selection - swap shifts between agents
      swapShiftsBetweenAgents(selectedShift.agentId, agentId, date);
      setSelectedShift(null);
    } else {
      // Reset if clicking a different date
      setSelectedShift({ agentId, date });
    }
  };

  const agentSchedule = getAgentSchedule();
  
  if (agentSchedule.length === 0) {
    return (
      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Não há agentes na guarnição selecionada. Selecione uma guarnição com agentes para visualizar a escala.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Visualização da Escala</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-full-period" 
              checked={showFullPeriod} 
              onCheckedChange={setShowFullPeriod}
            />
            <Label htmlFor="show-full-period">
              Mostrar período completo
            </Label>
          </div>
          
          {!showFullPeriod && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                disabled={pageIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {pageIndex + 1} de {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPageIndex(Math.min(totalPages - 1, pageIndex + 1))}
                disabled={pageIndex >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Agente</TableHead>
              <TableHead className="font-medium">Função</TableHead>
              {currentDaysToDisplay.map((day, index) => (
                <TableHead key={index} className="font-medium text-center whitespace-nowrap">
                  {format(day, "dd/MM")} <br />
                  <span className="text-xs">{format(day, "EEE", { locale: ptBR })}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentSchedule.map((agent) => (
              <TableRow key={agent.agentId} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{agent.agentName}</TableCell>
                <TableCell>{agent.role}</TableCell>
                {currentDaysToDisplay.map((day, dayIndex) => {
                  // Find schedule entry for this agent and day
                  const entry = agent.schedule.find(entry => 
                    entry.date.getDate() === day.getDate() &&
                    entry.date.getMonth() === day.getMonth() &&
                    entry.date.getFullYear() === day.getFullYear()
                  );
                  
                  const isSelected = selectedShift && 
                                   selectedShift.agentId === agent.agentId && 
                                   selectedShift.date.toDateString() === day.toDateString();
                  
                  return (
                    <TableCell key={dayIndex} className="text-center">
                      {entry ? (
                        <div className="flex flex-col items-center gap-1">
                          <Badge 
                            className={`cursor-pointer hover:opacity-80 transition-opacity ${getShiftColor(entry.shift)} ${isSelected ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => changeAgentShift(
                              agent.agentId, 
                              day, 
                              entry.shift === "24h" ? "Folga" : "24h"
                            )}
                          >
                            {entry.shift}
                          </Badge>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => handleSwapShift(agent.agentId, day)}
                            title="Selecionar para troca de plantão"
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Clique nos turnos para alternar entre 24h e Folga. Use o botão <ArrowLeftRight className="inline h-3 w-3" /> para trocar plantões entre agentes.
      </p>
      {selectedShift && (
        <div className="mt-2 p-2 bg-muted rounded-md text-sm">
          Selecione outro agente na mesma data para trocar o plantão, ou clique novamente para cancelar.
        </div>
      )}
    </div>
  );
};

export default EscalaPreview;
