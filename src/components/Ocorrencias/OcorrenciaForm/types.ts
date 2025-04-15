
import { MapMarker } from '@/types/maps';

export interface MediaAttachment {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'document' | 'video';
  description: string;
}

export interface ProvidenciaTomada {
  id: string;
  label: string;
  checked: boolean;
}

export interface AgentData {
  id: string;
  name: string;
  role?: string;
  nome: string;
  patente?: string;
}

export interface AgentParticipation {
  id: string;
  name: string;
  role?: string;
  nome: string;
  patente?: string;
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
  setShowCameraDialog: (value: boolean) => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document' | 'video') => void;
  removeAttachment: (id: string) => void;
  updateAttachmentDescription: (id: string, description: string) => void;
  addAttachment: (attachment: MediaAttachment) => void;
  handleAddAttachment: (file: File, type: string, description: string) => void;
  handleRemoveAttachment: (id: string) => void;
  handleUpdateAttachment: (id: string, description: string) => void;
  handleDocumentSelect: () => void;
  startCamera: () => void;
  resetAttachments: () => void;
  
  // Location
  position: MapMarker | null;
  setPosition: (value: MapMarker | null) => void;
  showMap: boolean;
  setShowMap: (value: boolean) => void;
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
  isCorrectingText: boolean;
  applyCorrection: () => void;
  toggleCorrection: () => void;
  handleCorrectText: () => Promise<void>;
  
  // Agents
  agents: AgentParticipation[];
  agentsLoading: boolean;
  agentsError: any;
  selectedAgents: string[];
  handleAgentSelection: (agentId: string) => void;
  handleAgentSelect: (agentId: string) => void; // Alias for compatibility
  resetAgents: () => void;
  
  // Form actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}
