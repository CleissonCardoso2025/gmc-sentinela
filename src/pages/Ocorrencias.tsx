
import React from 'react';
import Dashboard from '@/layouts/Dashboard';
import { OcorrenciaForm } from '@/components/Ocorrencias/OcorrenciaForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OcorrenciaList } from '@/components/Ocorrencias/OcorrenciaList';
import { FileText, Plus } from 'lucide-react';
import { Toaster } from 'sonner';

const Ocorrencias = () => {
  return (
    <Dashboard>
      <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gcm-600 mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-gcm-500" />
          Gerenciamento de Ocorrências
        </h1>
        
        <Tabs defaultValue="nova" className="w-full">
          <TabsList className="mb-4 w-full max-w-md mx-auto flex justify-between border bg-background shadow-sm rounded-lg p-1">
            <TabsTrigger 
              value="nova" 
              className="flex-1 data-[state=active]:bg-gcm-100 data-[state=active]:text-gcm-700 rounded-md transition-all"
            >
              <Plus className="h-4 w-4 mr-2 sm:inline-block hidden" />
              Nova Ocorrência
            </TabsTrigger>
            <TabsTrigger 
              value="lista" 
              className="flex-1 data-[state=active]:bg-gcm-100 data-[state=active]:text-gcm-700 rounded-md transition-all"
            >
              <FileText className="h-4 w-4 mr-2 sm:inline-block hidden" />
              Ocorrências Registradas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="nova" className="space-y-4 mt-4">
            <OcorrenciaForm />
          </TabsContent>
          
          <TabsContent value="lista" className="mt-4">
            <OcorrenciaList />
          </TabsContent>
        </Tabs>
        
        <Toaster position="top-right" />
      </div>
    </Dashboard>
  );
};

export default Ocorrencias;
