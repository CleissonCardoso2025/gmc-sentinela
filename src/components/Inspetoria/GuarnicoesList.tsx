
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, UserX, Users, UserCheck, Car, Plus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "../Dashboard/EmptyState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Membro {
  id: string;
  nome: string;
  funcao: string;
  guarnicao_id?: string;
}

interface Guarnicao {
  id: string;
  nome: string;
  supervisor: string;
  updated_at: string;
  membros?: Membro[];
}

interface GuarnicoesListProps {
  onCreateNew: () => void;
}

const GuarnicoesList: React.FC<GuarnicoesListProps> = ({ onCreateNew }) => {
  const { toast } = useToast();
  const [guarnicoes, setGuarnicoes] = useState<Guarnicao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGuarnicao, setSelectedGuarnicao] = useState<Guarnicao | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchGuarnicoes();
  }, []);

  const fetchGuarnicoes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching guarnicoes...");
      // Fetch all guarnicoes
      const { data: guarnicoesData, error: guarnicoesError } = await supabase
        .from('guarnicoes')
        .select('*')
        .order('nome', { ascending: true });
      
      if (guarnicoesError) {
        console.error("Error fetching guarnicoes:", guarnicoesError);
        throw guarnicoesError;
      }
      
      console.log("Guarnicoes data:", guarnicoesData);
      
      if (!guarnicoesData || guarnicoesData.length === 0) {
        console.log("No guarnicoes found");
        setGuarnicoes([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch all membros_guarnicao
      const { data: membrosData, error: membrosError } = await supabase
        .from('membros_guarnicao')
        .select('*');
      
      if (membrosError) {
        console.error("Error fetching membros:", membrosError);
        throw membrosError;
      }
      
      console.log("Membros data:", membrosData);
      
      // Combine the data
      const guarnicoesWithMembros = guarnicoesData.map(guarnicao => {
        const membros = membrosData.filter(membro => membro.guarnicao_id === guarnicao.id);
        return { ...guarnicao, membros };
      });
      
      console.log("Guarnicoes with membros:", guarnicoesWithMembros);
      setGuarnicoes(guarnicoesWithMembros);
    } catch (error: any) {
      console.error("Error fetching guarnicoes:", error);
      setError(error.message || "Erro ao carregar guarnições");
      toast({
        title: "Erro ao carregar guarnições",
        description: "Não foi possível carregar as guarnições cadastradas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (guarnicao: Guarnicao) => {
    setSelectedGuarnicao(guarnicao);
    setIsDialogOpen(true);
  };

  const handleDeleteGuarnicao = async (id: string) => {
    try {
      // First delete all members associated with this guarnicao
      const { error: membrosError } = await supabase
        .from('membros_guarnicao')
        .delete()
        .eq('guarnicao_id', id);
      
      if (membrosError) throw membrosError;
      
      // Then delete the guarnicao
      const { error: guarnicaoError } = await supabase
        .from('guarnicoes')
        .delete()
        .eq('id', id);
      
      if (guarnicaoError) throw guarnicaoError;
      
      setGuarnicoes(guarnicoes.filter(g => g.id !== id));
      
      toast({
        title: "Guarnição excluída",
        description: "A guarnição foi excluída com sucesso."
      });
    } catch (error: any) {
      console.error("Error deleting guarnicao:", error);
      toast({
        title: "Erro ao excluir guarnição",
        description: error.message || "Não foi possível excluir a guarnição.",
        variant: "destructive"
      });
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedGuarnicao(null);
  };

  const retryFetch = () => {
    fetchGuarnicoes();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro de conexão</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Não foi possível conectar ao banco de dados: {error}</p>
          <Button onClick={retryFetch} variant="outline" size="sm">
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {guarnicoes.length === 0 ? (
        <div className="mb-4">
          <EmptyState
            title="Sem guarnições"
            description="Não há guarnições cadastradas no momento."
            icon="users"
          />
          <div className="flex justify-center mt-4">
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Guarnição
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guarnicoes.map((guarnicao) => (
            <Card key={guarnicao.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{guarnicao.nome}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Supervisor:</span> {guarnicao.supervisor}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(guarnicao)}>
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteGuarnicao(guarnicao.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Membros:</p>
                <div className="flex flex-wrap gap-2">
                  {guarnicao.membros && guarnicao.membros.length > 0 ? (
                    guarnicao.membros.map((membro, index) => (
                      <Badge key={index} variant="outline" className="flex items-center">
                        <UserCheck className="h-3 w-3 mr-1" />
                        <span className="text-xs">{membro.nome}</span>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Sem membros cadastrados</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes da Guarnição</DialogTitle>
          </DialogHeader>
          
          {selectedGuarnicao && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">{selectedGuarnicao.nome}</h3>
                <p className="text-sm mb-1">
                  <span className="font-medium">Supervisor:</span> {selectedGuarnicao.supervisor}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Última atualização:</span> {new Date(selectedGuarnicao.updated_at).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-md mb-2">Membros da Guarnição</h4>
                {selectedGuarnicao.membros && selectedGuarnicao.membros.length > 0 ? (
                  <div className="space-y-2">
                    {selectedGuarnicao.membros.map((membro, index) => (
                      <div key={index} className="p-2 border rounded-md flex items-center justify-between">
                        <div>
                          <p className="font-medium">{membro.nome}</p>
                          <p className="text-sm text-gray-600">{membro.funcao}</p>
                        </div>
                        <Badge variant="outline">{membro.funcao}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border rounded-md">
                    <UserX className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">Sem membros cadastrados</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={closeDialog}>Fechar</Button>
                <Button>Editar Guarnição</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuarnicoesList;
