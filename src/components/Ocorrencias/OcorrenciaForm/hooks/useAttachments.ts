
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { MediaAttachment } from '../types';

export const useAttachments = () => {
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
    toast.info('Anexo removido');
  };

  const updateAttachmentDescription = (id: string, description: string) => {
    setAttachments(attachments.map(attachment => 
      attachment.id === id ? { ...attachment, description } : attachment
    ));
  };

  const addAttachment = (attachment: MediaAttachment) => {
    setAttachments(prev => [...prev, attachment]);
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

  const startCamera = () => {
    setShowCameraDialog(true);
  };

  const resetAttachments = () => {
    setAttachments([]);
  };

  return {
    attachments,
    fileInputRef,
    videoInputRef,
    showCameraDialog,
    setShowCameraDialog,
    handleFileSelect,
    removeAttachment,
    updateAttachmentDescription,
    addAttachment,
    handleDocumentSelect,
    startCamera,
    resetAttachments
  };
};
