import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAttachments } from './OcorrenciaForm/hooks/useAttachments';
import { useLocation } from './OcorrenciaForm/hooks/useLocation';
import { useProvidencias } from './OcorrenciaForm/hooks/useProvidencias';
import { useTextCorrection } from './OcorrenciaForm/hooks/useTextCorrection';
import { useAgents } from './OcorrenciaForm/hooks/useAgents';
import { MediaAttachment } from './OcorrenciaForm/types';
import { MapMarker } from '@/types/maps';

export const useOcorrenciaForm = () => {
  // Form state
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);

  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Custom hooks
  const {
    attachments, 
    showCameraDialog, 
    setShowCameraDialog, 
    handleFileSelect, 
    removeAttachment, 
    updateAttachmentDescription, 
    addAttachment, 
    handleDocumentSelect, 
    startCamera, 
    resetAttachments
  } = useAttachments();

  const locationHook = useLocation(setLocal);
  const providenciasHook = useProvidencias();
  const textCorrectionHook = useTextCorrection(descricao, setDescricao);
  const agentsHook = useAgents();

  // For handling attachment operations mapped to the expected interface
  const handleAddAttachment = (file: File, type: string, description: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      const newAttachment: MediaAttachment = {
        id: `attachment-${Date.now()}`,
        file,
        preview,
        type: type as 'image' | 'document' | 'video',
        description,
      };
      addAttachment(newAttachment);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (id: string) => {
    removeAttachment(id);
  };

  const handleUpdateAttachment = (id: string, description: string) => {
    updateAttachmentDescription(id, description);
  };

  // Text correction functions
  const handleCorrectText = async () => {
    if (!descricao.trim()) {
      toast.error('Por favor, escreva uma descrição primeiro');
      return;
    }

    try {
      setIsCorrecting(true);
      toast.info('Corrigindo texto...');

      const { data, error } = await supabase.functions.invoke('text-correction', {
        body: { text: descricao }
      });

      if (error) {
        throw error;
      }

      if (data && data.correctedText) {
        setDescricao(data.correctedText);
        toast.success('Texto corrigido com sucesso');
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro ao corrigir texto:', error);
      toast.error('Não foi possível corrigir o texto. Tente novamente mais tarde.');
    } finally {
      setIsCorrecting(false);
    }
  };

  const applyCorrection = () => {
    // Implementation if needed
  };

  const toggleCorrection = () => {
    setIsCorrecting(!isCorrecting);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!local || !descricao) {
    toast.error('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  try {
    setIsLoading(true);

    const uploadedAttachments = [];

    if (attachments.length > 0) {
      for (const attachment of attachments) {
        if (attachment.file) {
          const fileExt = attachment.file.name.split('.').pop();
          const filePath = `${numero}/${attachment.id}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('ocorrencia-attachments')
            .upload(filePath, attachment.file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            toast.error(`Erro ao enviar anexo: ${attachment.file.name}`);
            continue;
          }

          uploadedAttachments.push({
            path: filePath,
            type: attachment.type,
            description: attachment.description
          });
        }
      }
    }

    const ocorrenciaData = {
      numero,
      tipo,
      status,
      data: new Date(`${data}T${hora}:00`).toISOString(), // ✅ Fixed date format
      local,
      descricao,
      latitude: locationHook.position?.lat,
      longitude: locationHook.position?.lng,
      providencias: providenciasHook.providencias.filter(p => p.checked).map(p => p.label),
      agentes_envolvidos: agentsHook.selectedAgents,
      attachments: uploadedAttachments,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('ocorrencias')
      .insert(ocorrenciaData);

    if (error) throw error;

    toast.success('Ocorrência registrada com sucesso!');

    // reset
    setTipo('Trânsito');
    setStatus('Aberta');
    setLocal('');
    setDescricao('');
    locationHook.setPosition(null);
    // setEnvolvidos([]); // removido pois não existe mais
    providenciasHook.setProvidencias(providenciasHook.providencias.map(p => ({ ...p, checked: false })));
    agentsHook.setSelectedAgents([]);
    resetAttachments();

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setNumero(`BO-${year}${month}${day}-${randomDigits}`);

  } catch (error) {
    console.error('Error saving occurrence:', error);
    toast.error('Erro ao registrar ocorrência. Tente novamente.');
  } finally {
    setIsLoading(false);
  }
};

  const resetForm = () => {
    // Reset basic form fields
    setTipo('');
    setStatus('Aberta');
    setLocal('');
    setDescricao('');
    
    // Reset other state using the hooks
    locationHook.resetLocation();
    providenciasHook.resetProvidencias();
    agentsHook.resetAgents();
    resetAttachments();
    
    // Generate a new occurrence number
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

  return {
    // Form state
    numero,
    setNumero,
    tipo,
    setTipo,
    status,
    setStatus,
    descricao,
    setDescricao,
    local,
    setLocal,
    data,
    setData,
    hora,
    setHora,
    isLoading,
    
    // Attachments
    attachments,
    fileInputRef,
    videoInputRef,
    showCameraDialog,
    setShowCameraDialog,
    handleFileSelect,
    removeAttachment,
    updateAttachmentDescription,
    addAttachment,
    handleAddAttachment,
    handleRemoveAttachment,
    handleUpdateAttachment,
    handleDocumentSelect,
    startCamera,
    resetAttachments,
    
    // Location
    position: locationHook.position,
    setPosition: locationHook.setPosition,
    showMap: locationHook.showMap,
    setShowMap: locationHook.setShowMap,
    handleMapClick: locationHook.handleMapClick,
    locationLoading: locationHook.locationLoading,
    locationError: locationHook.locationError,
    handleGetCurrentLocation: locationHook.handleGetCurrentLocation,
    resetLocation: locationHook.resetLocation,
    
    // Providencias
    providencias: providenciasHook.providencias,
    handleToggleProvidencia: providenciasHook.handleToggleProvidencia,
    resetProvidencias: providenciasHook.resetProvidencias,
    
    // Text correction
    isCorrecting,
    isCorrectingText: isCorrecting,
    applyCorrection,
    toggleCorrection,
    handleCorrectText,
    
    // Agents
    agents: agentsHook.agents,
    agentsLoading: agentsHook.agentsLoading,
    agentsError: agentsHook.agentsError,
    selectedAgents: agentsHook.selectedAgents,
    handleAgentSelection: agentsHook.handleAgentSelection,
    handleAgentSelect: agentsHook.handleAgentSelection, // Alias for compatibility
    resetAgents: agentsHook.resetAgents,
    
    // Form actions
    handleSubmit,
    resetForm
  };
};
