
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define o schema de validação com Zod
const formSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  matricula: z.string().min(4, { message: 'Matrícula deve ter pelo menos 4 caracteres' }),
  cargo: z.enum(['inspetor_geral', 'subinspetor', 'corregedoria', 'supervisor', 'guarda', 'administrador'], {
    required_error: 'Por favor selecione um cargo',
  }),
  email: z.string().email({ message: 'Email inválido' }),
  telefone: z.string().min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' }),
  dataAdmissao: z.string().min(1, { message: 'Data de admissão é obrigatória' }),
  senha: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  confirmarSenha: z.string().min(6, { message: 'Confirme sua senha' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não conferem",
  path: ["confirmarSenha"],
});

// Define types para os cargos e suas permissões
type Cargo = 'inspetor_geral' | 'subinspetor' | 'corregedoria' | 'supervisor' | 'guarda' | 'administrador';

const cargosInfo: Record<Cargo, { titulo: string, descricao: string }> = {
  inspetor_geral: {
    titulo: 'Inspetor Geral (Administrador)',
    descricao: 'Controle completo sobre todos os módulos e funções do sistema.'
  },
  subinspetor: {
    titulo: 'Subinspetor',
    descricao: 'Ajudar na organização das escalas de trabalho e guarnições.'
  },
  corregedoria: {
    titulo: 'Corregedoria',
    descricao: 'Acessar e registrar sindicâncias. Gerenciar todo o processo de apuração.'
  },
  supervisor: {
    titulo: 'Supervisor do Dia',
    descricao: 'Abrir e fechar plantões. Atribuir funções para a guarnição.'
  },
  guarda: {
    titulo: 'Guarda',
    descricao: 'Visualizar suas escalas de trabalho. Registrar atividades em patrulhamento.'
  },
  administrador: {
    titulo: 'Administrador',
    descricao: 'Controle completo sobre todos os módulos do sistema. Gerenciamento de usuários.'
  }
};

interface CadastrarFuncionarioProps {
  onSuccess?: () => void;
}

export const CadastrarFuncionario = ({ onSuccess }: CadastrarFuncionarioProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      matricula: '',
      cargo: undefined,
      email: '',
      telefone: '',
      dataAdmissao: '',
      senha: '',
      confirmarSenha: '',
    },
  });

  const selectedCargo = form.watch('cargo') as Cargo | undefined;
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Funcionário cadastrado:", values);
    toast.success("Funcionário cadastrado com sucesso!");
    form.reset();
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cadastrar Novo Funcionário</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para cadastrar um novo funcionário no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matricula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: GCM12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Ex: joao.silva@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: (11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataAdmissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Admissão</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(cargosInfo).map(([value, { titulo }]) => (
                          <SelectItem key={value} value={value}>
                            {titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedCargo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold text-lg mb-2">{cargosInfo[selectedCargo].titulo}</h3>
                <p className="text-gray-600 mb-4">{cargosInfo[selectedCargo].descricao}</p>
                <h4 className="font-medium mb-2">Permissões:</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedCargo === 'inspetor_geral' && (
                    <>
                      <li>Controle completo sobre todos os módulos e funções do sistema</li>
                      <li>Criar, modificar e excluir usuários</li>
                      <li>Gerenciar escalas de trabalho, guarnições e processos internos</li>
                      <li>Monitorar o andamento das ocorrências e sindicâncias</li>
                      <li>Acessar relatórios completos, estatísticas e dados do sistema</li>
                    </>
                  )}
                  {selectedCargo === 'subinspetor' && (
                    <>
                      <li>Ajudar na organização das escalas de trabalho e guarnições</li>
                      <li>Supervisar atividades de patrulhamento e ocorrências</li>
                      <li>Auxiliar no acompanhamento de sindicâncias e processos internos</li>
                    </>
                  )}
                  {selectedCargo === 'corregedoria' && (
                    <>
                      <li>Acessar e registrar sindicâncias</li>
                      <li>Gerenciar todo o processo de apuração de sindicâncias (etapas e pareceres)</li>
                      <li>Acompanhar o histórico disciplinar dos GMCs</li>
                      <li>Gerar relatórios detalhados de sindicâncias e processos administrativos</li>
                    </>
                  )}
                  {selectedCargo === 'supervisor' && (
                    <>
                      <li>Abrir e fechar plantões</li>
                      <li>Atribuir funções para a guarnição</li>
                      <li>Escolher o motorista do dia</li>
                      <li>Registrar ocorrências e relatar os incidentes do dia</li>
                      <li>Monitorar o cumprimento das escalas e atividades da guarnição</li>
                    </>
                  )}
                  {selectedCargo === 'guarda' && (
                    <>
                      <li>Visualizar suas escalas de trabalho</li>
                      <li>Registrar atividades em patrulhamento</li>
                      <li>Relatar ocorrências, com a possibilidade de anexar fotos e vídeos</li>
                      <li>Acessar informações pessoais e administrativas</li>
                    </>
                  )}
                  {selectedCargo === 'administrador' && (
                    <>
                      <li>Controle completo sobre todos os módulos do sistema</li>
                      <li>Gerenciamento de usuários (criação, modificação e exclusão)</li>
                      <li>Acesso irrestrito a todas as funcionalidades e relatórios</li>
                      <li>Gestão de configurações do sistema e segurança</li>
                    </>
                  )}
                </ul>
              </div>
            )}

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite a senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirme a senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>Cancelar</Button>
              <Button type="submit">Cadastrar Funcionário</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
