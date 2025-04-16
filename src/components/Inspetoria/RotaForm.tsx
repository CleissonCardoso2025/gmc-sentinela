
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define the validation schema for the form
const formSchema = z.object({
  nome: z.string().min(3, { message: "O nome da rota precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().min(10, { message: "A descrição precisa ter pelo menos 10 caracteres" }),
  bairros: z.string().min(3, { message: "Informe os bairros que compõem a rota" }),
  pontoInicial: z.string().min(3, { message: "Informe o ponto inicial da rota" }),
  pontoFinal: z.string().min(3, { message: "Informe o ponto final da rota" }),
  tempoPrevisto: z.string().regex(/^\d+$/, { message: "Informe o tempo previsto em minutos" }),
  prioridade: z.string().min(1, { message: "Selecione a prioridade da rota" }),
});

type RotaFormValues = z.infer<typeof formSchema>;

interface RotaFormProps {
  onSave: () => void;
  onCancel: () => void;
  editingRota?: RotaFormValues;
}

const RotaForm: React.FC<RotaFormProps> = ({ onSave, onCancel, editingRota }) => {
  const { toast } = useToast();
  const form = useForm<RotaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: editingRota || {
      nome: '',
      descricao: '',
      bairros: '',
      pontoInicial: '',
      pontoFinal: '',
      tempoPrevisto: '',
      prioridade: 'Normal',
    },
  });

  const onSubmit = async (values: RotaFormValues) => {
    try {
      // Adicionar informações de debug
      console.log('Rota form submitted:', values);
      
      // Preparar dados para o Supabase
      // Importante: use o nome dos campos exatamente como estão no banco de dados
      const rotaData = {
        nome: values.nome,
        descricao: values.descricao,
        bairros: values.bairros,
        pontoinicial: values.pontoInicial, // camelCase para snake_case
        pontofinal: values.pontoFinal, // camelCase para snake_case
        tempoprevisto: values.tempoPrevisto, // camelCase para snake_case
        prioridade: values.prioridade,
        ultimopatrulhamento: null // camelCase para snake_case
      };
      
      console.log('Dados preparados para salvar:', rotaData);
      
      // Salvar no banco de dados
      const { data, error } = await supabase
        .from('rotas')
        .insert([rotaData])
        .select();
      
      if (error) {
        console.error('Erro ao salvar rota:', error);
        throw error;
      }
      
      console.log('Rota salva com sucesso:', data);
      
      toast({
        title: editingRota ? "Rota atualizada" : "Rota cadastrada",
        description: `A rota ${values.nome} foi ${editingRota ? 'atualizada' : 'cadastrada'} com sucesso.`,
      });
      
      onSave();
    } catch (error: any) {
      console.error('Erro ao processar o formulário:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar a rota. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Rota</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Rota Centro-Norte" {...field} />
                </FormControl>
                <FormDescription>
                  Nome que identifica a rota de patrulhamento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="prioridade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="Alta">Alta</option>
                    <option value="Normal">Normal</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Nível de prioridade para patrulhamento desta rota.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva detalhes sobre esta rota..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Informações gerais sobre a rota, como características específicas ou pontos de atenção.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bairros"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairros</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Centro, Vila Nova, Jardim América" {...field} />
              </FormControl>
              <FormDescription>
                Bairros principais que fazem parte desta rota.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pontoInicial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ponto Inicial</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Praça Central" {...field} />
                </FormControl>
                <FormDescription>
                  Local onde a rota deve ser iniciada.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pontoFinal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ponto Final</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Terminal Rodoviário" {...field} />
                </FormControl>
                <FormDescription>
                  Local onde a rota deve ser finalizada.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tempoPrevisto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo Previsto (minutos)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 60" {...field} />
              </FormControl>
              <FormDescription>
                Tempo estimado para percorrer toda a rota, em minutos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Salvar Rota</Button>
        </div>
      </form>
    </Form>
  );
};

export default RotaForm;
