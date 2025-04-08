
import React, { useState, useEffect } from 'react';
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
import { Investigacao } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function InvestigacaoList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestigacao, setSelectedInvestigacao] = useState<Investigacao | null>(null);
  const [investigacoes, setInvestigacoes] = useState<Investigacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch investigacoes on component mount
  useEffect(() => {
    fetchInvestigacoes();
  }, []);

  const fetchInvestigacoes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('investigacoes')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      setInvestigacoes(data as Investigacao[]);
    } catch (error) {
      console.error('Error fetching investigacoes:', error);
      toast.error('Não foi possível carregar as sindicâncias');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredInvestigacoes = investigacoes.filter(investigacao => 
    investigacao.investigado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investigacao.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investigacao.motivo.toLowerCase().includes(searchTerm.toLowerCase())
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
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-64" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : filteredInvestigacoes.length > 0 ? (
            filteredInvestigacoes.map((investigacao) => (
              <TableRow key={investigacao.id}>
                <TableCell className="font-medium">{investigacao.numero}</TableCell>
                <TableCell>{investigacao.dataAbertura}</TableCell>
                <TableCell>{investigacao.investigado}</TableCell>
                <TableCell className="hidden md:table-cell max-w-[250px] truncate">
                  {investigacao.motivo}
                </TableCell>
                <TableCell>{getStatusBadge(investigacao.status)}</TableCell>
                <TableCell>{investigacao.etapaAtual}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedInvestigacao(investigacao)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      {selectedInvestigacao && (
                        <>
                          <DialogHeader>
                            <DialogTitle>Sindicância {selectedInvestigacao.numero}</DialogTitle>
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
            ))
          ) : (
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
