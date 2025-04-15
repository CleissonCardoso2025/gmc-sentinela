
import React, { createContext, useState, useContext, useEffect } from 'react';
import { MediaAttachment, Envolvido, ProvidenciaTomada, OcorrenciaStatus, OcorrenciaTipo } from './types';
import { MapMarker } from '@/types/maps';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAgentsData } from '@/hooks/use-agents-data';
import { useGeolocation } from '@/hooks/use-geolocation';

interface OcorrenciaFormContextType {
  // Form fields
  numero: string;
  setNumero: (numero: string) => void;
  tipo: OcorrenciaTipo;
  setTipo: (tipo: OcorrenciaTipo) => void;
  status: OcorrenciaStatus;
  setStatus: (status: OcorrenciaStatus) => void;
  data: string;
  setData: (data: string) => void;
  hora: string;
  setHora: (hora: string) => void;
  local: string;
  setLocal: (local: string) => void;
  descricao: string;
  setDescricao: (descricao: string) => void;
  position: MapMarker | null;
  setPosition: (position: MapMarker | null) => void;
  envolvidos: Envolvido[];
  setEnvolvidos: (envolvidos: Envolvido[]) => void;
  showAddEnvolvido: boolean;
  setShowAddEnvolvido: (show: boolean) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  selectedAgents: string[];
  setSelectedAgents: (agents: string[]) => void;
  isCorrectingText: boolean;
  setIsCorrectingText: (isCorrectingText: boolean) => void;
  
  // Attachments
  attachments: MediaAttachment[];
  setAttachments: (attachments: MediaAttachment[]) => void;
  showCameraDialog: boolean;
  setShowCameraDialog: (show: boolean) => void;
  videoStream: MediaStream | null;
  setVideoStream: (stream: MediaStream | null) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  recordedChunks: Blob[];
  setRecordedChunks: (chunks: Blob[]) => void;
  
  // Providencias
  providencias: ProvidenciaTomada[];
  setProvidencias: (providencias: ProvidenciaTomada[]) => void;
  
  // Refs
  fileInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  
  // Data
  agents: any[];
  agentsLoading: boolean;
  agentsError: any;
  location: { latitude: number; longitude: number };
  locationLoading: boolean;
  locationError: string | null;
  refreshPosition: () => void;
  
  // Methods
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document' | 'video') => void;
  capturePhoto: () => void;
  startCamera: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  closeCamera: () => void;
  removeAttachment: (id: string) => void;
  updateAttachmentDescription: (id: string, description: string) => void;
  handleMapClick: (marker: MapMarker) => void;
  handleToggleProvidencia: (id: string) => void;
  handleAgentSelection: (agentId: string) => void;
  handleGetCurrentLocation: () => Promise<void>;
  handleCorrectText: () => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDocumentSelect: () => void;
  resetForm: () => void;
}

const OcorrenciaFormContext = createContext<OcorrenciaFormContextType | undefined>(undefined);

export const OcorrenciaFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState<OcorrenciaTipo>('Trânsito');
  const [status, setStatus] = useState<OcorrenciaStatus>('Aberta');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [envolvidos, setEnvolvidos] = useState<Envolvido[]>([]);
  const [showAddEnvolvido, setShowAddEnvolvido] = useState(false);
  const [position, setPosition] = useState<MapMarker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isCorrectingText, setIsCorrectingText] = useState(false);
  
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  
  const [providencias, setProvidencias] = useState<ProvidenciaTomada[]>([
    { id: '1', label: 'Condução para Delegacia', checked: false },
    { id: '2', label: 'Orientação à vítima', checked: false },
    { id: '3', label: 'Relatório ao Ministério Público', checked: false },
    { id: '4', label: 'Encaminhamento médico', checked: false },
    { id: '5', label: 'Registro de Boletim de Ocorrência', checked: false },
    { id: '6', label: 'Isolamento do local', checked: false },
  ]);

  const { agents, isLoading: agentsLoading, error: agentsError } = useAgentsData();
  const { location, loading: locationLoading, error: locationError, refreshPosition } = useGeolocation();

  useEffect(() => {
    const generateOcorrenciaNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `BO-${year}${month}${day}-${randomDigits}`;
    };

    setNumero(generateOcorrenciaNumber());
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().split(' ')[0].substring(0, 5);
    
    setData(formattedDate);
    setHora(formattedTime);
  }, []);

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document' | 'video') => {
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
        
        setAttachments(prev => [...prev, newAttachment]);
        toast.success(`${type === 'image' ? 'Imagem' : type === 'video' ? 'Vídeo' : 'Documento'} anexado com sucesso`);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        const imageDataUrl = canvasRef.current.toDataURL('image/png');
        
        fetch(imageDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const fileName = `photo-${Date.now()}.png`;
            
            // Create a File from the Blob with correct constructor usage
            const file = new File([blob], fileName);
            
            const newAttachment: MediaAttachment = {
              id: `attachment-${Date.now()}`,
              file,
              preview: imageDataUrl,
              type: 'image',
              description: 'Foto capturada pela câmera',
            };
            
            setAttachments(prev => [...prev, newAttachment]);
            toast.success('Foto capturada com sucesso');
          });
      }
    }
  };

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setVideoStream(stream);
          setShowCameraDialog(true);
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
          toast.error('Não foi possível acessar a câmera');
        });
    } else {
      toast.error('Seu navegador não suporta acesso à câmera');
    }
  };

  const startRecording = () => {
    if (videoStream && videoRef.current) {
      const mediaRecorder = new MediaRecorder(videoStream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const fileName = `video-${Date.now()}.webm`;
        
        const videoUrl = URL.createObjectURL(blob);
        
        const newAttachment: MediaAttachment = {
          id: `attachment-${Date.now()}`,
          file: null,
          preview: videoUrl,
          type: 'video',
          description: 'Vídeo capturado pela câmera',
        };
        
        setAttachments(prev => [...prev, newAttachment]);
        setRecordedChunks([]);
        toast.success('Vídeo gravado com sucesso');
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const fileName = `video-${Date.now()}.webm`;
        
        // Create a File from the Blob with correct constructor usage
        const file = new File([blob], fileName);
        
        const videoUrl = URL.createObjectURL(blob);
        
        const newAttachment: MediaAttachment = {
          id: `attachment-${Date.now()}`,
          file,
          preview: videoUrl,
          type: 'video',
          description: 'Vídeo capturado pela câmera',
        };
        
        setAttachments(prev => [...prev, newAttachment]);
        setRecordedChunks([]);
        toast.success('Vídeo gravado com sucesso');
      };
    }
  };

  const closeCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    
    setShowCameraDialog(false);
    setIsRecording(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
    toast.info('Anexo removido');
  };

  const updateAttachmentDescription = (id: string, description: string) => {
    setAttachments(attachments.map(attachment => 
      attachment.id === id ? { ...attachment, description } : attachment
    ));
  };

  const handleMapClick = (marker: MapMarker) => {
    setPosition(marker);
    setLocal(marker.address || 'Endereço não identificado');
    setShowMap(false);
  };

  const handleToggleProvidencia = (id: string) => {
    setProvidencias(providencias.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const handleAgentSelection = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      toast.info('Buscando sua localização atual...');
      
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
            toast.error('Não foi possível obter o endereço, mas suas coordenadas foram salvas');
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            return;
          }
          
          if (data && data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setLocal(address);
            toast.success('Localização atual obtida com sucesso');
          } else {
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            toast.warning('Localização obtida, mas sem endereço identificável');
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
          toast.warning('Localização obtida, mas sem endereço identificável');
        }
      } else if (locationError) {
        toast.error(locationError);
      } else {
        toast.error('Não foi possível obter sua localização. Verifique as permissões do navegador.');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error('Erro ao obter localização atual');
    }
  };

  const handleCorrectText = async () => {
    if (!descricao.trim()) {
      toast.error('Por favor, escreva uma descrição primeiro');
      return;
    }

    try {
      setIsCorrectingText(true);
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
      setIsCorrectingText(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!local || !descricao) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const dateTime = `${data}T${hora}`;
      
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
        data: dateTime,
        local,
        descricao,
        latitude: position?.lat,
        longitude: position?.lng,
        providencias: providencias.filter(p => p.checked).map(p => p.label),
        envolvidos,
        agentes_envolvidos: selectedAgents,
        attachments: uploadedAttachments,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('ocorrencias')
        .insert(ocorrenciaData);
      
      if (error) throw error;
      
      toast.success('Ocorrência registrada com sucesso!');
      
      resetForm();
      
    } catch (error) {
      console.error('Error saving occurrence:', error);
      toast.error('Erro ao registrar ocorrência. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTipo('Trânsito');
    setStatus('Aberta');
    setLocal('');
    setDescricao('');
    setPosition(null);
    setEnvolvidos([]);
    setProvidencias(providencias.map(p => ({ ...p, checked: false })));
    setSelectedAgents([]);
    setAttachments([]);
    
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setNumero(`BO-${year}${month}${day}-${randomDigits}`);
  };

  const handleDocumentSelect = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.txt';
    fileInput.onchange = (e) => {
      const inputEvent = e as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(inputEvent, 'document');
    };
    fileInput.click();
  };

  const value = {
    numero, setNumero,
    tipo, setTipo,
    status, setStatus,
    data, setData,
    hora, setHora,
    local, setLocal,
    descricao, setDescricao,
    position, setPosition,
    envolvidos, setEnvolvidos,
    showAddEnvolvido, setShowAddEnvolvido,
    showMap, setShowMap,
    isLoading, setIsLoading,
    selectedAgents, setSelectedAgents,
    isCorrectingText, setIsCorrectingText,
    
    attachments, setAttachments,
    showCameraDialog, setShowCameraDialog,
    videoStream, setVideoStream,
    isRecording, setIsRecording,
    recordedChunks, setRecordedChunks,
    
    providencias, setProvidencias,
    
    fileInputRef,
    videoInputRef,
    videoRef,
    canvasRef,
    mediaRecorderRef,
    
    agents,
    agentsLoading,
    agentsError,
    location,
    locationLoading,
    locationError,
    refreshPosition,
    
    handleFileSelect,
    capturePhoto,
    startCamera,
    startRecording,
    stopRecording,
    closeCamera,
    removeAttachment,
    updateAttachmentDescription,
    handleMapClick,
    handleToggleProvidencia,
    handleAgentSelection,
    handleGetCurrentLocation,
    handleCorrectText,
    handleSubmit,
    handleDocumentSelect,
    resetForm
  };

  return (
    <OcorrenciaFormContext.Provider value={value}>
      {children}
    </OcorrenciaFormContext.Provider>
  );
};

export const useOcorrenciaForm = () => {
  const context = useContext(OcorrenciaFormContext);
  if (context === undefined) {
    throw new Error('useOcorrenciaForm must be used within an OcorrenciaFormProvider');
  }
  return context;
};
