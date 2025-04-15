
import { MapMarker } from '@/types/maps';

export type OcorrenciaStatus = 'Aberta' | 'Encerrada' | 'Encaminhada' | 'Sob Investigação';
export type OcorrenciaTipo = 'Trânsito' | 'Crime' | 'Dano ao patrimônio público' | 'Maria da Penha' | 'Apoio a outra instituição' | 'Outros';
export type VinculoOcorrencia = 'Vítima' | 'Suspeito' | 'Testemunha';
export type EstadoAparente = 'Lúcido' | 'Alterado' | 'Ferido';

export interface Envolvido {
  nome: string;
  apelido?: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  endereco: string;
  telefone: string;
  vinculo: VinculoOcorrencia;
  estadoAparente: EstadoAparente;
}

export interface ProvidenciaTomada {
  id: string;
  label: string;
  checked: boolean;
}

export interface MediaAttachment {
  id: string;
  file: File | null;
  preview: string;
  type: 'image' | 'document' | 'video';
  description: string;
}

export interface AgentParticipation {
  id: string;
  name: string;
  role: string;
  nome: string;
  patente: string;
}

export interface OcorrenciaContextType {
  // Form data
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
  
  // Agents
  agents: AgentParticipation[];
  agentsLoading: boolean;
  agentsError: string | null;
  selectedAgents: string[];
  handleAgentSelection: (agentId: string) => void;
  
  // Location
  position: MapMarker | null;
  setPosition: (position: MapMarker | null) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  handleMapClick: (marker: MapMarker) => void;
  locationLoading: boolean;
  locationError: string | null;
  handleGetCurrentLocation: () => Promise<void>;
  
  // Text correction
  isCorrectingText: boolean;
  handleCorrectText: () => Promise<void>;
  
  // Attachments
  attachments: MediaAttachment[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document' | 'video') => void;
  removeAttachment: (id: string) => void;
  updateAttachmentDescription: (id: string, description: string) => void;
  handleDocumentSelect: () => void;
  
  // Camera
  showCameraDialog: boolean;
  setShowCameraDialog: (show: boolean) => void;
  startCamera: () => void;
  addAttachment: (attachment: MediaAttachment) => void;
  
  // Providencias
  providencias: ProvidenciaTomada[];
  handleToggleProvidencia: (id: string) => void;
  
  // Form actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  resetForm: () => void;
}
