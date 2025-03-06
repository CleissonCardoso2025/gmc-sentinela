
import React, { useState } from 'react';
import Dashboard from '@/layouts/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NovaInvestigacao } from '@/components/Corregedoria/NovaInvestigacao';
import { InvestigacaoList } from '@/components/Corregedoria/InvestigacaoList';

const Corregedoria = () => {
  return (
    <Dashboard>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gcm-600 mb-6">Corregedoria - Gestão de Sindicâncias</h1>
        
        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="nova">Nova Sindicância</TabsTrigger>
            <TabsTrigger value="lista">Sindicâncias em Andamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nova" className="space-y-4">
            <NovaInvestigacao />
          </TabsContent>
          
          <TabsContent value="lista">
            <InvestigacaoList />
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default Corregedoria;
