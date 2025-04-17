
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Plus, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/Dashboard/EmptyState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RotaForm from './RotaForm';

interface Rota {
  id: string;
  nome: string;
  descricao?: string;
  bairros?: string;
  pontoinicial?: string;
  pontofinal?: string;
  tempoprevisto?: string;
  prioridade?: string;
  ultimopatrulhamento?: string;
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
  const [error, setError] = useState<string | null>(null);
  const [selectedRota, setSelectedRota] = useState<Rota | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchRotas();
  }, []);

  const fetchRotas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('rotas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar rotas:", error);
        
        // Specific handling for permission errors
        if (error.code === 'PGRST116') {
          setError("Você não tem permissão para visualizar as rotas. Entre em contato com um administrador.");
        } else {
          setError(error.message || "Não foi possível carregar as rotas cadastradas.");
        }
        
        toast({
          title: "Erro ao carregar rotas",
          description: error.message || "Não foi possível carregar as rotas.",
          variant: "destructive"
        });
      } else {
        console.log("Rotas recuperadas:", data);
        setRotas(data || []);
      }
    } catch (error: any) {
      console.error("Erro ao carregar rotas:", error);
      setError(error.message || "Ocorreu um erro ao buscar as rotas.");
      toast({
        title: "Erro ao carregar rotas",
        description: error.message || "Não foi possível carregar as rotas.",
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
    } catch (error: any) {
      console.error("Erro ao excluir rota:", error);
      toast({
        title: "Erro ao excluir rota",
        description: "Não foi possível excluir a rota.",
        variant: "destructive"
      });
    }
  };

  const handleViewRota = (rota: Rota) => {
    setSelectedRota(rota);
    setIsViewDialogOpen(true);
  };

  const handleEditRota = (rota: Rota) => {
    setSelectedRota(rota);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    setIsEditDialogOpen(false);
    fetchRotas(); // Refresh the list after edit
    toast({
      title: "Rota atualizada",
      description: "A rota foi atualizada com sucesso.",
    });
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
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

  const retryFetch = () => {
    fetchRotas();
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro de Acesso</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error}</p>
          <Button onClick={fetchRotas} variant="outline" size="sm">
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
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
                    <TableCell>{rota.tempoprevisto || "-"}</TableCell>
                    <TableCell>{getPriorityBadge(rota.prioridade || "Normal")}</TableCell>
                    <TableCell>{rota.ultimopatrulhamento || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Visualizar"
                          onClick={() => handleViewRota(rota)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Editar"
                          onClick={() => handleEditRota(rota)}
                        >
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedRota?.nome || "Detalhes da Rota"}</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre a rota.
            </DialogDescription>
          </DialogHeader>
          {selectedRota && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Nome:</span>
                <span className="col-span-3">{selectedRota.nome}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Descrição:</span>
                <span className="col-span-3">{selectedRota.descricao || "-"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Bairros:</span>
                <span className="col-span-3">{selectedRota.bairros || "-"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Ponto Inicial:</span>
                <span className="col-span-3">{selectedRota.pontoinicial || "-"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Ponto Final:</span>
                <span className="col-span-3">{selectedRota.pontofinal || "-"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Tempo Previsto:</span>
                <span className="col-span-3">{selectedRota.tempoprevisto ? `${selectedRota.tempoprevisto} minutos` : "-"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Prioridade:</span>
                <span className="col-span-3">{getPriorityBadge(selectedRota.prioridade || "Normal")}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-semibold">Último Patrulhamento:</span>
                <span className="col-span-3">{selectedRota.ultimopatrulhamento || "Nunca patrulhada"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Rota</DialogTitle>
            <DialogDescription>
              Atualize as informações da rota.
            </DialogDescription>
          </DialogHeader>
          {selectedRota && (
            <RotaForm 
              onSave={handleEditSave}
              onCancel={handleEditCancel}
              editingRota={{
                nome: selectedRota.nome,
                descricao: selectedRota.descricao || '',
                bairros: selectedRota.bairros || '',
                pontoInicial: selectedRota.pontoinicial || '',
                pontoFinal: selectedRota.pontofinal || '',
                tempoPrevisto: selectedRota.tempoprevisto || '',
                prioridade: selectedRota.prioridade || 'Normal',
              }}
              rotaId={selectedRota.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RotasList;
