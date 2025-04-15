
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Paperclip, FileImage, Camera, Video, File, Trash2 } from 'lucide-react';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const AnexosOcorrencia = () => {
  const {
    attachments,
    fileInputRef,
    videoInputRef,
    handleFileSelect,
    startCamera,
    handleDocumentSelect,
    removeAttachment,
    updateAttachmentDescription
  } = useOcorrenciaForm();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center text-gcm-600">
          <Paperclip className="mr-2 h-5 w-5" />
          Anexos da Ocorrência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-gcm-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileImage className="mr-1 h-4 w-4" />
              Anexar Imagem
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'image')}
              accept="image/*"
            />
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-gcm-500"
              onClick={startCamera}
            >
              <Camera className="mr-1 h-4 w-4" />
              Tirar Foto
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-gcm-500"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="mr-1 h-4 w-4" />
              Anexar Vídeo
            </Button>
            <input
              type="file"
              ref={videoInputRef}
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'video')}
              accept="video/*"
            />
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-gcm-500"
              onClick={startCamera}
            >
              <Video className="mr-1 h-4 w-4" />
              Gravar Vídeo
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="text-gcm-500"
              onClick={handleDocumentSelect}
            >
              <File className="mr-1 h-4 w-4" />
              Anexar Documento
            </Button>
          </div>
          
          {attachments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={
                      attachment.type === 'image' 
                        ? "bg-blue-50 text-blue-800 border-blue-200" 
                        : attachment.type === 'video'
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                    }>
                      {attachment.type === 'image' ? 'Imagem' : attachment.type === 'video' ? 'Vídeo' : 'Documento'}
                    </Badge>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeAttachment(attachment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {attachment.type === 'image' && (
                    <div className="h-32 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={attachment.preview} 
                        alt="Attachment preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {attachment.type === 'video' && (
                    <div className="h-32 bg-gray-100 rounded-md overflow-hidden">
                      <video 
                        src={attachment.preview} 
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                  )}
                  
                  {attachment.type === 'document' && (
                    <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center">
                      <File className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <Label htmlFor={`description-${attachment.id}`} className="text-xs">
                      Descrição
                    </Label>
                    <Input
                      id={`description-${attachment.id}`}
                      value={attachment.description}
                      onChange={(e) => updateAttachmentDescription(attachment.id, e.target.value)}
                      placeholder="Descreva este anexo"
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md border border-dashed">
              <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p>Nenhum anexo adicionado</p>
              <p className="text-sm">Clique em um dos botões acima para adicionar fotos, vídeos ou documentos</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnexosOcorrencia;
