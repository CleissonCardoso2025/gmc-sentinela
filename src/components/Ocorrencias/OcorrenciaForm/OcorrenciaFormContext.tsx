
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useGeolocation } from '@/hooks/use-geolocation';
import { MapMarker } from '@/types/maps';
import { useAgentsData } from '@/hooks/use-agents-data';

export type MediaAttachment = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
  description: string;
};

export type AgentParticipation = {
  id: string;
  name: string;
  role: string;
  nome?: string; // Added for compatibility
  patente?: string; // Added for compatibility
};

export type ProvidenciaTomada = {
  id: string;
  label: string;
  checked: boolean;
};

export interface OcorrenciaContextType {
  tipo: string;
  setTipo: (tipo: string) => void;
  descricao: string;
  setDescricao: (descricao: string) => void;
  local: string;
  setLocal: (local: string) => void;
  data: string;
  setData: (data: string) => void;
  hora: string;
  setHora: (hora: string) => void;
  providencias: ProvidenciaTomada[];
  setProvidencias: (providencias: ProvidenciaTomada[]) => void;
  attachments: MediaAttachment[];
  setAttachments: (attachments: MediaAttachment[]) => void;
  agents: AgentParticipation[];
  setAgents: (agents: AgentParticipation[]) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  addAttachment: (attachment: MediaAttachment) => void;
  removeAttachment: (id: string) => void;
  addAgent: (agent: AgentParticipation) => void;
  removeAgent: (id: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  position: MapMarker | null;
  setPosition: (position: MapMarker | null) => void;
  handleMapClick: (marker: MapMarker) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  showCameraDialog: boolean;
  setShowCameraDialog: (show: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document') => void;
  startCamera: () => void;
  handleDocumentSelect: () => void;
  updateAttachmentDescription: (id: string, description: string) => void;
  numero: string;
  setNumero: (numero: string) => void;
  status: string;
  setStatus: (status: string) => void;
  handleGetCurrentLocation: () => Promise<void>;
  locationLoading: boolean;
  locationError: string | null;
  handleCorrectText: () => Promise<void>;
  isCorrectingText: boolean;
  agentsLoading: boolean;
  agentsError: string | null;
  selectedAgents: string[];
  handleAgentSelection: (agentId: string) => void;
  handleToggleProvidencia: (id: string) => void;
  isLoading: boolean;
  resetForm: () => void;
}

const OcorrenciaContext = createContext<OcorrenciaContextType | undefined>(undefined);

export const useOcorrenciaForm = () => {
  const context = useContext(OcorrenciaContext);
  if (!context) {
    throw new Error('useOcorrenciaForm must be used within OcorrenciaFormProvider');
  }
  return context;
};

export const OcorrenciaFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [numero, setNumero] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BO-${year}${month}${day}-${randomDigits}`;
  });
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('Aberta');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(() => new Date().toTimeString().split(' ')[0].substring(0, 5));
  const [providencias, setProvidencias] = useState<ProvidenciaTomada[]>([
    { id: '1', label: 'Condução para Delegacia', checked: false },
    { id: '2', label: 'Orientação à vítima', checked: false },
    { id: '3', label: 'Relatório ao Ministério Público', checked: false },
    { id: '4', label: 'Encaminhamento médico', checked: false },
    { id: '5', label: 'Registro de Boletim de Ocorrência', checked: false },
    { id: '6', label: 'Isolamento do local', checked: false },
  ]);
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [agents, setAgents] = useState<AgentParticipation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState<MapMarker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [isCorrectingText, setIsCorrectingText] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { location, loading: locationLoading, error: locationError, refreshPosition } = useGeolocation();
  const { agents: agentsList, isLoading: agentsLoading, error: agentsError } = useAgentsData();

  React.useEffect(() => {
    if (agentsList && agentsList.length > 0) {
      setAgents(agentsList.map(agent => ({
        id: agent.id,
        name: agent.nome,
        role: agent.patente || '',
        nome: agent.nome, // For compatibility
        patente: agent.patente // For compatibility
      })));
    }
  }, [agentsList]);

  const addAttachment = (attachment: MediaAttachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  const updateAttachmentDescription = (id: string, description: string) => {
    setAttachments(attachments.map(attachment => 
      attachment.id === id ? { ...attachment, description } : attachment
    ));
  };

  const addAgent = (agent: AgentParticipation) => {
    setAgents((prev) => [...prev, agent]);
  };

  const removeAgent = (id: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };
  
  const handleMapClick = (marker: MapMarker) => {
    setPosition(marker);
    setLocal(marker.address || `Localização: ${marker.lat.toFixed(6)}, ${marker.lng.toFixed(6)}`);
    setShowMap(false);
  };

  const handleGetCurrentLocation = async () => {
    try {
      toast({
        title: "Buscando localização",
        description: "Obtendo sua localização atual...",
      });
      
      refreshPosition();
      
      if (location.latitude && location.longitude) {
        setPosition({
          id: 'current-location',
          position: [location.latitude, location.longitude],
          title: 'Localização Atual',
          lat: location.latitude,
          lng: location.longitude,
          address: 'Obtendo endereço...'
        });
        
        try {
          const { data, error } = await supabase.functions.invoke('geocode', {
            body: { 
              address: `${location.latitude},${location.longitude}`, 
              reverse: true 
            }
          });
          
          if (error) {
            console.error('Error getting address:', error);
            toast({
              title: "Erro ao obter endereço",
              description: "Suas coordenadas foram salvas, mas não foi possível obter o endereço completo.",
              variant: "destructive"
            });
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            return;
          }
          
          if (data && data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setLocal(address);
            toast({
              title: "Localização obtida",
              description: "Endereço encontrado com sucesso.",
            });
          } else {
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            toast({
              title: "Localização obtida",
              description: "Endereço não identificado, apenas coordenadas.",
              // Fix: Use a valid variant instead of "warning"
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
          toast({
            title: "Localização obtida",
            description: "Endereço não identificado, apenas coordenadas.",
            // Fix: Use a valid variant instead of "warning"
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'document') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const newAttachment: MediaAttachment = {
          id: `attachment-${Date.now()}`,
          file,
          preview,
          type,
          description: '',
        };
        
        addAttachment(newAttachment);
        toast({
          title: "Anexo adicionado",
          description: `${type === 'image' ? 'Imagem' : type === 'video' ? 'Vídeo' : 'Documento'} anexado com sucesso`,
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setShowCameraDialog(true);
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
          toast({
            title: "Erro na câmera",
            description: "Não foi possível acessar a câmera",
            variant: "destructive"
          });
        });
    } else {
      toast({
        title: "Recurso não suportado",
        description: "Seu navegador não suporta acesso à câmera",
        variant: "destructive"
      });
    }
  };

  const handleDocumentSelect = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.txt';
    fileInput.onchange = (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          const newAttachment: MediaAttachment = {
            id: `attachment-${Date.now()}`,
            file,
            preview,
            type: 'document',
            description: '',
          };
          
          addAttachment(newAttachment);
          toast({
            title: "Documento anexado",
            description: "Documento adicionado com sucesso",
          });
        };
        
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleCorrectText = async () => {
    if (!descricao.trim()) {
      toast({
        title: "Texto vazio",
        description: "Por favor, escreva uma descrição primeiro",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCorrectingText(true);
      toast({
        title: "Corrigindo texto",
        description: "Processando seu texto...",
      });

      const { data, error } = await supabase.functions.invoke('text-correction', {
        body: { text: descricao }
      });

      if (error) {
        throw error;
      }

      if (data && data.correctedText) {
        setDescricao(data.correctedText);
        toast({
          title: "Texto corrigido",
          description: "O texto foi corrigido com sucesso",
        });
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro ao corrigir texto:', error);
      toast({
        title: "Erro na correção",
        description: "Não foi possível corrigir o texto. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsCorrectingText(false);
    }
  };
  
  const handleAgentSelection = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };
  
  const handleToggleProvidencia = (id: string) => {
    setProvidencias(providencias.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const resetForm = () => {
    setTipo('');
    setStatus('Aberta');
    setLocal('');
    setDescricao('');
    setPosition(null);
    setProvidencias(providencias.map(p => ({ ...p, checked: false })));
    setSelectedAgents([]);
    setAttachments([]);
    
    // Generate new occurrence number
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setNumero(`BO-${year}${month}${day}-${randomDigits}`);
    
    // Reset date and time to current
    setData(new Date().toISOString().split('T')[0]);
    setHora(new Date().toTimeString().split(' ')[0].substring(0, 5));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipo || !descricao || !local || !data) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      const ocorrenciaData = {
        numero,
        tipo,
        descricao,
        local,
        data: `${data} ${hora || '00:00'}`,
        status: status || 'Aberta',
        providencias_tomadas: providencias.filter(p => p.checked).map(p => p.label),
        agentes_envolvidos: selectedAgents,
        attachments: attachments.map(a => ({
          id: a.id,
          type: a.type,
          description: a.description,
          url: a.preview  // This is temporary - would need to upload files to storage
        })),
        latitude: position?.lat,
        longitude: position?.lng,
      };
      
      // Upload to Supabase
      const { error } = await supabase
        .from('ocorrencias')
        .insert(ocorrenciaData);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Ocorrência registrada",
        description: `Ocorrência ${numero} registrada com sucesso.`,
      });
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error submitting occurrence:', error);
      toast({
        title: "Erro ao registrar",
        description: "Não foi possível registrar a ocorrência. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const value: OcorrenciaContextType = {
    tipo,
    setTipo,
    descricao,
    setDescricao,
    local,
    setLocal,
    data,
    setData,
    hora,
    setHora,
    providencias,
    setProvidencias,
    attachments,
    setAttachments,
    agents,
    setAgents,
    isSubmitting,
    setIsSubmitting,
    addAttachment,
    removeAttachment,
    addAgent,
    removeAgent,
    handleSubmit,
    position,
    setPosition,
    handleMapClick,
    showMap,
    setShowMap,
    showCameraDialog,
    setShowCameraDialog,
    fileInputRef,
    videoInputRef,
    handleFileSelect,
    startCamera,
    handleDocumentSelect,
    updateAttachmentDescription,
    numero,
    setNumero,
    status,
    setStatus,
    handleGetCurrentLocation,
    locationLoading,
    locationError,
    handleCorrectText,
    isCorrectingText,
    agentsLoading,
    agentsError,
    selectedAgents,
    handleAgentSelection,
    handleToggleProvidencia,
    isLoading,
    resetForm
  };

  return (
    <OcorrenciaContext.Provider value={value}>
      {children}
    </OcorrenciaContext.Provider>
  );
};
