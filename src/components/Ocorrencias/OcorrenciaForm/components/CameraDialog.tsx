
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Camera, Video } from 'lucide-react';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const CameraDialog = () => {
  const { showCameraDialog, setShowCameraDialog, addAttachment } = useOcorrenciaForm();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: mode === 'video' 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, [mode]);
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handleClose = () => {
    stopCamera();
    setShowCameraDialog(false);
  };
  
  const takePhoto = async () => {
    if (!videoRef.current || !streamRef.current) return;
    
    try {
      const videoElement = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        // Convert to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          
          const fileName = `photo-${Date.now()}.png`;
          const file = new Blob([blob], { type: 'image/png' });
          const photoFile = new File([file], fileName, { type: 'image/png' });
          
          const newAttachment = {
            id: `attachment-${Date.now()}`,
            file: photoFile,
            preview: imageDataUrl,
            type: 'image' as const,
            description: 'Foto capturada pela câmera',
          };
          
          addAttachment(newAttachment);
          handleClose();
        };
        
        reader.readAsDataURL(blob);
      }, 'image/png');
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };
  
  const startRecording = () => {
    if (!streamRef.current) return;
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        
        // Convert to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const videoDataUrl = e.target?.result as string;
          const fileName = `video-${Date.now()}.webm`;
          const file = new Blob([blob], { type: 'video/webm' });
          const videoFile = new File([file], fileName, { type: 'video/webm' });
          
          const videoUrl = URL.createObjectURL(blob);
          
          const newAttachment = {
            id: `attachment-${Date.now()}`,
            file: videoFile,
            preview: videoUrl,
            type: 'video' as const,
            description: 'Vídeo capturado pela câmera',
          };
          
          addAttachment(newAttachment);
          handleClose();
        };
        
        reader.readAsDataURL(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  React.useEffect(() => {
    if (showCameraDialog) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [showCameraDialog, startCamera]);
  
  const switchMode = (newMode: 'photo' | 'video') => {
    setMode(newMode);
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 300);
  };
  
  return (
    <Dialog open={showCameraDialog} onOpenChange={setShowCameraDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'photo' ? 'Capturar Foto' : 'Gravar Vídeo'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-64 bg-black rounded-md object-cover"
          />
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button 
              size="sm" 
              variant={mode === 'photo' ? 'default' : 'outline'} 
              onClick={() => switchMode('photo')}
              disabled={isRecording}
            >
              <Camera size={16} className="mr-1" />
              Foto
            </Button>
            <Button 
              size="sm" 
              variant={mode === 'video' ? 'default' : 'outline'} 
              onClick={() => switchMode('video')}
              disabled={isRecording}
            >
              <Video size={16} className="mr-1" />
              Vídeo
            </Button>
          </div>
          
          {isRecording && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm flex items-center">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse mr-2"></span>
              Gravando...
            </div>
          )}
        </div>
        
        <DialogFooter>
          {mode === 'photo' ? (
            <Button onClick={takePhoto}>Capturar</Button>
          ) : (
            isRecording ? (
              <Button variant="destructive" onClick={stopRecording}>Parar Gravação</Button>
            ) : (
              <Button onClick={startRecording}>Iniciar Gravação</Button>
            )
          )}
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDialog;
