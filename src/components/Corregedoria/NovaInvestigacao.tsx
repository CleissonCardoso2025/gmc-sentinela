import React, { useState, useEffect } from 'react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  FileUp, 
  Save, 
  X, 
  Wand2, 
  Calendar, 
  User 
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createInvestigacao } from '@/services/investigacaoService/apiInvestigacaoService';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface NovaInvestigacaoProps {
  onComplete?: () => void;
}

const formSchema = z.object({
  motivoInvestigacao: z.string().min(10, 'O motivo deve ter pelo menos 10 caracteres'),
  investigadoId: z.string().min(1, 'Selecione um investigado'),
  relatoInicial: z.string().min(20, 'O relato inicial deve ter pelo menos 20 caracteres'),
});

type FileWithPreview = {
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  description: string;
};

export function NovaInvestigacao({ onComplete }: NovaInvestigacaoProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isCorrigindoMotivo, setIsCorrigindoMotivo] = useState<boolean>(false);
  const [isCorrigindoRelato, setIsCorrigindoRelato] = useState<boolean>(false);
  const [usuarios, setUsuarios] = useState<{id: string, nome: string}[]>([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      motivoInvestigacao: '',
      investigadoId: '',
      relatoInicial: '',
    },
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoadingUsuarios(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, nome')
          .order('nome');
          
        if (error) {
          throw error;
        }
        
        setUsuarios(data || []);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast.error('Não foi possível carregar a lista de usuários.');
      } finally {
        setIsLoadingUsuarios(false);
      }
    };
    
    fetchUsuarios();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const selectedUser = usuarios.find(user => user.id === values.investigadoId);
      
      if (!selectedUser) {
        throw new Error('Usuário selecionado não encontrado');
      }
      
      // Generate a unique investigation number
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const random = Math.floor(10000 + Math.random() * 90000);
      const numero = `SIN-${year}${month}${day}-${random}`;
      
      // Upload files if any
      const uploadedFiles = [];
      
      if (files.length > 0) {
        for (const fileObj of files) {
          const file = fileObj.file;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${fileObj.name}`;
          const filePath = `investigacoes/${numero}/${fileName}`;
          
          try {
            // Update progress state for this file
            const fileId = fileName;
            setUploadProgress(prev => ({...prev, [fileId]: 0}));
            
            // Upload file without progress tracking (Supabase JS client doesn't support progress)
            const { data, error } = await supabase.storage
              .from('investigacoes')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });
              
            // Manually set progress to 100% when complete
            setUploadProgress(prev => ({...prev, [fileId]: 100}));
              
            if (error) {
              console.error('Error uploading file:', error);
              toast.error(`Erro ao enviar arquivo ${file.name}: ${error.message}`);
              continue;
            }
            
            // Get the public URL for the file
            const { data: { publicUrl } } = supabase.storage
              .from('investigacoes')
              .getPublicUrl(filePath);
              
            uploadedFiles.push({
              id: fileId,
              path: filePath,
              name: fileObj.name,
              type: fileObj.type,
              description: fileObj.description,
              uploaded_at: new Date().toISOString()
            });
          } catch (error) {
            console.error('Error in file upload:', error);
            toast.error(`Erro ao enviar arquivo ${file.name}`);
          }
        }
      }
      
      const result = await createInvestigacao({
        numero,
        dataAbertura: new Date().toLocaleDateString('pt-BR'),
        investigado: selectedUser.nome,
        motivo: values.motivoInvestigacao,
        status: 'Em andamento',
        etapaAtual: 'Abertura',
        relatoInicial: values.relatoInicial
      }, uploadedFiles);
      
      if (!result) {
        throw new Error('Falha ao criar sindicância');
      }
      
      toast.success(
        "Sindicância aberta com sucesso", 
        { description: `Sindicância contra ${selectedUser.nome} registrada. Número: ${numero}` }
      );
      
      form.reset();
      setFiles([]);
      
      if (onComplete) {
        onComplete();
      }
      
    } catch (error) {
      console.error('Erro ao salvar sindicância:', error);
      toast.error(
        'Erro ao abrir sindicância', 
        { description: 'Não foi possível registrar a sindicância. Tente novamente.' }
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => {
        return {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          description: ''
        };
      });
      
      // Create previews for image files
      newFiles.forEach(fileObj => {
        if (fileObj.file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              setFiles(prevFiles => 
                prevFiles.map(f => 
                  f.name === fileObj.name ? {...f, preview: e.target!.result as string} : f
                )
              );
            }
          };
          reader.readAsDataURL(fileObj.file);
        }
      });
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const updateFileDescription = (index: number, description: string) => {
    setFiles(files.map((file, i) => 
      i === index ? {...file, description} : file
    ));
  };

  const corrigirTexto = async (campo: 'motivoInvestigacao' | 'relatoInicial') => {
    const texto = form.getValues(campo);
    
    if (!texto.trim()) {
      toast.error("Não há texto para corrigir.");
      return;
    }
    
    try {
      campo === 'motivoInvestigacao' ? setIsCorrigindoMotivo(true) : setIsCorrigindoRelato(true);
      
      // Use the dedicated Edge Function for text correction
      const { data, error } = await supabase.functions.invoke('investigation-text-correction', {
        body: {
          text: texto
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.correctedText) {
        form.setValue(campo, data.correctedText);
        toast.success("Texto corrigido com sucesso!");
      } else {
        throw new Error('Não foi possível obter o texto corrigido.');
      }
    } catch (error) {
      console.error('Erro ao corrigir texto:', error);
      toast.error("Não foi possível corrigir o texto. Tente novamente mais tarde.");
    } finally {
      campo === 'motivoInvestigacao' ? setIsCorrigindoMotivo(false) : setIsCorrigindoRelato(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🔊';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    return '📁';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                control={form.control}
                name="motivoInvestigacao"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Motivo da Investigação</FormLabel>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => corrigirTexto('motivoInvestigacao')} 
                        disabled={isCorrigindoMotivo || !form.getValues('motivoInvestigacao')}
                        className="flex items-center gap-1"
                      >
                        {isCorrigindoMotivo ? (
                          <>
                            <span className="animate-spin mr-1">⟳</span>
                            Corrigindo...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3" />
                            Corrigir Texto
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva detalhadamente o motivo da sindicância" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="investigadoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Investigado</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingUsuarios}
                      >
                        <SelectTrigger className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder={isLoadingUsuarios ? "Carregando usuários..." : "Selecione um investigado"} />
                        </SelectTrigger>
                        <SelectContent>
                          {usuarios.map((usuario) => (
                            <SelectItem key={usuario.id} value={usuario.id}>
                              {usuario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-4">
                <FormLabel>Documentos e Evidências</FormLabel>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      Anexar
                    </Button>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                      <p className="text-sm font-medium mb-2">Arquivos anexados:</p>
                      <ul className="space-y-3">
                        {files.map((file, index) => (
                          <li key={index} className="text-sm">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getFileIcon(file.type)}</span>
                                <div>
                                  <p className="font-medium truncate max-w-[180px]">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(index)}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {uploadProgress[file.name] !== undefined && (
                              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full" 
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                ></div>
                              </div>
                            )}
                            
                            <Input
                              type="text"
                              placeholder="Adicionar descrição do arquivo"
                              value={file.description}
                              onChange={(e) => updateFileDescription(index, e.target.value)}
                              className="mt-1 text-xs h-7"
                            />
                            
                            {file.preview && (
                              <div className="mt-2 h-20 w-20 rounded border overflow-hidden">
                                <img 
                                  src={file.preview} 
                                  alt={file.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="relatoInicial"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Relato Inicial do Ocorrido</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => corrigirTexto('relatoInicial')} 
                    disabled={isCorrigindoRelato || !form.getValues('relatoInicial')}
                    className="flex items-center gap-1"
                  >
                    {isCorrigindoRelato ? (
                      <>
                        <span className="animate-spin mr-1">⟳</span>
                        Corrigindo...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3 w-3" />
                        Corrigir Texto
                      </>
                    )}
                  </Button>
                </div>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva detalhadamente o relato inicial do ocorrido" 
                    className="min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Forneça o máximo de detalhes possível sobre o ocorrido.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onComplete}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Abrir Sindicância
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
