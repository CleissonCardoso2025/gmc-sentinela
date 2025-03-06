
import React from 'react';
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EscalaPreviewProps } from '../types';

const EscalaPreview: React.FC<EscalaPreviewProps> = ({
  selectedGuarnicao,
  daysToDisplay,
  scheduleData,
  changeAgentShift,
  getShiftColor,
  getAgentSchedule
}) => {
  if (!selectedGuarnicao) return null;

  return (
    <div className="mt-8 animate-fade-in">
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
              <TableRow key={agent.agentId} className="hover:bg-muted/30 transition-colors">
                <TableCell>{agent.agentName}</TableCell>
                <TableCell>{agent.role}</TableCell>
                {agent.schedule.slice(0, 7).map((day: any, index: number) => (
                  <TableCell key={index} className="text-center">
                    <Badge 
                      className={`cursor-pointer hover:opacity-80 transition-opacity ${getShiftColor(day.shift)}`}
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
  );
};

export default EscalaPreview;
