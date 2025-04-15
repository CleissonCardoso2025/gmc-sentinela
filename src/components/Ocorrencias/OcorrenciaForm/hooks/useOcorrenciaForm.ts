
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAttachments } from './useAttachments';
import { useLocation } from './useLocation';
import { useProvidencias } from './useProvidencias';
import { useTextCorrection } from './useTextCorrection';
import { useAgents } from './useAgents';

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

  const { toast } = useToast();

  // Custom hooks
  const attachmentsHook = useAttachments();
  const locationHook = useLocation(setLocal);
  const providenciasHook = useProvidencias();
  const textCorrectionHook = useTextCorrection(descricao, setDescricao);
  const agentsHook = useAgents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!local || !descricao) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const dateTime = `${data}T${hora}`;
      
      const uploadedAttachments = [];
      
      if (attachmentsHook.attachments.length > 0) {
        for (const attachment of attachmentsHook.attachments) {
          if (attachment.file) {
            const fileExt = attachment.file.name.split('.').pop();
            const filePath = `${numero}/${attachment.id}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('ocorrencia-attachments')
              .upload(filePath, attachment.file);
              
            if (uploadError) {
              console.error('Error uploading file:', uploadError);
              toast({
                title: "Erro",
                description: `Erro ao enviar anexo: ${attachment.file.name}`,
                variant: "destructive"
              });
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
        data: dateTime,
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
      
      toast({
        title: "Sucesso",
        description: "Ocorrência registrada com sucesso!"
      });
      
      resetForm();
      
    } catch (error) {
      console.error('Error saving occurrence:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar ocorrência. Tente novamente.",
        variant: "destructive"
      });
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
    attachmentsHook.resetAttachments();
    
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
    ...attachmentsHook,
    
    // Location
    ...locationHook,
    
    // Providencias
    ...providenciasHook,
    
    // Text correction
    ...textCorrectionHook,
    
    // Agents
    ...agentsHook,
    
    // Form actions
    handleSubmit,
    resetForm
  };
};
