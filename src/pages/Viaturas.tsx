
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/layouts/Dashboard";
import { Plus } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { VehicleProvider, Vehicle, Maintenance } from '@/contexts/VehicleContext';
import ListTab from '@/components/Viaturas/TabContents/ListTab';
import FormTab from '@/components/Viaturas/TabContents/FormTab';
import MaintenanceTab from '@/components/Viaturas/TabContents/MaintenanceTab';
import ReportsTab from '@/components/Viaturas/TabContents/ReportsTab';

// Export types from the context
export type { Vehicle, Maintenance };

const ViaturasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("listar");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const { isAdmin, isAuthenticated, isLoading: authLoading } = useAdminAuth();

  const handleAddVehicle = () => {
    setFormMode("add");
    setSelectedVehicle(null);
    setActiveTab("cadastrar");
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setFormMode("edit");
    setSelectedVehicle(vehicle);
    setActiveTab("cadastrar");
  };

  const handleAddMaintenance = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setMaintenanceMode(true);
    setActiveTab("manutencao");
  };

  if (authLoading) {
    return (
      <Dashboard>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gestão de Viaturas</h1>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <VehicleProvider>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gestão de Viaturas</h1>
            <div className="flex space-x-2">
              <Button onClick={handleAddVehicle}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Viatura
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listar">Listagem de Viaturas</TabsTrigger>
              <TabsTrigger value="cadastrar">Cadastro de Viatura</TabsTrigger>
              <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="listar">
              <ListTab 
                onEditVehicle={handleEditVehicle}
                onAddMaintenance={handleAddMaintenance}
              />
            </TabsContent>

            <TabsContent value="cadastrar">
              <FormTab 
                formMode={formMode} 
                selectedVehicle={selectedVehicle} 
                onCancel={() => setActiveTab("listar")} 
              />
            </TabsContent>

            <TabsContent value="manutencao">
              <MaintenanceTab 
                maintenanceMode={maintenanceMode}
                selectedVehicle={selectedVehicle}
                onCancel={() => {
                  setMaintenanceMode(false);
                  setActiveTab("listar");
                }}
              />
            </TabsContent>

            <TabsContent value="relatorios">
              <ReportsTab />
            </TabsContent>
          </Tabs>
        </div>
      </VehicleProvider>
    </Dashboard>
  );
};

export default ViaturasPage;
