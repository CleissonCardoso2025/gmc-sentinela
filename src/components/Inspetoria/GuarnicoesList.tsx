
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuarnicoesListProps {
  onCreateNew: () => void;
}

const GuarnicoesList: React.FC<GuarnicoesListProps> = ({ onCreateNew }) => {
  const { toast } = useToast();

  // Mock data for garrisons
  const guarnicoes = [
    {
      id: 1,
      name: "Guarnição Centro",
      supervisor: "Sgt. Roberto Silva",
      team: ["Agente Carlos Pereira", "Agente Ana Melo", "Agente Paulo Santos"],
      status: "Ativo",
      date: "Hoje - Diurno"
    },
    {
      id: 2,
      name: "Guarnição Norte",
      supervisor: "Sgt. Marcos Oliveira",
      team: ["Agente Juliana Campos", "Agente Ricardo Alves", "Agente Fernanda Lima"],
      status: "Programado",
      date: "Hoje - Noturno"
    },
    {
      id: 3,
      name: "Guarnição Sul",
      supervisor: "Sgt. Pedro Costa",
      team: ["Agente Lucas Martins", "Agente Carla Dias", "Agente Bruno Sousa"],
      status: "Programado",
      date: "Amanhã - Diurno"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'programado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'concluído':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Guarnição removida",
      description: "A guarnição foi removida com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Users className="h-5 w-5 mr-2 text-gcm-600" />
        <h3 className="text-lg font-medium">Guarnições do Dia</h3>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Nome</TableHead>
              <TableHead className="font-medium">Data/Período</TableHead>
              <TableHead className="font-medium">Supervisor</TableHead>
              <TableHead className="font-medium">Equipe</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guarnicoes.map((guarnicao) => (
              <TableRow key={guarnicao.id}>
                <TableCell>{guarnicao.name}</TableCell>
                <TableCell>{guarnicao.date}</TableCell>
                <TableCell>{guarnicao.supervisor}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {guarnicao.team.map((member, index) => (
                      <span key={index} className="text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(guarnicao.status)}>
                    {guarnicao.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(guarnicao.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GuarnicoesList;
