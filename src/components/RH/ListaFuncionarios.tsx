
import React, { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Search, Filter, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

// Mock data for demonstration purposes
const funcionariosMock = [
  {
    id: '1',
    nome: 'Carlos Oliveira',
    matricula: 'GCM1001',
    cargo: 'Inspetor Geral',
    email: 'carlos.oliveira@gcm.gov.br',
    telefone: '(11) 98765-4321',
    dataAdmissao: '2010-05-15',
  },
  {
    id: '2',
    nome: 'Ana Silva',
    matricula: 'GCM1002',
    cargo: 'Subinspetor',
    email: 'ana.silva@gcm.gov.br',
    telefone: '(11) 98765-4322',
    dataAdmissao: '2012-03-10',
  },
  {
    id: '3',
    nome: 'Marcos Santos',
    matricula: 'GCM1003',
    cargo: 'Corregedoria',
    email: 'marcos.santos@gcm.gov.br',
    telefone: '(11) 98765-4323',
    dataAdmissao: '2013-07-22',
  },
  {
    id: '4',
    nome: 'Juliana Costa',
    matricula: 'GCM1004',
    cargo: 'Supervisor do Dia',
    email: 'juliana.costa@gcm.gov.br',
    telefone: '(11) 98765-4324',
    dataAdmissao: '2015-11-05',
  },
  {
    id: '5',
    nome: 'Pedro Almeida',
    matricula: 'GCM1005',
    cargo: 'Guarda',
    email: 'pedro.almeida@gcm.gov.br',
    telefone: '(11) 98765-4325',
    dataAdmissao: '2018-01-15',
  },
];

export const ListaFuncionarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFuncionario, setSelectedFuncionario] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [funcionarios, setFuncionarios] = useState(funcionariosMock);

  const filteredFuncionarios = funcionarios.filter(funcionario => 
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setFuncionarios(funcionarios.filter(funcionario => funcionario.id !== id));
    toast.success("Funcionário removido com sucesso!");
    setShowDeleteDialog(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lista de Funcionários</CardTitle>
            <CardDescription>
              Gerencie todos os funcionários cadastrados no sistema.
            </CardDescription>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gcm-600 hover:bg-gcm-700"
            onClick={() => toast.info("Função de adicionar novo funcionário disponível na aba 'Cadastrar Funcionário'")}
          >
            <UserPlus className="h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, matrícula, cargo ou email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => toast.info("Funcionalidade de filtros em desenvolvimento")}
          >
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de funcionários da Guarda Civil Municipal.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Data de Admissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFuncionarios.length > 0 ? (
                filteredFuncionarios.map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell className="font-medium">{funcionario.nome}</TableCell>
                    <TableCell>{funcionario.matricula}</TableCell>
                    <TableCell>{funcionario.cargo}</TableCell>
                    <TableCell className="hidden md:table-cell">{funcionario.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedFuncionario(funcionario)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Funcionário</DialogTitle>
                              <DialogDescription>
                                Informações completas do funcionário cadastrado
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFuncionario && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium">Nome:</p>
                                  <p className="col-span-3">{selectedFuncionario.nome}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium">Matrícula:</p>
                                  <p className="col-span-3">{selectedFuncionario.matricula}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium">Cargo:</p>
                                  <p className="col-span-3">{selectedFuncionario.cargo}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium">Email:</p>
                                  <p className="col-span-3">{selectedFuncionario.email}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium">Telefone:</p>
                                  <p className="col-span-3">{selectedFuncionario.telefone}</p>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <p className="text-right font-medium">Data de Admissão:</p>
                                  <p className="col-span-3">
                                    {new Date(selectedFuncionario.dataAdmissao).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedFuncionario(funcionario);
                            toast.info("Funcionalidade de edição em desenvolvimento");
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedFuncionario(funcionario)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar Exclusão</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-between">
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDelete(selectedFuncionario?.id)}
                              >
                                Excluir
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum funcionário encontrado com os termos de busca informados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
