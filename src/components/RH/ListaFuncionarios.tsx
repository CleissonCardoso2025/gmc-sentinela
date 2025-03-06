
import React from 'react';
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
import { Eye, Edit, Trash2 } from 'lucide-react';

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
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lista de Funcionários</CardTitle>
        <CardDescription>
          Gerencie todos os funcionários cadastrados no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button variant="outline">Filtrar</Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de funcionários da Guarda Civil Municipal.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data de Admissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionariosMock.map((funcionario) => (
                <TableRow key={funcionario.id}>
                  <TableCell className="font-medium">{funcionario.nome}</TableCell>
                  <TableCell>{funcionario.matricula}</TableCell>
                  <TableCell>{funcionario.cargo}</TableCell>
                  <TableCell>{funcionario.email}</TableCell>
                  <TableCell>{new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
