
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { EtapaInvestigacao } from './EtapaInvestigacao';
import { Calendar, Check, FileUp, Plus, Loader2, File, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Investigacao, InvestigacaoAnexo } from '@/types/database';
import { Etapa, getEtapasByInvestigacaoId, updateEtapaStatus, addEtapa } from '@/services/investigacaoService/etapaService';
import { updateInvestigacaoStatus, uploadAnexo, deleteAnexo } from '@/services/investigacaoService/apiInvestigacaoService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import EmptyState from '../Dashboard/EmptyState';

interface DetalhesInvestigacaoProps {
  sindicancia: Investigacao;
}

const novaEtapaSchema = z.object({
  nome: z.string().min(3, "O nome da etapa deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  responsavel: z.string().min(3, "O nome do responsável deve ter pelo menos 3 caracteres"),
  data: z.string().min(1, "A data é obrigatória")
});

type NovaEtapaForm = z.infer<typeof novaEtapaSchema>;

// Schema for upload anexo form
const anexoSchema = z.object({
  file: z.any().refine((file) => file instanceof File, {
    message: "Arquivo é obrigatório",
  }),
  description: z.string().optional(),
});

type AnexoForm = z.infer<typeof anexoSchema>;

export function DetalhesInvestigacao({ sindicancia }: DetalhesInvestigacaoProps) {
  const [status, setStatus] = useState(sindicancia.status);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [isLoadingEtapas, setIsLoadingEtapas] = useState(true);
  const [etapasError, setEtapasError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anexoDialogOpen, setAnexoDialogOpen] = useState(false);
  const [isUploadingAnexo, setIsUploadingAnexo] = useState(false);
  
  // Forms
  const etapaForm = useForm<NovaEtapaForm>({
    resolver: zodResolver(novaEtapaSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      responsavel: "",
      data: new Date().toISOString().split('T')[0]
    }
  });
  
  const anexoForm = useForm<AnexoForm>({
    resolver: zodResolver(anexoSchema),
    defaultValues: {
      file: undefined,
      description: ""
    }
  });

  // Fetch etapas data
  useEffect(() => {
    const fetchEtapas = async () => {
      setIsLoadingEtapas(true);
      setEtapasError(null);
      try {
        const data = await getEtapasByInvestigacaoId(sindicancia.id);
        if (data.length === 0) {
          setEtapasError("Nenhuma etapa encontrada para esta sindicância.");
        }
        setEtapas(data);
      } catch (err) {
        console.error("Error fetching etapas:", err);
        setEtapasError("Erro ao carregar as etapas da sindicância. Tente novamente mais tarde.");
      } finally {
        setIsLoadingEtapas(false);
      }
    };
    
    fetchEtapas();
  }, [sindicancia.id]);

  const handleStatusChange = async (newStatus: string) => {
    // Update the status in the database
    const success = await updateInvestigacaoStatus(sindicancia.id, newStatus, sindicancia.etapaAtual);
    
    if (success) {
      setStatus(newStatus);
      toast({
        title: "Status atualizado",
        description: `A sindicância ${sindicancia.numero} foi atualizada para: ${newStatus}`
      });
    }
  };
  
  const concluirEtapa = async (id: string) => {
    const success = await updateEtapaStatus(id, true);
    
    if (success) {
      // Update the local state
      setEtapas(prevEtapas => 
        prevEtapas.map(etapa => 
          etapa.id === id ? { ...etapa, concluida: true } : etapa
        )
      );
      
      toast({
        title: "Etapa concluída",
        description: `A etapa ${etapas.find(e => e.id === id)?.nome} foi marcada como concluída.`
      });
    }
  };
  
  const adicionarNovaEtapa = async (data: NovaEtapaForm) => {
    // Find the highest order number
    const highestOrder = etapas.reduce((max, etapa) => Math.max(max, etapa.ordem), 0);
    
    const novaEtapa = {
      investigacao_id: sindicancia.id,
      nome: data.nome,
      descricao: data.descricao,
      responsavel: data.responsavel,
      data: data.data,
      concluida: false,
      ordem: highestOrder + 1
    };
    
    const addedEtapa = await addEtapa(novaEtapa);
    
    if (addedEtapa) {
      setEtapas([...etapas, addedEtapa]);
      
      toast({
        title: "Nova etapa adicionada",
        description: `A etapa "${data.nome}" foi adicionada com sucesso.`
      });
      
      setDialogOpen(false);
      etapaForm.reset();
    }
  };

  const handleUploadAnexo = async (data: AnexoForm) => {
    setIsUploadingAnexo(true);
    try {
      const success = await uploadAnexo(sindicancia.id, data.file, data.description);
      
      if (success) {
        setAnexoDialogOpen(false);
        anexoForm.reset();
        // Refresh the page to get updated anexos
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading anexo:", error);
      toast({
        title: "Erro ao fazer upload do anexo",
        variant: "destructive"
      });
    } finally {
      setIsUploadingAnexo(false);
    }
  };

  const handleDeleteAnexo = async (anexoId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este anexo?")) {
      const success = await deleteAnexo(sindicancia.id, anexoId);
      if (success) {
        // Refresh the page to get updated anexos
        window.location.reload();
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return <Badge className="bg-amber-500">Em andamento</Badge>;
      case 'Concluída':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'Arquivada':
        return <Badge className="bg-gray-500">Arquivada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <File className="h-4 w-4 text-red-500" />;
    if (fileType.includes('image')) return <File className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('doc')) return <File className="h-4 w-4 text-blue-700" />;
    return <File className="h-4 w-4" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{sindicancia.numero}</h2>
          <p className="text-muted-foreground">Aberta em {sindicancia.dataAbertura}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar
          </Button>
          {status !== "Concluída" && (
            <Button size="sm" onClick={() => handleStatusChange("Concluída")}>
              <Check className="mr-2 h-4 w-4" />
              Concluir
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Detalhes da Sindicância</CardTitle>
              <CardDescription>Informações sobre a sindicância e o GMC investigado</CardDescription>
            </div>
            <div>{getStatusBadge(status)}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">GMC Investigado</h3>
              <p>{sindicancia.investigado}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Motivo da Investigação</h3>
              <p>{sindicancia.motivo}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-1">Relato Inicial</h3>
              <p className="text-sm">
                {sindicancia.relatoInicial || 
                "O GMC foi observado em possível desvio de conduta durante abordagem a um cidadão na Praça Central. Segundo relatos de testemunhas, houve excesso de força e tratamento desrespeitoso. O GMC alega que a abordagem seguiu os protocolos padrão e que o cidadão estava alterado e apresentou resistência."}
              </p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="font-semibold mb-2">Documentos Anexados</h3>
            {sindicancia.anexos && sindicancia.anexos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sindicancia.anexos.map((anexo) => (
                  <div key={anexo.id} className="bg-slate-50 p-2 rounded text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFileIcon(anexo.type)}
                      <span className="truncate max-w-[150px]">{anexo.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteAnexo(anexo.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon="file"
                title="Nenhum documento anexado"
                description="Adicione documentos relevantes para esta sindicância."
              />
            )}
            <Dialog open={anexoDialogOpen} onOpenChange={setAnexoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  <FileUp className="mr-2 h-4 w-4" />
                  Anexar Documentos
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Anexar Documento</DialogTitle>
                  <DialogDescription>
                    Selecione um arquivo para anexar à sindicância.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...anexoForm}>
                  <form onSubmit={anexoForm.handleSubmit(handleUploadAnexo)} className="space-y-4">
                    <FormField
                      control={anexoForm.control}
                      name="file"
                      render={({ field: { onChange, value, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Arquivo</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  onChange(e.target.files[0]);
                                }
                              }}
                              {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={anexoForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição (opcional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o conteúdo deste arquivo" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setAnexoDialogOpen(false)} disabled={isUploadingAnexo}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isUploadingAnexo}>
                        {isUploadingAnexo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Anexar
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Etapas da Sindicância</h3>
        
        {isLoadingEtapas ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : etapasError ? (
          // Error state
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {etapasError}
            </AlertDescription>
          </Alert>
        ) : (
          // Data loaded
          etapas.map((etapa) => (
            <EtapaInvestigacao 
              key={etapa.id}
              etapa={{
                id: etapa.id,
                nome: etapa.nome,
                concluida: etapa.concluida,
                data: etapa.data,
                responsavel: etapa.responsavel,
                descricao: etapa.descricao
              }}
              onComplete={() => concluirEtapa(etapa.id)}
            />
          ))
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Nova Etapa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Etapa</DialogTitle>
              <DialogDescription>
                Preencha as informações para adicionar uma nova etapa à sindicância.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...etapaForm}>
              <form onSubmit={etapaForm.handleSubmit(adicionarNovaEtapa)} className="space-y-4">
                <FormField
                  control={etapaForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Etapa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Oitiva de Testemunhas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={etapaForm.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={etapaForm.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={etapaForm.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva as ações a serem realizadas nesta etapa" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Adicionar Etapa</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
