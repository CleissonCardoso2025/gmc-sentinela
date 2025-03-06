
import React from 'react';
import Dashboard from '@/layouts/Dashboard';
import { OcorrenciaForm } from '@/components/Ocorrencias/OcorrenciaForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OcorrenciaList } from '@/components/Ocorrencias/OcorrenciaList';

const Ocorrencias = () => {
  return (
    <Dashboard>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gcm-600 mb-6">Gerenciamento de Ocorrências</h1>
        
        <Tabs defaultValue="nova" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="nova">Nova Ocorrência</TabsTrigger>
            <TabsTrigger value="lista">Ocorrências Registradas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nova" className="space-y-4">
            <OcorrenciaForm />
          </TabsContent>
          
          <TabsContent value="lista">
            <OcorrenciaList />
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default Ocorrencias;
