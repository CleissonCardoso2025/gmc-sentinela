
import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/Dashboard/EmptyState';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface Occurrence {
  id: string;
  numero: string;
  tipo: string;
  descricao: string;
  local: string;
  data: string;
  status: string;
  created_at: string;
}

const InspetoriaOccurrences: React.FC = () => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOccurrences() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('ocorrencias')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setOccurrences(data || []);
      } catch (error) {
        console.error('Error fetching occurrences:', error);
        setError('Não foi possível carregar as ocorrências.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOccurrences();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'encerrada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'sob investigação':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'encaminhada':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-800">
        <h3 className="font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Erro ao carregar dados
        </h3>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  if (occurrences.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ocorrências Cadastradas</h2>
        </div>

        <EmptyState 
          title="Sem ocorrências" 
          description="Nenhuma ocorrência foi registrada." 
          icon="info"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Local</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {occurrences.map((occurrence) => (
                <TableRow key={occurrence.id}>
                  <TableCell className="font-medium">{occurrence.numero}</TableCell>
                  <TableCell>{occurrence.tipo}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {occurrence.local}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {occurrence.data}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(occurrence.status)} border`}>
                      {occurrence.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspetoriaOccurrences;
