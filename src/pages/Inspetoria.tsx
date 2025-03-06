
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Dashboard from "@/layouts/Dashboard";
import { Shield, Users, Calendar, FileText, Bell, Plus } from "lucide-react";
import InspetoriaDashboard from "@/components/Inspetoria/InspetoriaDashboard";
import GuarnicoesList from "@/components/Inspetoria/GuarnicoesList";
import GuarnicaoForm from "@/components/Inspetoria/GuarnicaoForm";
import EscalaTrabalho from "@/components/Inspetoria/EscalaTrabalho";
import RelatoriosOperacionais from "@/components/Inspetoria/RelatoriosOperacionais";
import AlertPanel from "@/components/Inspetoria/AlertPanel";

const InspetoriaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCreatingGuarnicao, setIsCreatingGuarnicao] = useState(false);

  return (
    <Dashboard>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-gcm-600 mr-3" />
            <h1 className="text-2xl font-bold">Inspetoria Geral</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => {
              setIsCreatingGuarnicao(true);
              setActiveTab("guarnicoes");
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Guarnição
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="guarnicoes" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Guarnições
            </TabsTrigger>
            <TabsTrigger value="escala" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Escala de Trabalho
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <InspetoriaDashboard />
          </TabsContent>

          <TabsContent value="guarnicoes">
            <Card className="p-6">
              {isCreatingGuarnicao ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Nova Guarnição</h2>
                  <GuarnicaoForm 
                    onSave={() => setIsCreatingGuarnicao(false)}
                    onCancel={() => setIsCreatingGuarnicao(false)}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Guarnições</h2>
                  <GuarnicoesList onCreateNew={() => setIsCreatingGuarnicao(true)} />
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="escala">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Escala de Trabalho</h2>
              <EscalaTrabalho />
            </Card>
          </TabsContent>

          <TabsContent value="relatorios">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Relatórios Operacionais</h2>
              <RelatoriosOperacionais />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default InspetoriaPage;
