
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
}

export interface RecursosSelectionProps {
  selectedGuarnicaoId: string;
  setSelectedGuarnicaoId: Dispatch<SetStateAction<string>>;
  selectedViaturaId: string;
  setSelectedViaturaId: Dispatch<SetStateAction<string>>;
  selectedRotaId: string;
  setSelectedRotaId: Dispatch<SetStateAction<string>>;
}

export interface DistribuicaoTurnosProps {
  selectedGuarnicao: any;
  handleSortSchedule: () => void;
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
