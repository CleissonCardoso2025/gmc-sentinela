
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleTable from "@/components/Viaturas/VehicleTable";
import VehicleForm from "@/components/Viaturas/VehicleForm";
import MaintenanceForm from "@/components/Viaturas/MaintenanceForm";
import MaintenanceHistory from "@/components/Viaturas/MaintenanceHistory";
import AlertPanel from "@/components/Viaturas/AlertPanel";
import ReportPanel from "@/components/Viaturas/ReportPanel";
import Dashboard from "@/layouts/Dashboard";
import { Plus, FileText, AlertTriangle, History, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Navigate, useNavigate } from 'react-router-dom';

export interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  tipo: string;
  status: string;
  quilometragem: number;
  ultimaManutencao: string;
  proximaManutencao: string;
  observacoes: string;
}

export interface Maintenance {
  id: number;
  veiculoId: number;
  data: string;
  tipo: string;
  quilometragem: number;
  custo: number;
  status: string;
  observacoes: string;
  descricao: string;
  previsaoTermino?: string;
}

const ViaturasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("listar");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, isLoading: authLoading, userId } = useAdminAuth();

  // State for data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  // Fetch vehicles and maintenance data
  useEffect(() => {
    if (!authLoading) {
      fetchVehicles();
    }
  }, [authLoading, isAuthenticated, userId]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    
    try {
      console.log("Buscando veículos...");
      
      if (!isAuthenticated) {
        console.log("Usuário não autenticado. Usando dados de exemplo.");
        setVehicles([]);
        toast({
          title: "Não autenticado",
          description: "Você precisa estar autenticado para visualizar viaturas.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*');
        
      if (vehiclesError) {
        console.error("Erro ao buscar veículos:", vehiclesError);
        throw vehiclesError;
      }
      
      console.log("Veículos recuperados:", vehiclesData);
      
      // Transform vehicle data if needed
      const transformedVehicles = vehiclesData?.map(vehicle => ({
        id: vehicle.id,
        placa: vehicle.placa,
        modelo: vehicle.modelo,
        marca: vehicle.marca,
        ano: vehicle.ano || '',
        tipo: vehicle.tipo || '',
        status: vehicle.status || 'Disponível',
        quilometragem: vehicle.quilometragem || 0,
        ultimaManutencao: vehicle.ultimamanutencao ? new Date(vehicle.ultimamanutencao).toISOString().split('T')[0] : '',
        proximaManutencao: vehicle.proximamanutencao ? new Date(vehicle.proximamanutencao).toISOString().split('T')[0] : '',
        observacoes: vehicle.observacoes || ''
      })) || [];
      
      setVehicles(transformedVehicles);
      
    } catch (error: any) {
      console.error("Error fetching vehicle data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações das viaturas.",
        variant: "destructive"
      });
      
      // Set empty arrays on error
      setVehicles([]);
      setMaintenances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = () => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para adicionar veículos.",
        variant: "destructive"
      });
      return;
    }
    setFormMode("add");
    setSelectedVehicle(null);
    setActiveTab("cadastrar");
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para editar veículos.",
        variant: "destructive"
      });
      return;
    }
    setFormMode("edit");
    setSelectedVehicle(vehicle);
    setActiveTab("cadastrar");
  };

  const handleAddMaintenance = (vehicle: Vehicle) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para gerenciar manutenções.",
        variant: "destructive"
      });
      return;
    }
    setSelectedVehicle(vehicle);
    setMaintenanceMode(true);
    setActiveTab("manutencao");
  };

  const handleSaveVehicle = async (vehicle: Vehicle) => {
    try {
      console.log("Salvando veículo:", vehicle);
      
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("Usuário não autenticado. Não é possível salvar dados.");
        toast({
          title: "Não autenticado",
          description: "Você precisa estar autenticado para salvar viaturas.",
          variant: "destructive"
        });
        return;
      }
      
      if (!isAdmin) {
        toast({
          title: "Permissão negada",
          description: "Você não tem permissão para salvar alterações em viaturas.",
          variant: "destructive"
        });
        return;
      }
      
      if (formMode === "add") {
        // Prepare vehicle data for insert
        const vehicleData = {
          placa: vehicle.placa,
          modelo: vehicle.modelo,
          marca: vehicle.marca,
          ano: vehicle.ano,
          tipo: vehicle.tipo,
          status: vehicle.status,
          quilometragem: vehicle.quilometragem,
          ultimamanutencao: vehicle.ultimaManutencao ? new Date(vehicle.ultimaManutencao).toISOString() : null,
          proximamanutencao: vehicle.proximaManutencao ? new Date(vehicle.proximaManutencao).toISOString() : null,
          observacoes: vehicle.observacoes,
          user_id: session.user.id // Add user_id for RLS policy
        };
        
        console.log("Dados preparados para inserção:", vehicleData);
        
        const { data, error } = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select();
          
        if (error) {
          console.error("Erro ao inserir veículo:", error);
          throw error;
        }
        
        console.log("Veículo inserido com sucesso:", data);
        
        if (data && data.length > 0) {
          // Transform returned data to match Vehicle interface
          const newVehicle: Vehicle = {
            id: data[0].id,
            placa: data[0].placa,
            modelo: data[0].modelo,
            marca: data[0].marca,
            ano: data[0].ano || '',
            tipo: data[0].tipo || '',
            status: data[0].status || 'Disponível',
            quilometragem: data[0].quilometragem || 0,
            ultimaManutencao: data[0].ultimamanutencao ? new Date(data[0].ultimamanutencao).toISOString().split('T')[0] : '',
            proximaManutencao: data[0].proximamanutencao ? new Date(data[0].proximamanutencao).toISOString().split('T')[0] : '',
            observacoes: data[0].observacoes || ''
          };
          
          setVehicles([newVehicle, ...vehicles]);
        }
        
        toast({
          title: "Viatura adicionada",
          description: "Viatura cadastrada com sucesso.",
        });
      } else if (formMode === "edit" && vehicle.id) {
        // Prepare vehicle data for update
        const vehicleData = {
          placa: vehicle.placa,
          modelo: vehicle.modelo,
          marca: vehicle.marca,
          ano: vehicle.ano,
          tipo: vehicle.tipo,
          status: vehicle.status,
          quilometragem: vehicle.quilometragem,
          ultimamanutencao: vehicle.ultimaManutencao ? new Date(vehicle.ultimaManutencao).toISOString() : null,
          proximamanutencao: vehicle.proximaManutencao ? new Date(vehicle.proximaManutencao).toISOString() : null,
          observacoes: vehicle.observacoes,
          user_id: session.user.id // Add user_id for RLS policy
        };
        
        console.log("Dados preparados para atualização:", vehicleData);
        
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', vehicle.id);
          
        if (error) {
          console.error("Erro ao atualizar veículo:", error);
          throw error;
        }
        
        console.log("Veículo atualizado com sucesso");
        
        // Update local state
        setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
        
        toast({
          title: "Viatura atualizada",
          description: "Dados da viatura atualizados com sucesso.",
        });
      }
      
      setActiveTab("listar");
      setFormMode(null);
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Erro ao salvar viatura",
        description: `Não foi possível salvar os dados da viatura: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleSaveMaintenance = async (maintenance: Maintenance) => {
    try {
      // Check if user is authenticated and is admin
      if (!isAuthenticated || !isAdmin) {
        toast({
          title: "Permissão negada",
          description: "Você não tem permissão para gerenciar manutenções.",
          variant: "destructive"
        });
        return;
      }
      
      // In a real system, you would save maintenance data to your database
      // For now, we just update the local state for demonstration
      if (!maintenance.id) {
        const newMaintenance = { ...maintenance, id: maintenances.length + 1 };
        setMaintenances([...maintenances, newMaintenance]);
        
        toast({
          title: "Manutenção registrada",
          description: "Registro de manutenção adicionado com sucesso.",
        });
      } else {
        setMaintenances(maintenances.map(m => m.id === maintenance.id ? maintenance : m));
        
        toast({
          title: "Manutenção atualizada",
          description: "Registro de manutenção atualizado com sucesso.",
        });
      }
      
      setActiveTab("listar");
      setMaintenanceMode(false);
    } catch (error) {
      console.error("Error saving maintenance:", error);
      toast({
        title: "Erro ao salvar manutenção",
        description: "Não foi possível salvar os dados da manutenção.",
        variant: "destructive"
      });
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? vehicle.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Render loading state while checking authentication
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
  
  // Render unauthorized state if authentication is complete but user is not authenticated
  if (!isAuthenticated) {
    return (
      <Dashboard>
        <div className="container mx-auto p-6">
          <div className="p-8 max-w-md mx-auto my-12 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
            <ShieldAlert className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-center">Acesso Não Autorizado</h2>
            <p className="mb-6 text-center">
              Você precisa estar autenticado para acessar esta página.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/login')}
                className="bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestão de Viaturas</h1>
          <div className="flex space-x-2">
            {isAdmin && (
              <Button onClick={handleAddVehicle}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Viatura
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listar">Listagem de Viaturas</TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="cadastrar">Cadastro de Viatura</TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
            )}
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="listar" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between mb-4">
                <div className="w-1/3">
                  <Input
                    placeholder="Buscar por placa, modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={statusFilter === null ? "default" : "outline"}
                    onClick={() => setStatusFilter(null)}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={statusFilter === "Em serviço" ? "default" : "outline"}
                    onClick={() => setStatusFilter("Em serviço")}
                  >
                    Em serviço
                  </Button>
                  <Button
                    variant={statusFilter === "Manutenção" ? "default" : "outline"}
                    onClick={() => setStatusFilter("Manutenção")}
                  >
                    Em manutenção
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <VehicleTable 
                  vehicles={filteredVehicles} 
                  onEdit={handleEditVehicle} 
                  onAddMaintenance={handleAddMaintenance}
                  isAdmin={isAdmin}
                />
              )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AlertPanel vehicles={vehicles} />
              <MaintenanceHistory 
                maintenances={maintenances.slice(0, 3)} 
                vehicles={vehicles} 
              />
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="cadastrar">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {formMode === "add" ? "Adicionar Nova Viatura" : "Editar Viatura"}
                </h2>
                <VehicleForm 
                  vehicle={selectedVehicle} 
                  onSave={handleSaveVehicle} 
                  onCancel={() => setActiveTab("listar")} 
                />
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="manutencao">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {maintenanceMode ? "Adicionar Manutenção" : "Histórico de Manutenções"}
                </h2>
                {maintenanceMode ? (
                  <MaintenanceForm 
                    vehicle={selectedVehicle}
                    onSave={handleSaveMaintenance}
                    onCancel={() => {
                      setMaintenanceMode(false);
                      setActiveTab("listar");
                    }}
                  />
                ) : (
                  isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : (
                    <MaintenanceHistory 
                      maintenances={maintenances} 
                      vehicles={vehicles} 
                      fullHistory 
                    />
                  )
                )}
              </Card>
            </TabsContent>
          )}

          <TabsContent value="relatorios">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-80 w-full" />
                </div>
              ) : (
                <ReportPanel vehicles={vehicles} maintenances={maintenances} />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default ViaturasPage;
