
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Map, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/Dashboard/EmptyState";

interface Rota {
  id: string;
  nome: string;
  bairros?: string;
  pontoInicial?: string;
  pontoFinal?: string;
  tempoPrevisto?: string;
  prioridade?: string;
  ultimoPatrulhamento?: string;
  created_at: string;
}

interface RotasListProps {
  onCreateNew: () => void;
}

const RotasList: React.FC<RotasListProps> = ({ onCreateNew }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRotas();
  }, []);

  const fetchRotas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rotas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRotas(data || []);
    } catch (error) {
      console.error("Error fetching rotas:", error);
      toast({
        title: "Erro ao carregar rotas",
        description: "Não foi possível carregar as rotas cadastradas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRota = async (id: string) => {
    try {
      const rotaToDelete = rotas.find(rota => rota.id === id);
      if (!rotaToDelete) return;

      const { error } = await supabase
        .from('rotas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRotas(rotas.filter(rota => rota.id !== id));
      toast({
        title: "Rota excluída",
        description: `A rota ${rotaToDelete.nome} foi excluída com sucesso.`,
      });
    } catch (error) {
      console.error("Error deleting rota:", error);
      toast({
        title: "Erro ao excluir rota",
        description: "Não foi possível excluir a rota.",
        variant: "destructive"
      });
    }
  };

  const filteredRotas = rotas.filter(rota => 
    rota.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (rota.bairros && rota.bairros.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (rota.prioridade && rota.prioridade.toLowerCase().includes(searchTerm.toLowerCase()))
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
        return <Badge>{prioridade || "Normal"}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-1/3">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

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

      {rotas.length === 0 ? (
        <EmptyState
          title="Sem rotas"
          description="Não há rotas cadastradas ainda."
          icon="map"
        />
      ) : (
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
                    <TableCell>{rota.bairros || "-"}</TableCell>
                    <TableCell>{rota.tempoPrevisto || "-"}</TableCell>
                    <TableCell>{getPriorityBadge(rota.prioridade || "Normal")}</TableCell>
                    <TableCell>{rota.ultimoPatrulhamento || "-"}</TableCell>
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
      )}
    </div>
  );
};

export default RotasList;
