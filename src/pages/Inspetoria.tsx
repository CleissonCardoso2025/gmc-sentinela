
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Dashboard from "@/layouts/Dashboard";
import { Shield, Users, Calendar, FileText, Bell, Plus, Map, AlertTriangle, Megaphone } from "lucide-react";
import InspetoriaDashboard from "@/components/Inspetoria/InspetoriaDashboard";
import GuarnicoesList from "@/components/Inspetoria/GuarnicoesList";
import GuarnicaoForm from "@/components/Inspetoria/GuarnicaoForm";
import EscalaTrabalho from "@/components/Inspetoria/EscalaTrabalho";
import RelatoriosOperacionais from "@/components/Inspetoria/RelatoriosOperacionais";
import RotasList from "@/components/Inspetoria/RotasList";
import RotaForm from "@/components/Inspetoria/RotaForm";
import InspetoriaOccurrences from "@/components/Inspetoria/InspetoriaOccurrences";
import AlertManager from "@/components/Inspetoria/AlertManager";

interface Guarnicao {
  id: string;
  nome: string;
  supervisor: string;
  updated_at: string;
  membros?: {
    id: string;
    nome: string;
    funcao: string;
    guarnicao_id?: string;
  }[];
  observations?: string;
}

const InspetoriaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCreatingGuarnicao, setIsCreatingGuarnicao] = useState(false);
  const [isCreatingRota, setIsCreatingRota] = useState(false);
  const [guarnicaoToEdit, setGuarnicaoToEdit] = useState<Guarnicao | null>(null);

  const handleEditGuarnicao = (guarnicao: Guarnicao) => {
    setGuarnicaoToEdit(guarnicao);
    setIsCreatingGuarnicao(true);
  };

  const handleCancelGuarnicao = () => {
    setIsCreatingGuarnicao(false);
    setGuarnicaoToEdit(null);
  };

  const handleSaveGuarnicao = () => {
    setIsCreatingGuarnicao(false);
    setGuarnicaoToEdit(null);
  };

  return (
    <Dashboard>
      <div className="container mx-auto p-4 sm:p-6 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-gcm-600 mr-2 sm:mr-3" />
            <h1 className="text-xl sm:text-2xl font-bold">Inspetoria Geral</h1>
          </div>
          
          <div className="flex space-x-2">
            {activeTab === "guarnicoes" && !isCreatingGuarnicao && (
              <Button onClick={() => setIsCreatingGuarnicao(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nova Guarnição</span>
                <span className="sm:hidden">Guarnição</span>
              </Button>
            )}
            {activeTab === "rotas" && !isCreatingRota && (
              <Button onClick={() => setIsCreatingRota(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nova Rota</span>
                <span className="sm:hidden">Rota</span>
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid min-w-max w-full grid-cols-7">
              <TabsTrigger value="dashboard" className="flex items-center">
                <Shield className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="guarnicoes" className="flex items-center">
                <Users className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Guarnições</span>
              </TabsTrigger>
              <TabsTrigger value="escala" className="flex items-center">
                <Calendar className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Escala de Trabalho</span>
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center">
                <FileText className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
              <TabsTrigger value="rotas" className="flex items-center">
                <Map className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Rotas</span>
              </TabsTrigger>
              <TabsTrigger value="ocorrencias" className="flex items-center">
                <AlertTriangle className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Ocorrências</span>
              </TabsTrigger>
              <TabsTrigger value="alertas" className="flex items-center">
                <Megaphone className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Mural de Alertas</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <Card className="p-4 sm:p-6 animate-fade-in">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Dashboard Operacional</h2>
              <InspetoriaDashboard />
            </Card>
          </TabsContent>

          <TabsContent value="guarnicoes">
            <Card className="p-4 sm:p-6 animate-fade-in">
              {isCreatingGuarnicao ? (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    {guarnicaoToEdit ? 'Editar Guarnição' : 'Nova Guarnição'}
                  </h2>
                  <GuarnicaoForm 
                    onSave={handleSaveGuarnicao}
                    onCancel={handleCancelGuarnicao}
                    guarnicao={guarnicaoToEdit || undefined}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Guarnições</h2>
                  <GuarnicoesList 
                    onCreateNew={() => setIsCreatingGuarnicao(true)}
                    onEdit={handleEditGuarnicao}
                  />
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="escala">
            <Card className="p-4 sm:p-6 animate-fade-in">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Escala de Trabalho</h2>
              <EscalaTrabalho />
            </Card>
          </TabsContent>

          <TabsContent value="relatorios">
            <Card className="p-4 sm:p-6 animate-fade-in">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Relatórios Operacionais</h2>
              <RelatoriosOperacionais />
            </Card>
          </TabsContent>

          <TabsContent value="rotas">
            <Card className="p-4 sm:p-6 animate-fade-in">
              {isCreatingRota ? (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Nova Rota</h2>
                  <RotaForm 
                    onSave={() => setIsCreatingRota(false)}
                    onCancel={() => setIsCreatingRota(false)}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">Rotas de Patrulhamento</h2>
                  <RotasList onCreateNew={() => setIsCreatingRota(true)} />
                </>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="ocorrencias">
            <Card className="p-4 sm:p-6 animate-fade-in">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Ocorrências Cadastradas</h2>
              <InspetoriaOccurrences />
            </Card>
          </TabsContent>

          <TabsContent value="alertas">
            <Card className="p-4 sm:p-6 animate-fade-in">
              <AlertManager />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default InspetoriaPage;
