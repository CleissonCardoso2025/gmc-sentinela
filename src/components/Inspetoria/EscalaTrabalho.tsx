
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
import { escalaData, weekDays, guarnicoes, supervisores, rotas } from './Escala/mockData';
import { getStatusColor } from './Escala/utils';

const EscalaTrabalho: React.FC = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("semanal");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedGuarnicao, setSelectedGuarnicao] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedRota, setSelectedRota] = useState("");
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
    if (selectedGuarnicao && item.guarnicao !== selectedGuarnicao) return false;
    if (selectedSupervisor && item.supervisor !== selectedSupervisor) return false;
    if (selectedRota && item.rota !== selectedRota) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <EscalaFilters
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedGuarnicao={selectedGuarnicao}
          setSelectedGuarnicao={setSelectedGuarnicao}
          selectedSupervisor={selectedSupervisor}
          setSelectedSupervisor={setSelectedSupervisor}
          selectedRota={selectedRota}
          setSelectedRota={setSelectedRota}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          handleFilter={handleFilter}
          guarnicoes={guarnicoes}
          supervisores={supervisores}
          rotas={rotas}
        />
        
        <EscalaActions
          handleExportPDF={handleExportPDF}
          handlePrint={handlePrint}
          openCreateModal={() => setIsCreateModalOpen(true)}
        />
      </div>

      <EscalaInfo />

      <EscalaTable
        weekDays={weekDays}
        filteredData={filteredData}
        onEditSchedule={handleEditSchedule}
        onSubstituteAgent={handleSubstituteAgent}
        onDeleteShift={handleDeleteShift}
        getStatusColor={getStatusColor}
      />

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
