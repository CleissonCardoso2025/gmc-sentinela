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
import { Plus, FileText, AlertTriangle, History, MapPin } from "lucide-react";
import { generateMockLocationsForAllVehicles } from "@/utils/mockLocationData";
import { useToast } from "@/hooks/use-toast";
import { enableRealtimeForVehicleLocations } from "@/utils/enableRealtimeForVehicleLocations";

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
  const { toast } = useToast();

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      placa: "GCM-1234",
      modelo: "Spin",
      marca: "Chevrolet",
      ano: "2023",
      tipo: "Patrulha",
      status: "Em serviço",
      quilometragem: 45678,
      ultimaManutencao: "2025-02-15",
      proximaManutencao: "2025-04-15",
      observacoes: "Veículo em bom estado"
    },
    {
      id: 2,
      placa: "GCM-5678",
      modelo: "Hilux",
      marca: "Toyota",
      ano: "2022",
      tipo: "Transporte",
      status: "Manutenção",
      quilometragem: 32456,
      ultimaManutencao: "2025-01-20",
      proximaManutencao: "2025-03-20",
      observacoes: "Em manutenção para troca de óleo"
    },
    {
      id: 3,
      placa: "GCM-9012",
      modelo: "Duster",
      marca: "Renault",
      ano: "2024",
      tipo: "Patrulha",
      status: "Em serviço",
      quilometragem: 28901,
      ultimaManutencao: "2025-02-25",
      proximaManutencao: "2025-05-01",
      observacoes: "Veículo novo"
    },
  ]);

  const [maintenances, setMaintenances] = useState<Maintenance[]>([
    {
      id: 1,
      veiculoId: 2,
      data: "2025-03-06",
      tipo: "Preventiva",
      quilometragem: 32000,
      custo: 350.0,
      status: "Em andamento",
      observacoes: "Troca de óleo e filtros",
      descricao: "Troca de óleo e filtros",
      previsaoTermino: "2025-03-08"
    },
    {
      id: 2,
      veiculoId: 1,
      data: "2025-02-28",
      tipo: "Corretiva",
      quilometragem: 45000,
      custo: 580.0,
      status: "Concluída",
      observacoes: "Substituição de pastilhas de freio",
      descricao: "Substituição de pastilhas de freio"
    },
    {
      id: 3,
      veiculoId: 3,
      data: "2025-02-15",
      tipo: "Preventiva",
      quilometragem: 28000,
      custo: 250.0,
      status: "Concluída",
      observacoes: "Alinhamento e balanceamento",
      descricao: "Alinhamento e balanceamento"
    },
  ]);

  useEffect(() => {
    enableRealtimeForVehicleLocations();
  }, []);

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

  const handleSaveVehicle = (vehicle: Vehicle) => {
    if (formMode === "add") {
      setVehicles([...vehicles, { ...vehicle, id: vehicles.length + 1 }]);
    } else {
      setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
    }
    setActiveTab("listar");
    setFormMode(null);
  };

  const handleSaveMaintenance = (maintenance: Maintenance) => {
    if (!maintenance.id) {
      setMaintenances([...maintenances, { ...maintenance, id: maintenances.length + 1 }]);
    } else {
      setMaintenances(maintenances.map(m => m.id === maintenance.id ? maintenance : m));
    }
    setActiveTab("listar");
    setMaintenanceMode(false);
  };

  const handleGenerateLocationData = async () => {
    try {
      const result = await generateMockLocationsForAllVehicles();
      if (result) {
        toast({
          title: "Dados de localização gerados",
          description: "Os dados de localização foram gerados com sucesso para todas as viaturas.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Houve um erro ao gerar os dados de localização.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating location data:", error);
      toast({
        title: "Erro",
        description: "Houve um erro ao gerar os dados de localização.",
        variant: "destructive",
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

  return (
    <Dashboard>
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
                  <Button
                    variant="outline"
                    onClick={handleGenerateLocationData}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Gerar Localizações
                  </Button>
                </div>
              </div>

              <VehicleTable 
                vehicles={filteredVehicles} 
                onEdit={handleEditVehicle} 
                onAddMaintenance={handleAddMaintenance} 
              />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AlertPanel vehicles={vehicles} />
              <MaintenanceHistory 
                maintenances={maintenances.slice(0, 3)} 
                vehicles={vehicles} 
              />
            </div>
          </TabsContent>

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
                <MaintenanceHistory 
                  maintenances={maintenances} 
                  vehicles={vehicles} 
                  fullHistory 
                />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="relatorios">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
              <ReportPanel vehicles={vehicles} maintenances={maintenances} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default ViaturasPage;
