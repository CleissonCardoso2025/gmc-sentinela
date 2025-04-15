
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Video, Square } from 'lucide-react';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const CameraDialog = () => {
  const {
    videoRef,
    canvasRef,
    isRecording,
    capturePhoto,
    startRecording,
    stopRecording,
    closeCamera,
    showCameraDialog,
    setShowCameraDialog
  } = useOcorrenciaForm();

  return (
    <Dialog open={showCameraDialog} onOpenChange={setShowCameraDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Capturar Mídia</DialogTitle>
          <DialogDescription>
            Capture uma foto ou vídeo usando sua câmera
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="relative bg-black rounded-md overflow-hidden h-[300px]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <>
                <Button type="button" onClick={capturePhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  Tirar Foto
                </Button>
                <Button type="button" onClick={startRecording} variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Iniciar Gravação
                </Button>
              </>
            ) : (
              <Button type="button" onClick={stopRecording} variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Parar Gravação
              </Button>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeCamera}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDialog;
