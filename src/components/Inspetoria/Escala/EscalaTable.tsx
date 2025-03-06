
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
import { Edit, UserPlus, Trash2, Shield, User, Car } from "lucide-react";

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

interface GroupedEscalaRow {
  guarnicao: string;
  supervisor: string;
  rota: string;
  viatura: string;
  periodo: string;
  agents: {
    id: number;
    name: string;
    role: string;
    schedule: ScheduleDay[];
  }[];
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
  // Group data by guarnicao for better organization
  const groupedData: GroupedEscalaRow[] = [];
  
  filteredData.forEach(row => {
    let group = groupedData.find(g => g.guarnicao === row.guarnicao);
    
    if (!group) {
      group = {
        guarnicao: row.guarnicao,
        supervisor: row.supervisor,
        rota: row.rota,
        viatura: row.viatura,
        periodo: row.periodo,
        agents: []
      };
      groupedData.push(group);
    }
    
    group.agents.push({
      id: row.id,
      name: row.agent,
      role: row.role,
      schedule: row.schedule
    });
  });

  return (
    <div className="rounded-md border overflow-x-auto animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Guarnição/Supervisor</TableHead>
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
          {groupedData.length > 0 ? (
            groupedData.map((group, groupIndex) => (
              <React.Fragment key={group.guarnicao}>
                {group.agents.map((agent, agentIndex) => (
                  <TableRow 
                    key={agent.id} 
                    className={`
                      ${agentIndex === 0 ? 'border-t-2 border-t-primary/20' : ''}
                      transition-colors duration-200 hover:bg-muted/30
                    `}
                    style={{
                      animationDelay: `${(groupIndex * 100) + (agentIndex * 50)}ms`
                    }}
                  >
                    {agentIndex === 0 ? (
                      <TableCell rowSpan={group.agents.length} className="whitespace-nowrap bg-muted/30 align-top">
                        <div className="font-medium">{group.guarnicao}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Shield className="h-3 w-3 mr-1" />
                          {group.supervisor}
                        </div>
                        <div className="text-xs text-muted-foreground mt-3">
                          <div>Rota: {group.rota}</div>
                          <div className="flex items-center mt-1">
                            <Car className="h-3 w-3 mr-1" />
                            {group.viatura}
                          </div>
                          <div className="mt-1">Período: {group.periodo}</div>
                        </div>
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {agent.name}
                      </div>
                    </TableCell>
                    <TableCell>{agent.role}</TableCell>
                    {agent.schedule.map((day, index) => (
                      <TableCell key={index} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs">{day.shift}</span>
                          <Badge 
                            className={`transition-all duration-200 hover:scale-105 ${getStatusColor(day.status)}`}
                          >
                            {day.status}
                          </Badge>
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Editar" 
                          onClick={() => onEditSchedule(agent.id)}
                          className="transition-all duration-200 hover:bg-primary/10 hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Substituir agente" 
                          onClick={() => onSubstituteAgent(agent.id)}
                          className="transition-all duration-200 hover:bg-primary/10 hover:scale-105"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Remover turno" 
                          onClick={() => onDeleteShift(agent.id)}
                          className="transition-all duration-200 hover:bg-primary/10 hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
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
