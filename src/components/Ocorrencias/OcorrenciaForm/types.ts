
import { MapMarker } from '@/types/maps';

export interface ProvidenciaTomada {
  id: string;
  label: string;
  checked: boolean;
}

export interface AgentData {
  id: string;
  name: string;
}

export interface AttachmentFile {
  id: string;
  file: File | null;
  type: string;
  description: string;
  preview?: string;
}

export interface OcorrenciaContextType {
  // Form state
  numero: string;
  setNumero: (value: string) => void;
  tipo: string;
  setTipo: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  descricao: string;
  setDescricao: (value: string) => void;
  local: string;
  setLocal: (value: string) => void;
  data: string;
  setData: (value: string) => void;
  hora: string;
  setHora: (value: string) => void;
  isLoading: boolean;
  
  // Attachments
  attachments: AttachmentFile[];
  handleAddAttachment: (file: File, type: string, description: string) => void;
  handleRemoveAttachment: (id: string) => void;
  handleUpdateAttachment: (id: string, description: string) => void;
  resetAttachments: () => void;
  
  // Location
  position: MapMarker | null;
  setPosition: React.Dispatch<React.SetStateAction<MapMarker | null>>;
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  handleMapClick: (marker: MapMarker) => void;
  locationLoading: boolean;
  locationError: GeolocationPositionError | null;
  handleGetCurrentLocation: () => Promise<void>;
  resetLocation: () => void;
  
  // Providencias
  providencias: ProvidenciaTomada[];
  handleToggleProvidencia: (id: string) => void;
  resetProvidencias: () => void;
  
  // Text correction
  isCorrecting: boolean;
  applyCorrection: () => void;
  toggleCorrection: () => void;
  
  // Agents
  agents: AgentData[];
  selectedAgents: string[];
  handleAgentSelect: (agentId: string) => void;
  resetAgents: () => void;
  
  // Form actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}
