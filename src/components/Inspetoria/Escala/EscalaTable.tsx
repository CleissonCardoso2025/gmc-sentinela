
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, UserPlus, Trash2 } from "lucide-react";

interface ScheduleDay {
  day: string;
  shift: string;
  status: string;
}

interface EscalaRow {
  id: number;
  guarnicao: string;
  supervisor: string;
  rota: string;
  viatura: string;
  periodo: string;
  agent: string;
  role: string;
  schedule: ScheduleDay[];
}

interface EscalaTableProps {
  weekDays: string[];
  filteredData: EscalaRow[];
  onEditSchedule: (id: number) => void;
  onSubstituteAgent: (id: number) => void;
  onDeleteShift: (id: number) => void;
  getStatusColor: (status: string) => string;
}

const EscalaTable: React.FC<EscalaTableProps> = ({
  weekDays,
  filteredData,
  onEditSchedule,
  onSubstituteAgent,
  onDeleteShift,
  getStatusColor
}) => {
  return (
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
                    <Button variant="ghost" size="icon" title="Editar" onClick={() => onEditSchedule(row.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Substituir agente" onClick={() => onSubstituteAgent(row.id)}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Remover turno" onClick={() => onDeleteShift(row.id)}>
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
  );
};

export default EscalaTable;
