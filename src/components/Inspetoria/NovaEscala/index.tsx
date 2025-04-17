
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NovaEscalaProps, ScheduleEntry, GuarnicaoOption, ViaturaOption, RotaOption } from './types';
import { 
  generateDaysFromDate, 
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
  const [periodoDuration, setPeriodoDuration] = useState<string>("7");
  const [escalaType, setEscalaType] = useState<string>("24/72");
  
  const [selectedGuarnicaoId, setSelectedGuarnicaoId] = useState("");
  const [selectedGuarnicao, setSelectedGuarnicao] = useState<any>(null);
  const [selectedViaturaId, setSelectedViaturaId] = useState("");
  const [selectedRotaId, setSelectedRotaId] = useState("");
  const [supervisor, setSupervisor] = useState("");
  
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [startDateOpen, setStartDateOpen] = useState(false);
  
  const [guarnicoes, setGuarnicoes] = useState<GuarnicaoOption[]>([]);
  const [viaturas, setViaturas] = useState<ViaturaOption[]>([]);
  const [rotas, setRotas] = useState<RotaOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch options from database
  useEffect(() => {
    console.log("Fetching options from database");
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        // Fetch guarnicoes
        const { data: guarnicoesData, error: guarnicoesError } = await supabase
          .from('guarnicoes')
          .select('id, nome, supervisor, membros_guarnicao(id, nome, funcao)');

        if (guarnicoesError) throw guarnicoesError;
        
        console.log("Fetched guarnicoes:", guarnicoesData);
        
        // Format to include membros as a nested property
        const formattedGuarnicoes = guarnicoesData.map(g => ({
          ...g,
          membros: g.membros_guarnicao
        }));
        
        setGuarnicoes(formattedGuarnicoes);

        // Fetch viaturas
        const { data: viaturasData, error: viaturasError } = await supabase
          .from('viaturas')
          .select('id, codigo, modelo');

        if (viaturasError) throw viaturasError;
        console.log("Fetched viaturas:", viaturasData);
        setViaturas(viaturasData);

        // Fetch rotas
        const { data: rotasData, error: rotasError } = await supabase
          .from('rotas')
          .select('id, nome');

        if (rotasError) throw rotasError;
        console.log("Fetched rotas:", rotasData);
        setRotas(rotasData);
      } catch (error: any) {
        console.error("Erro ao carregar opções:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as opções dos campos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [toast]);

  // Get selected guarnicao object when ID changes
  useEffect(() => {
    console.log("Selected guarnicao ID changed to:", selectedGuarnicaoId);
    if (selectedGuarnicaoId) {
      const guarnicao = guarnicoes.find(g => g.id === selectedGuarnicaoId);
      console.log("Found guarnicao:", guarnicao);
      setSelectedGuarnicao(guarnicao);
    } else {
      setSelectedGuarnicao(null);
    }
  }, [selectedGuarnicaoId, guarnicoes]);

  // Initialize schedule with empty data when guarnicao or dates change
  useEffect(() => {
    console.log("Selected guarnicao or dates changed, initializing schedule");
    if (selectedGuarnicao) {
      const durationInDays = parseInt(periodoDuration, 10);
      const newSchedule = createEmptySchedule(selectedGuarnicao, startDate, durationInDays);
      console.log("Created new empty schedule:", newSchedule);
      setScheduleData(newSchedule);
    }
  }, [selectedGuarnicao, startDate, periodoDuration]);

  const handleSortSchedule = () => {
    console.log("Sorting schedule...");
    if (!selectedGuarnicao) {
      toast({
        title: "Selecione uma guarnição",
        description: "Você precisa selecionar uma guarnição antes de sortear a escala.",
        variant: "destructive"
      });
      return;
    }

    const durationInDays = parseInt(periodoDuration, 10);
    console.log("Current schedule data:", scheduleData);
    console.log("Selected guarnicao:", selectedGuarnicao);
    console.log("Start date:", startDate);
    console.log("Duration:", durationInDays);
    
    const newSchedule = generateSortedSchedule(scheduleData, selectedGuarnicao, startDate, durationInDays);
    console.log("Generated new sorted schedule:", newSchedule);
    setScheduleData(newSchedule);
    
    toast({
      title: "Escala sorteada",
      description: `A escala de ${escalaType} foi distribuída automaticamente.`
    });
  };

  const changeAgentShift = (agentId: string, date: Date, newShift: "24h" | "Folga") => {
    console.log("Changing agent shift:", { agentId, date, newShift });
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

  // Calculate days to display (based on selected period duration)
  const numDaysToDisplay = parseInt(periodoDuration, 10) > 7 ? 7 : parseInt(periodoDuration, 10);
  const daysToDisplay = generateDaysFromDate(startDate, numDaysToDisplay);

  // For debugging
  useEffect(() => {
    console.log("Current Schedule Data:", scheduleData);
  }, [scheduleData]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PeriodoSelection 
          startDate={startDate}
          setStartDate={setStartDate}
          startDateOpen={startDateOpen}
          setStartDateOpen={setStartDateOpen}
          periodoDuration={periodoDuration}
          setPeriodoDuration={setPeriodoDuration}
        />

        <RecursosSelection
          selectedGuarnicaoId={selectedGuarnicaoId}
          setSelectedGuarnicaoId={setSelectedGuarnicaoId}
          selectedViaturaId={selectedViaturaId}
          setSelectedViaturaId={setSelectedViaturaId}
          selectedRotaId={selectedRotaId}
          setSelectedRotaId={setSelectedRotaId}
          supervisor={supervisor}
          setSupervisor={setSupervisor}
          guarnicoes={guarnicoes}
          viaturas={viaturas}
          rotas={rotas}
          isLoading={isLoading}
        />

        <DistribuicaoTurnos
          selectedGuarnicao={selectedGuarnicao}
          handleSortSchedule={handleSortSchedule}
          escalaType={escalaType}
          setEscalaType={setEscalaType}
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
