
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import NovaEscala from './NovaEscala';
import { supabase } from "@/integrations/supabase/client";
import EmptyState from "@/components/Dashboard/EmptyState";

// Import refactored components
import EscalaFilters from './Escala/EscalaFilters';
import EscalaActions from './Escala/EscalaActions';
import EscalaInfo from './Escala/EscalaInfo';
import EscalaTable from './Escala/EscalaTable';
import EscalaLegend from './Escala/EscalaLegend';

// Import types and utilities
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption } from './Escala/types';
import { getStatusColor } from './Escala/utils';

const EscalaTrabalho: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("semanal");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedGuarnicao, setSelectedGuarnicao] = useState("todas");
  const [selectedRota, setSelectedRota] = useState("todas");
  const [selectedViatura, setSelectedViatura] = useState("todas");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null); // Changed from number to string
  
  // State for data from Supabase
  const [escalaData, setEscalaData] = useState<EscalaItem[]>([]);
  const [guarnicoes, setGuarnicoes] = useState<GuarnicaoOption[]>([]);
  const [rotas, setRotas] = useState<RotaOption[]>([]);
  const [viaturas, setViaturas] = useState<ViaturaOption[]>([]);
  const [weekDays] = useState(["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch escala items
        const { data: escalaItems, error: escalaError } = await supabase
          .from('escala_items')
          .select('*');
        
        if (escalaError) throw escalaError;
        
        // Fetch guarnicoes
        const { data: guarnicoesData, error: guarnicoesError } = await supabase
          .from('guarnicoes')
          .select('*');
        
        if (guarnicoesError) throw guarnicoesError;
        
        // Fetch rotas
        const { data: rotasData, error: rotasError } = await supabase
          .from('rotas')
          .select('*');
        
        if (rotasError) throw rotasError;
        
        // Fetch viaturas
        const { data: viaturasData, error: viaturasError } = await supabase
          .from('viaturas')
          .select('*');
        
        if (viaturasError) throw viaturasError;
        
        // Format and set data
        if (escalaItems && escalaItems.length > 0) {
          // Process the schedule data to make sure it's properly formatted
          const formattedItems: EscalaItem[] = escalaItems.map(item => ({
            id: item.id,
            guarnicao: item.guarnicao,
            supervisor: item.supervisor,
            rota: item.rota,
            viatura: item.viatura,
            periodo: item.periodo,
            agent: item.agent,
            role: item.role,
            schedule: Array.isArray(item.schedule) ? item.schedule : [],
            created_at: item.created_at,
            updated_at: item.updated_at
          }));
          setEscalaData(formattedItems);
        } else {
          setEscalaData([]);
        }
        
        setGuarnicoes(guarnicoesData?.map(g => ({
          id: g.id,
          nome: g.nome,
          supervisor: g.supervisor
        })) || []);
        
        setRotas(rotasData?.map(r => ({
          id: r.id,
          nome: r.nome
        })) || []);
        
        setViaturas(viaturasData?.map(v => ({
          id: v.id,
          codigo: v.codigo,
          modelo: v.modelo
        })) || []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados da escala.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "A escala de trabalho está sendo exportada para PDF."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Imprimindo",
      description: "A escala de trabalho está sendo enviada para impressão."
    });
  };

  const handleFilter = () => {
    toast({
      title: "Filtro aplicado",
      description: "A escala foi filtrada com os parâmetros selecionados."
    });
  };

  const handleDeleteShift = async (id: string) => { // Changed from number to string
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('escala_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setEscalaData(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Turno removido",
        description: "O turno foi removido da escala com sucesso."
      });
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast({
        title: "Erro ao remover turno",
        description: "Não foi possível remover o turno da escala.",
        variant: "destructive"
      });
    }
  };

  const handleSubstituteAgent = (id: string) => { // Changed from number to string
    toast({
      title: "Substituição de agente",
      description: "Selecione um agente para substituição."
    });
  };

  const handleEditSchedule = (id: string) => { // Changed from number to string
    setEditingSchedule(id);
    setIsCreateModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    setIsCreateModalOpen(false);
    
    try {
      // Re-fetch data to get the updated schedule
      const { data, error } = await supabase
        .from('escala_items')
        .select('*');
      
      if (error) throw error;
      
      // Process the data before setting it
      if (data && data.length > 0) {
        const formattedItems: EscalaItem[] = data.map(item => ({
          id: item.id,
          guarnicao: item.guarnicao,
          supervisor: item.supervisor,
          rota: item.rota,
          viatura: item.viatura,
          periodo: item.periodo,
          agent: item.agent,
          role: item.role,
          schedule: Array.isArray(item.schedule) ? item.schedule : [],
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        setEscalaData(formattedItems);
      } else {
        setEscalaData([]);
      }
      
      toast({
        title: "Escala salva",
        description: editingSchedule ? "Escala atualizada com sucesso." : "Nova escala criada com sucesso."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Erro ao atualizar dados",
        description: "A escala foi salva, mas não foi possível atualizar a visualização.",
        variant: "destructive"
      });
    }
    
    setEditingSchedule(null);
  };

  const filteredData = escalaData.filter(item => {
    // Filter by guarnicao, but handle "todas" case
    if (selectedGuarnicao !== "todas" && item.guarnicao !== selectedGuarnicao) return false;
    
    // Filter by rota, but handle "todas" case
    if (selectedRota !== "todas" && item.rota !== selectedRota) return false;
    
    // Filter by viatura, but handle "todas" case
    if (selectedViatura !== "todas" && item.viatura.includes(selectedViatura) === false) return false;
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="w-full lg:w-3/4">
          <EscalaFilters
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedGuarnicao={selectedGuarnicao}
            setSelectedGuarnicao={setSelectedGuarnicao}
            selectedRota={selectedRota}
            setSelectedRota={setSelectedRota}
            selectedViatura={selectedViatura}
            setSelectedViatura={setSelectedViatura}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleFilter={handleFilter}
            guarnicoes={guarnicoes}
            rotas={rotas}
            viaturas={viaturas}
          />
        </div>
        
        <div className="w-full lg:w-auto">
          <EscalaActions
            handleExportPDF={handleExportPDF}
            handlePrint={handlePrint}
            openCreateModal={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>

      <EscalaInfo />

      <div className="overflow-x-auto">
        {filteredData.length > 0 ? (
          <EscalaTable
            weekDays={weekDays}
            filteredData={filteredData}
            onEditSchedule={handleEditSchedule}
            onSubstituteAgent={handleSubstituteAgent}
            onDeleteShift={handleDeleteShift}
            getStatusColor={getStatusColor}
          />
        ) : (
          <EmptyState 
            icon="info"
            title="Nenhuma escala encontrada" 
            description="Não existem escalas cadastradas ou que correspondam aos filtros selecionados."
            actionLabel="Criar Nova Escala"
            onAction={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      <EscalaLegend
        filteredDataCount={filteredData.length}
        totalDataCount={escalaData.length}
      />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? "Editar Escala" : "Nova Escala de Trabalho"}</DialogTitle>
            <DialogDescription>
              Crie uma escala para o período de 30 dias com turnos de 24h por 72h.
            </DialogDescription>
          </DialogHeader>
          <NovaEscala 
            onSave={handleSaveSchedule}
            onCancel={() => setIsCreateModalOpen(false)}
            editingId={editingSchedule}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscalaTrabalho;
