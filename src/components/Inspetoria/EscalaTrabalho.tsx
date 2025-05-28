
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EscalaItem } from './Escala/types';
import NovaEscala from './NovaEscala';
import { VehicleProvider } from '@/contexts/VehicleContext';
import { getEscalaItems, deleteEscalaItem } from '@/services/escalaService/apiEscalaService';

const EscalaTrabalho: React.FC = () => {
  const [escalaItems, setEscalaItems] = useState<EscalaItem[]>([]);
  const [isCreatingEscala, setIsCreatingEscala] = useState(false);
  const [selectedEscalaItem, setSelectedEscalaItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guarnicaoNames, setGuarnicaoNames] = useState<{[key: string]: string}>({});
  const [viaturaCodes, setViaturaCodes] = useState<{[key: string]: string}>({});
  const [rotaNames, setRotaNames] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchLookupData();
    fetchEscalaItems();
  }, []);

  const fetchLookupData = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data: guarnicoesData, error: guarnicoesError } = await supabase
        .from('guarnicoes')
        .select('id, nome');

      if (guarnicoesError) throw guarnicoesError;
      
      const guarnicoes: {[key: string]: string} = {};
      guarnicoesData.forEach(item => {
        guarnicoes[item.id] = item.nome;
      });
      setGuarnicaoNames(guarnicoes);
      
      // Try to fetch from vehicles table first
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, placa, modelo');
        
      if (!vehiclesError && vehiclesData && vehiclesData.length > 0) {
        const viaturas: {[key: string]: string} = {};
        vehiclesData.forEach(item => {
          viaturas[String(item.id)] = `${item.placa} (${item.modelo})`;
        });
        setViaturaCodes(viaturas);
      } else {
        // Fallback to viaturas table
        const { data: viaturasData, error: viaturasError } = await supabase
          .from('viaturas')
          .select('id, codigo, modelo');

        if (viaturasError) throw viaturasError;
        
        const viaturas: {[key: string]: string} = {};
        viaturasData.forEach(item => {
          viaturas[item.id] = `${item.codigo} (${item.modelo})`;
        });
        setViaturaCodes(viaturas);
      }
      
      const { data: rotasData, error: rotasError } = await supabase
        .from('rotas')
        .select('id, nome');

      if (rotasError) throw rotasError;
      
      const rotas: {[key: string]: string} = {};
      rotasData.forEach(item => {
        rotas[item.id] = item.nome;
      });
      setRotaNames(rotas);
    } catch (error) {
      console.error("Error fetching lookup data:", error);
    }
  };

  const fetchEscalaItems = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching escala items from database...");
      const items = await getEscalaItems();
      console.log("Fetched escala items:", items);
      setEscalaItems(items);
    } catch (error) {
      console.error("Error fetching escala items:", error);
      toast({
        title: "Erro ao carregar escalas",
        description: "Não foi possível carregar as escalas de trabalho.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedEscalaItem(null);
    setIsCreatingEscala(true);
  };

  const handleEdit = (id: string) => {
    setSelectedEscalaItem(id);
    setIsCreatingEscala(true);
  };

  const handleSave = async () => {
    toast({
      title: "Escala salva",
      description: "A escala foi salva com sucesso na base de dados.",
    });
    setIsCreatingEscala(false);
    
    // Refresh the list after saving
    await fetchEscalaItems();
  };

  const handleCancel = () => {
    setIsCreatingEscala(false);
    setSelectedEscalaItem(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteEscalaItem(id);
      if (success) {
        await fetchEscalaItems(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting escala:", error);
      toast({
        title: "Erro ao excluir escala",
        description: "Não foi possível excluir a escala.",
        variant: "destructive"
      });
    }
  };

  const getDisplayName = (type: 'guarnicao' | 'rota' | 'viatura', id: string): string => {
    if (type === 'guarnicao') {
      return guarnicaoNames[id] || id;
    } else if (type === 'rota') {
      return rotaNames[id] || id;
    } else if (type === 'viatura') {
      return viaturaCodes[id] || id;
    }
    return id;
  };

  return (
    <div className="space-y-4">
      {isCreatingEscala ? (
        <VehicleProvider>
          <NovaEscala 
            onSave={handleSave} 
            onCancel={handleCancel}
            editingId={selectedEscalaItem}
          />
        </VehicleProvider>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Escalas de Trabalho</h2>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Escala
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <Table>
                <TableCaption>Lista de escalas de trabalho salvas na base de dados.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Guarnição</TableHead>
                    <TableHead>Supervisor</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead>Viatura</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escalaItems.length > 0 ? (
                    escalaItems.map((escalaItem) => (
                      <TableRow key={escalaItem.id}>
                        <TableCell className="font-medium">{getDisplayName('guarnicao', escalaItem.guarnicao)}</TableCell>
                        <TableCell>{escalaItem.supervisor}</TableCell>
                        <TableCell>{getDisplayName('rota', escalaItem.rota)}</TableCell>
                        <TableCell>{getDisplayName('viatura', escalaItem.viatura)}</TableCell>
                        <TableCell>{escalaItem.periodo} dias</TableCell>
                        <TableCell>
                          {escalaItem.created_at 
                            ? new Date(escalaItem.created_at).toLocaleDateString('pt-BR')
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(escalaItem.id)}>
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(escalaItem.id)}>
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        {isLoading ? "Carregando escalas..." : "Nenhuma escala cadastrada. Clique em 'Nova Escala' para criar."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EscalaTrabalho;
