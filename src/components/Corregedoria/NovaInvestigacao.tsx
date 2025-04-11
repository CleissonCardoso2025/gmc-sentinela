
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
import { FileUp, Save, X, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

export function NovaInvestigacao({ onComplete }: NovaInvestigacaoProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isCorrigindoMotivo, setIsCorrigindoMotivo] = useState<boolean>(false);
  const [isCorrigindoRelato, setIsCorrigindoRelato] = useState<boolean>(false);
  const [usuarios, setUsuarios] = useState<{id: string, nome: string}[]>([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(true);
  
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
        toast({
          title: 'Erro ao carregar usuários',
          description: 'Não foi possível carregar a lista de usuários.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUsuarios(false);
      }
    };
    
    fetchUsuarios();
  }, [toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Find the selected user name
      const selectedUser = usuarios.find(user => user.id === values.investigadoId);
      
      if (!selectedUser) {
        throw new Error('Usuário selecionado não encontrado');
      }
      
      const numero = `SIN-${Math.floor(Math.random() * 10000)}`;
      
      // Save to database
      const { data, error } = await supabase
        .from('investigacoes')
        .insert([
          {
            numero,
            dataabertura: new Date().toLocaleDateString('pt-BR'),
            investigado: selectedUser.nome,
            motivo: values.motivoInvestigacao,
            status: 'Em andamento',
            etapaatual: 'Abertura',
            relatoinicial: values.relatoInicial
          }
        ]);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Sindicância aberta com sucesso",
        description: `Sindicância contra ${selectedUser.nome} registrada. Número: ${numero}`,
      });
      
      form.reset();
      setFiles([]);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
      
    } catch (error) {
      console.error('Erro ao salvar sindicância:', error);
      toast({
        title: 'Erro ao abrir sindicância',
        description: 'Não foi possível registrar a sindicância. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const corrigirTexto = async (campo: 'motivoInvestigacao' | 'relatoInicial') => {
    const texto = form.getValues(campo);
    
    if (!texto.trim()) {
      toast({
        title: "Erro",
        description: "Não há texto para corrigir.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      campo === 'motivoInvestigacao' ? setIsCorrigindoMotivo(true) : setIsCorrigindoRelato(true);
      
      const { data, error } = await supabase.functions.invoke('text-correction', {
        body: {
          text: texto
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.correctedText) {
        form.setValue(campo, data.correctedText);
        toast({
          title: "Sucesso",
          description: "Texto corrigido com sucesso!",
        });
      } else {
        throw new Error('Não foi possível obter o texto corrigido.');
      }
    } catch (error) {
      console.error('Erro ao corrigir texto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível corrigir o texto. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      campo === 'motivoInvestigacao' ? setIsCorrigindoMotivo(false) : setIsCorrigindoRelato(false);
    }
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
                        <SelectTrigger>
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
                    <Button type="button" size="sm" variant="outline">
                      <FileUp className="h-4 w-4 mr-2" />
                      Anexar
                    </Button>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="bg-slate-50 p-2 rounded-md">
                      <p className="text-sm font-medium mb-1">Arquivos anexados:</p>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li key={index} className="text-sm flex justify-between items-center">
                            <span className="truncate">{file.name}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeFile(index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
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
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Abrir Sindicância
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
