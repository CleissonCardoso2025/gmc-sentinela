
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { guarnicoes } from './constants';
import { NovaEscalaProps, ScheduleEntry } from './types';
import { 
  generate30DaysFromDate, 
  getShiftColor, 
  createEmptySchedule,
  generateSortedSchedule
} from './utils';

// Component imports
import PeriodoSelection from './components/PeriodoSelection';
import RecursosSelection from './components/RecursosSelection';
import DistribuicaoTurnos from './components/DistribuicaoTurnos';
import EscalaPreview from './components/EscalaPreview';
import Actions from './components/Actions';

const NovaEscala: React.FC<NovaEscalaProps> = ({ onSave, onCancel, editingId }) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedGuarnicaoId, setSelectedGuarnicaoId] = useState("");
  const [selectedGuarnicao, setSelectedGuarnicao] = useState<any>(null);
  const [selectedViaturaId, setSelectedViaturaId] = useState("");
  const [selectedRotaId, setSelectedRotaId] = useState("");
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [startDateOpen, setStartDateOpen] = useState(false);

  // Get selected guarnicao objects
  useEffect(() => {
    if (selectedGuarnicaoId) {
      const guarnicao = guarnicoes.find(g => g.id === selectedGuarnicaoId);
      setSelectedGuarnicao(guarnicao);
    } else {
      setSelectedGuarnicao(null);
    }
  }, [selectedGuarnicaoId]);

  // Initialize schedule with empty data
  useEffect(() => {
    if (selectedGuarnicao) {
      const newSchedule = createEmptySchedule(selectedGuarnicao, startDate);
      setScheduleData(newSchedule);
    }
  }, [selectedGuarnicao, startDate]);

  const handleSortSchedule = () => {
    if (!selectedGuarnicao) {
      toast({
        title: "Selecione uma guarnição",
        description: "Você precisa selecionar uma guarnição antes de sortear a escala.",
        variant: "destructive"
      });
      return;
    }

    const newSchedule = generateSortedSchedule(scheduleData, selectedGuarnicao, startDate);
    setScheduleData(newSchedule);
    
    toast({
      title: "Escala sorteada",
      description: "A escala de 24h/72h foi distribuída automaticamente."
    });
  };

  const changeAgentShift = (agentId: string, date: Date, newShift: "24h" | "Folga") => {
    setScheduleData(prev => 
      prev.map(entry => {
        if (entry.agentId === agentId && 
            entry.date.getDate() === date.getDate() &&
            entry.date.getMonth() === date.getMonth()) {
          return { ...entry, shift: newShift };
        }
        return entry;
      })
    );
  };

  // Group schedule data by agent for display
  const getAgentSchedule = () => {
    if (!selectedGuarnicao) return [];
    
    const result = [];
    for (const membro of selectedGuarnicao.membros) {
      const agentEntries = scheduleData.filter(entry => entry.agentId === membro.id);
      result.push({
        agentId: membro.id,
        agentName: membro.nome,
        role: membro.funcao,
        schedule: agentEntries.sort((a, b) => a.date.getTime() - b.date.getTime())
      });
    }
    return result;
  };

  // Calculate days to display (first 7 for preview)
  const daysToDisplay = generate30DaysFromDate(startDate).slice(0, 7);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PeriodoSelection 
          startDate={startDate}
          setStartDate={setStartDate}
          startDateOpen={startDateOpen}
          setStartDateOpen={setStartDateOpen}
        />

        <RecursosSelection
          selectedGuarnicaoId={selectedGuarnicaoId}
          setSelectedGuarnicaoId={setSelectedGuarnicaoId}
          selectedViaturaId={selectedViaturaId}
          setSelectedViaturaId={setSelectedViaturaId}
          selectedRotaId={selectedRotaId}
          setSelectedRotaId={setSelectedRotaId}
        />

        <DistribuicaoTurnos
          selectedGuarnicao={selectedGuarnicao}
          handleSortSchedule={handleSortSchedule}
        />
      </div>

      {selectedGuarnicao && (
        <EscalaPreview
          selectedGuarnicao={selectedGuarnicao}
          daysToDisplay={daysToDisplay}
          scheduleData={scheduleData}
          changeAgentShift={changeAgentShift}
          getShiftColor={getShiftColor}
          getAgentSchedule={getAgentSchedule}
        />
      )}

      <Actions
        onCancel={onCancel}
        onSave={onSave}
        isDisabled={!selectedGuarnicao || !selectedViaturaId || !selectedRotaId}
      />
    </div>
  );
};

export default NovaEscala;
