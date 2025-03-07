
import React, { useState } from 'react';
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

// Import refactored components
import EscalaFilters from './Escala/EscalaFilters';
import EscalaActions from './Escala/EscalaActions';
import EscalaInfo from './Escala/EscalaInfo';
import EscalaTable from './Escala/EscalaTable';
import EscalaLegend from './Escala/EscalaLegend';

// Import mock data and utilities
import { escalaData, weekDays, guarnicoes, rotas, viaturas } from './Escala/mockData';
import { getStatusColor } from './Escala/utils';

const EscalaTrabalho: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("semanal");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedGuarnicao, setSelectedGuarnicao] = useState("todas");
  const [selectedRota, setSelectedRota] = useState("todas");
  const [selectedViatura, setSelectedViatura] = useState("todas");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<number | null>(null);

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

  const handleDeleteShift = (id: number) => {
    toast({
      title: "Turno removido",
      description: "O turno foi removido da escala."
    });
  };

  const handleSubstituteAgent = (id: number) => {
    toast({
      title: "Substituição de agente",
      description: "Selecione um agente para substituição."
    });
  };

  const handleEditSchedule = (id: number) => {
    setEditingSchedule(id);
    setIsCreateModalOpen(true);
  };

  const handleSaveSchedule = () => {
    setIsCreateModalOpen(false);
    setEditingSchedule(null);
    toast({
      title: "Escala salva",
      description: editingSchedule ? "Escala atualizada com sucesso." : "Nova escala criada com sucesso."
    });
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
        <EscalaTable
          weekDays={weekDays}
          filteredData={filteredData}
          onEditSchedule={handleEditSchedule}
          onSubstituteAgent={handleSubstituteAgent}
          onDeleteShift={handleDeleteShift}
          getStatusColor={getStatusColor}
        />
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
