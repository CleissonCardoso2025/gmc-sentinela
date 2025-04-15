
import { MapMarker } from '@/types/maps';

export interface ProvidenciaTomada {
  id: string;
  label: string;
  checked: boolean;
}

export interface AgentData {
  id: string;
  name: string;
  nome?: string;
  patente?: string;
  role?: string;
}

export interface AgentParticipation extends AgentData {
  nome: string;
  patente?: string;
  role?: string;
}

export interface AttachmentFile {
  id: string;
  file: File | null;
  type: string;
  description: string;
  preview?: string;
}

export interface MediaAttachment {
  id: string;
  file: File | null;
  preview: string;
  type: 'image' | 'document' | 'video';
  description: string;
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
  attachments: MediaAttachment[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  showCameraDialog: boolean;
  setShowCameraDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document' | 'video') => void;
  removeAttachment: (id: string) => void;
  updateAttachmentDescription: (id: string, description: string) => void;
  addAttachment: (attachment: MediaAttachment) => void;
  handleDocumentSelect: () => void;
  startCamera: () => void;
  resetAttachments: () => void;
  handleAddAttachment: (file: File, type: string, description: string) => void;
  handleRemoveAttachment: (id: string) => void;
  handleUpdateAttachment: (id: string, description: string) => void;
  
  // Location
  position: MapMarker | null;
  setPosition: React.Dispatch<React.SetStateAction<MapMarker | null>>;
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  handleMapClick: (marker: MapMarker) => void;
  locationLoading: boolean;
  locationError: string | null;
  handleGetCurrentLocation: () => Promise<void>;
  resetLocation: () => void;
  
  // Providencias
  providencias: ProvidenciaTomada[];
  handleToggleProvidencia: (id: string) => void;
  resetProvidencias: () => void;
  
  // Text correction
  isCorrecting: boolean;
  isCorrectingText?: boolean;
  applyCorrection: () => void;
  toggleCorrection: () => void;
  handleCorrectText: () => Promise<void>;
  
  // Agents
  agents: AgentData[];
  agentsLoading?: boolean;
  agentsError?: string | null;
  selectedAgents: string[];
  handleAgentSelection: (agentId: string) => void;
  handleAgentSelect: (agentId: string) => void;
  resetAgents: () => void;
  
  // Form actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}
