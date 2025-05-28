
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
import { useVehicles } from '@/contexts/VehicleContext';
import { createEscalaItem, updateEscalaItem } from '@/services/escalaService/apiEscalaService';

// Component imports
import PeriodoSelection from './components/PeriodoSelection';
import RecursosSelection from './components/RecursosSelection';
import DistribuicaoTurnos from './components/DistribuicaoTurnos';
import EscalaPreview from './components/EscalaPreview';
import Actions from './components/Actions';

const NovaEscala: React.FC<NovaEscalaProps> = ({ onSave, onCancel, editingId }) => {
  const { toast } = useToast();
  const { vehicles } = useVehicles();
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
  const [showFullPeriod, setShowFullPeriod] = useState(false);
  
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

        // Fetch viaturas - prioritize using vehicles from the VehicleContext
        if (vehicles && vehicles.length > 0) {
          const formattedViaturas = vehicles.map(vehicle => ({
            id: vehicle.id.toString(),
            codigo: vehicle.placa,
            modelo: vehicle.modelo
          }));
          console.log("Using vehicles from context:", formattedViaturas);
          setViaturas(formattedViaturas);
        } else {
          // First try to get vehicles from the vehicles table
          const { data: vehiclesData, error: vehiclesError } = await supabase
            .from('vehicles')
            .select('id, placa, modelo');
            
          if (!vehiclesError && vehiclesData && vehiclesData.length > 0) {
            const formattedVehicles = vehiclesData.map(vehicle => ({
              id: vehicle.id.toString(),
              codigo: vehicle.placa,
              modelo: vehicle.modelo
            }));
            console.log("Fetched vehicles from vehicles table:", formattedVehicles);
            setViaturas(formattedVehicles);
          } else {
            // Fallback to the viaturas table
            const { data: viaturasData, error: viaturasError } = await supabase
              .from('viaturas')
              .select('id, codigo, modelo');

            if (viaturasError) throw viaturasError;
            console.log("Fetched viaturas from viaturas table:", viaturasData);
            setViaturas(viaturasData);
          }
        }

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
  }, [toast, vehicles]);

  // Load existing escala data if editing
  useEffect(() => {
    if (editingId) {
      const fetchEscalaData = async () => {
        try {
          const { data, error } = await supabase
            .from('escala_items')
            .select('*')
            .eq('id', editingId)
            .single();

          if (error) throw error;
          
          if (data) {
            // Set form values
            setSelectedGuarnicaoId(data.guarnicao);
            setSelectedRotaId(data.rota);
            setSelectedViaturaId(data.viatura);
            setSupervisor(data.supervisor);
            setPeriodoDuration(data.periodo);
            // Other fields as needed
          }
        } catch (error) {
          console.error("Error fetching escala data:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados da escala.",
            variant: "destructive"
          });
        }
      };

      fetchEscalaData();
    }
  }, [editingId, toast]);

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
        const entryDate = new Date(entry.date);
        if (entry.agentId === agentId && 
            entryDate.getDate() === date.getDate() &&
            entryDate.getMonth() === date.getMonth() &&
            entryDate.getFullYear() === date.getFullYear()) {
          return { ...entry, shift: newShift };
        }
        return entry;
      })
    );
  };

  // New function to swap shifts between agents
  const swapShiftsBetweenAgents = (sourceAgentId: string, targetAgentId: string, date: Date) => {
    console.log("Swapping shifts between agents:", { sourceAgentId, targetAgentId, date });
    
    // Find entries for both agents on the selected date
    const dateStr = date.toDateString();
    
    // Create a copy of scheduleData to modify
    const updatedSchedule = [...scheduleData];
    let sourceEntry = null;
    let targetEntry = null;
    let sourceIndex = -1;
    let targetIndex = -1;
    
    // Find indices and entries
    updatedSchedule.forEach((entry, index) => {
      const entryDate = new Date(entry.date);
      
      if (entryDate.toDateString() === dateStr) {
        if (entry.agentId === sourceAgentId) {
          sourceEntry = entry;
          sourceIndex = index;
        } else if (entry.agentId === targetAgentId) {
          targetEntry = entry;
          targetIndex = index;
        }
      }
    });
    
    // If both entries found, swap their shifts
    if (sourceEntry && targetEntry && sourceIndex !== -1 && targetIndex !== -1) {
      const sourceShift = sourceEntry.shift;
      const targetShift = targetEntry.shift;
      
      // Update the entries with swapped shifts
      updatedSchedule[sourceIndex] = { ...sourceEntry, shift: targetShift };
      updatedSchedule[targetIndex] = { ...targetEntry, shift: sourceShift };
      
      // Update state
      setScheduleData(updatedSchedule);
      
      toast({
        title: "Plantões trocados",
        description: "Os plantões entre os agentes foram trocados com sucesso."
      });
    } else {
      toast({
        title: "Erro na troca",
        description: "Não foi possível encontrar os plantões para trocar.",
        variant: "destructive"
      });
    }
  };

  // Save the escala data
  const handleSave = async () => {
    if (!selectedGuarnicao || !selectedViaturaId || !selectedRotaId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log("Saving escala with data:", {
        selectedGuarnicao,
        selectedViaturaId,
        selectedRotaId,
        supervisor,
        periodoDuration,
        scheduleData
      });
      
      // Format schedule data for the database
      const formattedSchedule = scheduleData.map(entry => ({
        date: entry.date.toISOString().split('T')[0],
        day: entry.date.toLocaleDateString('pt-BR', { weekday: 'long' }),
        agentId: entry.agentId,
        shift: entry.shift,
        active: entry.shift === '24h',
        supervisor: entry.supervisor || false
      }));
      
      // Format data for saving
      const escalaData = {
        guarnicao: selectedGuarnicaoId,
        supervisor: supervisor || selectedGuarnicao.supervisor || "Não informado",
        rota: selectedRotaId,
        viatura: selectedViaturaId,
        periodo: periodoDuration,
        agent: selectedGuarnicao.nome || "",
        role: "Guarnição",
        schedule: formattedSchedule
      };
      
      console.log("Formatted escala data for save:", escalaData);
      
      if (editingId) {
        // Update existing escala
        const result = await updateEscalaItem({
          id: editingId,
          ...escalaData,
          schedule: formattedSchedule.map(s => ({
            day: s.day,
            date: s.date,
            active: s.active
          }))
        });
        
        if (result) {
          toast({
            title: "Escala atualizada",
            description: "A escala foi atualizada com sucesso.",
          });
          onSave();
        }
      } else {
        // Create new escala
        const result = await createEscalaItem(escalaData);
        
        if (result) {
          toast({
            title: "Escala criada",
            description: "A escala foi criada e salva com sucesso.",
          });
          onSave();
        }
      }
    } catch (error) {
      console.error("Error saving escala:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a escala na base de dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group schedule data by agent for display
  const getAgentSchedule = () => {
    if (!selectedGuarnicao || !selectedGuarnicao.membros) return [];
    
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
  const numDaysToDisplay = parseInt(periodoDuration, 10);
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
          showFullPeriod={showFullPeriod}
          setShowFullPeriod={setShowFullPeriod}
          swapShiftsBetweenAgents={swapShiftsBetweenAgents}
        />
      )}

      <Actions
        onCancel={onCancel}
        onSave={handleSave}
        isDisabled={!selectedGuarnicao || !selectedViaturaId || !selectedRotaId || isLoading}
      />
    </div>
  );
};

export default NovaEscala;
