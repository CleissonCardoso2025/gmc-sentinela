
import { Dispatch, SetStateAction } from 'react';

export interface NovaEscalaProps {
  onSave: () => void;
  onCancel: () => void;
  editingId?: number | null;
}

export interface ScheduleEntry {
  date: Date;
  agentId: string;
  shift: "24h" | "Folga";
  supervisor?: boolean;
}

export interface PeriodoSelectionProps {
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  startDateOpen: boolean;
  setStartDateOpen: Dispatch<SetStateAction<boolean>>;
  periodoDuration: string;
  setPeriodoDuration: Dispatch<SetStateAction<string>>;
}

export interface RecursosSelectionProps {
  selectedGuarnicaoId: string;
  setSelectedGuarnicaoId: Dispatch<SetStateAction<string>>;
  selectedViaturaId: string;
  setSelectedViaturaId: Dispatch<SetStateAction<string>>;
  selectedRotaId: string;
  setSelectedRotaId: Dispatch<SetStateAction<string>>;
  supervisor: string;
  setSupervisor: Dispatch<SetStateAction<string>>;
  guarnicoes: GuarnicaoOption[];
  viaturas: ViaturaOption[];
  rotas: RotaOption[];
  isLoading: boolean;
}

export interface DistribuicaoTurnosProps {
  selectedGuarnicao: any;
  handleSortSchedule: () => void;
  escalaType: string;
  setEscalaType: Dispatch<SetStateAction<string>>;
}

export interface EscalaPreviewProps {
  selectedGuarnicao: any;
  daysToDisplay: Date[];
  scheduleData: ScheduleEntry[];
  changeAgentShift: (agentId: string, date: Date, newShift: "24h" | "Folga") => void;
  getShiftColor: (shift: string) => string;
  getAgentSchedule: () => any[];
}

export interface ActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isDisabled: boolean;
}

export interface GuarnicaoOption {
  id: string;
  nome: string;
  supervisor: string;
  membros?: {
    id: string;
    nome: string;
    funcao: string;
  }[];
}

export interface RotaOption {
  id: string;
  nome: string;
}

export interface ViaturaOption {
  id: string;
  codigo: string;
  modelo: string;
}
