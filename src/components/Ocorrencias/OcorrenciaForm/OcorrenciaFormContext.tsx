
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useGeolocation } from '@/hooks/use-geolocation';
import { MapMarker } from '@/types/maps';

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
  providencias: string;
  setProvidencias: (providencias: string) => void;
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
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [providencias, setProvidencias] = useState('');
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [agents, setAgents] = useState<AgentParticipation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState<MapMarker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  
  const { toast } = useToast();
  const { location } = useGeolocation();

  const addAttachment = (attachment: MediaAttachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
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
    
    try {
      const numero = `OCR-${Date.now().toString().slice(-6)}`;
      
      const ocorrenciaData = {
        numero,
        tipo,
        descricao,
        local,
        data: `${data} ${hora || '00:00'}`,
        status: 'Aberta',
        attachments: attachments.map(a => ({
          id: a.id,
          type: a.type,
          description: a.description,
          url: a.preview  // This is temporary - would need to upload files to storage
        }))
      };
      
      // Upload to Supabase
      const { data: insertedData, error } = await supabase
        .from('ocorrencias')
        .insert(ocorrenciaData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Ocorrência registrada",
        description: `Ocorrência ${numero} registrada com sucesso.`,
      });
      
      // Reset form
      setTipo('');
      setDescricao('');
      setLocal('');
      setData('');
      setHora('');
      setProvidencias('');
      setAttachments([]);
      setAgents([]);
      setPosition(null);
      
    } catch (error) {
      console.error('Error submitting occurrence:', error);
      toast({
        title: "Erro ao registrar",
        description: "Não foi possível registrar a ocorrência. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
    setShowCameraDialog
  };

  return (
    <OcorrenciaContext.Provider value={value}>
      {children}
    </OcorrenciaContext.Provider>
  );
};
