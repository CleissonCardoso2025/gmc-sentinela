
import React, { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, FileUp, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EtapaProps {
  etapa: {
    id: string;
    nome: string;
    concluida: boolean;
    data: string;
    responsavel: string;
    descricao: string;
  };
  onComplete: () => void;
}

export function EtapaInvestigacao({ etapa, onComplete }: EtapaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  
  const handleSaveChanges = () => {
    setIsEditing(false);
  };
  
  const handleComplete = () => {
    onComplete();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => file.name);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  return (
    <Accordion type="single" collapsible className="border rounded-lg">
      <AccordionItem value={`etapa-${etapa.id}`} className="border-b-0">
        <AccordionTrigger className="px-4 py-2 hover:no-underline">
          <div className="flex items-center gap-2 text-left">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${etapa.concluida ? 'bg-green-500' : 'bg-gray-200'}`}>
              {etapa.concluida && <Check className="h-4 w-4 text-white" />}
              {!etapa.concluida && <span className="text-sm">•</span>}
            </div>
            <div>
              <h4 className="text-sm font-medium">{etapa.nome}</h4>
              <p className="text-xs text-muted-foreground">{etapa.data} • {etapa.responsavel}</p>
            </div>
          </div>
          {etapa.concluida && <Badge className="ml-auto mr-2 bg-green-500">Concluída</Badge>}
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="pl-8 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input type="date" defaultValue={new Date(etapa.data).toISOString().split('T')[0]} className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Responsável</label>
                  <Input defaultValue={etapa.responsavel} className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Descrição das Ações</label>
                  <Textarea 
                    defaultValue={etapa.descricao}
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Evidências</label>
                  <div className="flex mt-1">
                    <Input type="file" multiple onChange={handleFileChange} />
                    <Button type="button" variant="outline" size="sm" className="ml-2">
                      <FileUp className="h-4 w-4 mr-2" />
                      Anexar
                    </Button>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-sm font-medium mb-1">Arquivos anexados:</p>
                    {files.map((file, index) => (
                      <p key={index} className="text-sm">{file}</p>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveChanges}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">{etapa.descricao}</p>
                
                {etapa.concluida && (
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-sm font-medium mb-1">Evidências:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm bg-white p-1 rounded border">depoimento_{etapa.id.substring(0, 4)}.pdf</div>
                      <div className="text-sm bg-white p-1 rounded border">relatorio_{etapa.id.substring(0, 4)}.docx</div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2">
                  {!etapa.concluida && (
                    <Button 
                      size="sm" 
                      onClick={handleComplete}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Marcar como Concluída
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
