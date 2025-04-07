
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  FileText, 
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DetalhesInvestigacao } from './DetalhesInvestigacao';

// Dados mockados para demonstração
const sindicancias = [
  {
    id: 'SIN-1234',
    dataAbertura: '10/08/2023',
    investigado: 'Carlos Eduardo Silva',
    motivo: 'Desvio de conduta durante abordagem',
    status: 'Em andamento',
    etapaAtual: 'Coleta de Testemunhos',
  },
  {
    id: 'SIN-1235',
    dataAbertura: '15/09/2023',
    investigado: 'Roberto Almeida',
    motivo: 'Uso indevido de viatura',
    status: 'Em andamento',
    etapaAtual: 'Investigação Inicial',
  },
  {
    id: 'SIN-1236',
    dataAbertura: '22/07/2023',
    investigado: 'Ana Paula Ferreira',
    motivo: 'Abandono de posto',
    status: 'Concluída',
    etapaAtual: 'Parecer Final',
  },
  {
    id: 'SIN-1237',
    dataAbertura: '05/10/2023',
    investigado: 'Paulo Roberto Santos',
    motivo: 'Desvio de equipamento',
    status: 'Arquivada',
    etapaAtual: 'Análise dos Fatos',
  },
];

export function InvestigacaoList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestigacao, setSelectedInvestigacao] = useState<any>(null);
  
  const filteredSindicancias = sindicancias.filter(sindicancia => 
    sindicancia.investigado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sindicancia.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sindicancia.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return <Badge className="bg-amber-500">Em andamento</Badge>;
      case 'Concluída':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'Arquivada':
        return <Badge className="bg-gray-500">Arquivada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por investigado, número ou motivo da sindicância..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Relatório
          </Button>
        </div>
      </div>
      
      <Table>
        <TableCaption>Lista de sindicâncias registradas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Data de Abertura</TableHead>
            <TableHead>Investigado</TableHead>
            <TableHead className="hidden md:table-cell">Motivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Etapa Atual</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSindicancias.map((sindicancia) => (
            <TableRow key={sindicancia.id}>
              <TableCell className="font-medium">{sindicancia.id}</TableCell>
              <TableCell>{sindicancia.dataAbertura}</TableCell>
              <TableCell>{sindicancia.investigado}</TableCell>
              <TableCell className="hidden md:table-cell max-w-[250px] truncate">
                {sindicancia.motivo}
              </TableCell>
              <TableCell>{getStatusBadge(sindicancia.status)}</TableCell>
              <TableCell>{sindicancia.etapaAtual}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedInvestigacao(sindicancia)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedInvestigacao && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Sindicância {selectedInvestigacao.id}</DialogTitle>
                          <DialogDescription>
                            Detalhes completos da sindicância e passo a passo da apuração
                          </DialogDescription>
                        </DialogHeader>
                        <DetalhesInvestigacao sindicancia={selectedInvestigacao} />
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
          {filteredSindicancias.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                Nenhuma sindicância encontrada com os termos de busca informados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
