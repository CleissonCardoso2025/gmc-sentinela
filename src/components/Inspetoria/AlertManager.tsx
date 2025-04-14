
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Megaphone, Package, BookOpen, ClipboardList, Plus, Calendar, RefreshCw, Users, User } from 'lucide-react';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { AlertBoard } from '@/components/Dashboard/AlertBoard';
import { ptBR } from 'date-fns/locale';

interface AlertFormValues {
  title: string;
  description: string;
  type: string;
  target: string;
  targetDetail: string;
  scheduleType: string;
  scheduleDate: string;
  recurring: boolean;
  recurrencePattern: string;
}

const AlertManager: React.FC = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState("view");
  
  const form = useForm<AlertFormValues>({
    defaultValues: {
      title: "",
      description: "",
      type: "urgente",
      target: "geral",
      targetDetail: "",
      scheduleType: "imediato",
      scheduleDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      recurring: false,
      recurrencePattern: "diario"
    }
  });

  const onSubmit = (data: AlertFormValues) => {
    console.log("Form data:", data);
    
    // Here you would typically save the data to your database
    toast({
      title: "Alerta criado",
      description: "O alerta foi criado com sucesso."
    });
    
    form.reset();
    setTab("view");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Megaphone className="h-5 w-5 mr-2 text-gcm-600" />
          <h2 className="text-xl font-bold">Mural de Alertas</h2>
        </div>
        {tab === "view" && (
          <Button onClick={() => setTab("create")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Alerta
          </Button>
        )}
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="view">Visualizar Alertas</TabsTrigger>
          <TabsTrigger value="create">Criar Alerta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="pt-4">
          <AlertBoard maxDisplayedAlerts={10} />
        </TabsContent>
        
        <TabsContent value="create" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Título e Descrição */}
                    <div className="space-y-4 md:col-span-2">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "O título é obrigatório" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título do Alerta</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite o título do alerta" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        rules={{ required: "A descrição é obrigatória" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva o alerta em detalhes" 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Tipo de Alerta */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Alerta</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de alerta" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="urgente">
                                <div className="flex items-center">
                                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                  <span>Urgente</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="ordem">
                                <div className="flex items-center">
                                  <Megaphone className="h-4 w-4 text-blue-500 mr-2" />
                                  <span>Ordem do Inspetor</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="diligencia">
                                <div className="flex items-center">
                                  <Package className="h-4 w-4 text-orange-500 mr-2" />
                                  <span>Nova Diligência</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="procedimento">
                                <div className="flex items-center">
                                  <BookOpen className="h-4 w-4 text-purple-500 mr-2" />
                                  <span>Mudança de Procedimento</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="administrativo">
                                <div className="flex items-center">
                                  <ClipboardList className="h-4 w-4 text-gray-500 mr-2" />
                                  <span>Aviso Administrativo</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Destino do Alerta */}
                    <FormField
                      control={form.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destino do Alerta</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("targetDetail", "");
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o destino" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="geral">
                                <div className="flex items-center">
                                  <Megaphone className="h-4 w-4 mr-2" />
                                  <span>Geral (Todos)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="guarnicao">
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>Guarnição Específica</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="usuario">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2" />
                                  <span>Usuário Específico</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Defina quem deve receber este alerta
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Detalhes do Destino (se não for geral) */}
                    {form.watch("target") !== "geral" && (
                      <FormField
                        control={form.control}
                        name="targetDetail"
                        rules={{ required: "Este campo é obrigatório" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch("target") === "guarnicao" 
                                ? "Selecione a Guarnição" 
                                : "Selecione o Usuário"}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={
                                  form.watch("target") === "guarnicao" 
                                    ? "Nome da guarnição" 
                                    : "Nome do usuário"
                                } 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {/* Agendamento */}
                    <FormField
                      control={form.control}
                      name="scheduleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Agendamento</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de agendamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="imediato">Publicar Imediatamente</SelectItem>
                              <SelectItem value="agendado">Agendar para Data Específica</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Data e Hora (se for agendado) */}
                    {form.watch("scheduleType") === "agendado" && (
                      <FormField
                        control={form.control}
                        name="scheduleDate"
                        rules={{ required: "A data é obrigatória" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data e Hora de Publicação</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input type="datetime-local" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {/* Recorrência */}
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="recurring"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Alerta Recorrente</FormLabel>
                              <FormDescription>
                                Marque esta opção se o alerta deve se repetir periodicamente
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Padrão de Recorrência (se for recorrente) */}
                    {form.watch("recurring") && (
                      <FormField
                        control={form.control}
                        name="recurrencePattern"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Padrão de Recorrência</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o padrão de recorrência" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="diario">
                                  <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    <span>Diário</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="semanal">
                                  <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    <span>Semanal</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="mensal">
                                  <div className="flex items-center">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    <span>Mensal</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Define com que frequência o alerta será repetido
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setTab("view")}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar Alerta</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertManager;
