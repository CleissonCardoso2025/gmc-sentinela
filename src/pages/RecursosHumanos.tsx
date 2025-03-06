
import React, { useState } from 'react';
import Dashboard from '@/layouts/Dashboard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CadastrarFuncionario } from '@/components/RH/CadastrarFuncionario';
import { ListaFuncionarios } from '@/components/RH/ListaFuncionarios';

const RecursosHumanos = () => {
  return (
    <Dashboard>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gcm-600 mb-6">Recursos Humanos</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cadastrar">Cadastrar Funcionário</TabsTrigger>
            <TabsTrigger value="lista">Lista de Funcionários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Gestão de Pessoal</h2>
                <p className="text-gray-600 mb-4">Gerencie informações dos funcionários, férias, licenças e afastamentos.</p>
                <div className="flex space-x-2">
                  <button className="bg-gcm-600 text-white px-4 py-2 rounded hover:bg-gcm-700 transition-colors">
                    Cadastrar Funcionário
                  </button>
                  <button className="border border-gcm-600 text-gcm-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Ver Relatórios
                  </button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Folha de Pagamento</h2>
                <p className="text-gray-600 mb-4">Acesse informações sobre salários, horas extras e benefícios.</p>
                <div className="flex space-x-2">
                  <button className="bg-gcm-600 text-white px-4 py-2 rounded hover:bg-gcm-700 transition-colors">
                    Gerar Folha
                  </button>
                  <button className="border border-gcm-600 text-gcm-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Histórico
                  </button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Treinamentos</h2>
                <p className="text-gray-600 mb-4">Gerencie cursos, capacitações e certificações da equipe.</p>
                <div className="flex space-x-2">
                  <button className="bg-gcm-600 text-white px-4 py-2 rounded hover:bg-gcm-700 transition-colors">
                    Novo Treinamento
                  </button>
                  <button className="border border-gcm-600 text-gcm-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Certificações
                  </button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Avaliação de Desempenho</h2>
                <p className="text-gray-600 mb-4">Realize e acompanhe avaliações periódicas dos colaboradores.</p>
                <div className="flex space-x-2">
                  <button className="bg-gcm-600 text-white px-4 py-2 rounded hover:bg-gcm-700 transition-colors">
                    Nova Avaliação
                  </button>
                  <button className="border border-gcm-600 text-gcm-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                    Histórico
                  </button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="cadastrar">
            <CadastrarFuncionario />
          </TabsContent>
          
          <TabsContent value="lista">
            <ListaFuncionarios />
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default RecursosHumanos;
