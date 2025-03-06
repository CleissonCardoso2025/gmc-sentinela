
import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Map, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration purposes
const rotasMock = [
  {
    id: '1',
    nome: 'Rota Centro-Norte',
    descricao: 'Percorre o centro da cidade e região norte, passando por pontos comerciais importantes',
    bairros: 'Centro, Vila Norte, Jardim Primavera',
    pontoInicial: 'Praça Central',
    pontoFinal: 'Terminal Norte',
    tempoPrevisto: '90',
    prioridade: 'Alta',
    ultimoPatrulhamento: '12/06/2023'
  },
  {
    id: '2',
    nome: 'Rota Leste',
    descricao: 'Percorre a zona leste da cidade, cobrindo áreas residenciais e escolas',
    bairros: 'Jardim Leste, Vila Oriental, Parque dos Ipês',
    pontoInicial: 'UBS Leste',
    pontoFinal: 'Praça dos Ipês',
    tempoPrevisto: '60',
    prioridade: 'Normal',
    ultimoPatrulhamento: '10/06/2023'
  },
  {
    id: '3',
    nome: 'Rota Escolar',
    descricao: 'Foco em escolas e creches durante horários de entrada e saída de alunos',
    bairros: 'Centro, Jardim Educacional, Vila das Escolas',
    pontoInicial: 'E.E. Prof. Silva',
    pontoFinal: 'Creche Municipal',
    tempoPrevisto: '45',
    prioridade: 'Alta',
    ultimoPatrulhamento: '13/06/2023'
  },
  {
    id: '4',
    nome: 'Rota Comercial Sul',
    descricao: 'Abrange a área comercial da zona sul, com foco em estabelecimentos comerciais',
    bairros: 'Centro Comercial Sul, Jardim Empresarial',
    pontoInicial: 'Shopping Sul',
    pontoFinal: 'Rua do Comércio',
    tempoPrevisto: '75',
    prioridade: 'Normal',
    ultimoPatrulhamento: '09/06/2023'
  },
  {
    id: '5',
    nome: 'Rota Parques',
    descricao: 'Percorre os principais parques e áreas de lazer da cidade',
    bairros: 'Parque Municipal, Jardim das Flores, Vila Verde',
    pontoInicial: 'Parque Municipal',
    pontoFinal: 'Jardim Botânico',
    tempoPrevisto: '120',
    prioridade: 'Baixa',
    ultimoPatrulhamento: '05/06/2023'
  }
];

interface RotasListProps {
  onCreateNew: () => void;
}

const RotasList: React.FC<RotasListProps> = ({ onCreateNew }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [rotas, setRotas] = useState(rotasMock);

  const handleDeleteRota = (id: string) => {
    const rotaToDelete = rotas.find(rota => rota.id === id);
    if (rotaToDelete) {
      setRotas(rotas.filter(rota => rota.id !== id));
      toast({
        title: "Rota excluída",
        description: `A rota ${rotaToDelete.nome} foi excluída com sucesso.`,
      });
    }
  };

  const filteredRotas = rotas.filter(rota => 
    rota.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rota.bairros.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rota.prioridade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta':
        return <Badge className="bg-red-500">{prioridade}</Badge>;
      case 'Normal':
        return <Badge className="bg-blue-500">{prioridade}</Badge>;
      case 'Baixa':
        return <Badge className="bg-green-500">{prioridade}</Badge>;
      default:
        return <Badge>{prioridade}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <Input
            className="pl-10"
            placeholder="Buscar rotas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Rota
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de rotas de patrulhamento cadastradas.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Bairros</TableHead>
              <TableHead>Tempo (min)</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Último Patrulhamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRotas.length > 0 ? (
              filteredRotas.map((rota) => (
                <TableRow key={rota.id}>
                  <TableCell className="font-medium">{rota.nome}</TableCell>
                  <TableCell>{rota.bairros}</TableCell>
                  <TableCell>{rota.tempoPrevisto}</TableCell>
                  <TableCell>{getPriorityBadge(rota.prioridade)}</TableCell>
                  <TableCell>{rota.ultimoPatrulhamento}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Excluir"
                        onClick={() => handleDeleteRota(rota.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Ver no mapa">
                        <Map className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhuma rota encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RotasList;
