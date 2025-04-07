
import React from 'react';
import Header from '@/components/Dashboard/Header';
import Navbar from '@/components/Dashboard/Navbar';
import StatCard from '@/components/Dashboard/StatCard';
import OccurrenceMap from '@/components/Dashboard/OccurrenceMap';
import VehicleTrackingMap from '@/components/Dashboard/VehicleTrackingMap';
import VehicleTable from '@/components/Dashboard/VehicleTable';
import OccurrenceList from '@/components/Dashboard/OccurrenceList';
import Footer from '@/components/Dashboard/Footer';
import { Car, AlertTriangle, Users, Settings } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Dashboard from '@/layouts/Dashboard';

const Index = () => {
  // State
  const [notifications, setNotifications] = React.useState(3);

  // Mock data for the component props
  const viaturasData = [
    { id: 1, placa: 'GCM-1234', status: 'Em serviço', condutor: 'Carlos Silva', quilometragem: '45.678', proximaManutencao: '2025-04-15' },
    { id: 2, placa: 'GCM-5678', status: 'Manutenção', condutor: 'Ana Oliveira', quilometragem: '32.456', proximaManutencao: '2025-03-20' },
    { id: 3, placa: 'GCM-9012', status: 'Em serviço', condutor: 'Pedro Santos', quilometragem: '28.901', proximaManutencao: '2025-05-01' },
  ];

  const manutencaoData = [
    { id: 1, placa: 'GCM-5678', tipo: 'Preventiva', dataInicio: '2025-03-06', previsaoTermino: '2025-03-08', descricao: 'Troca de óleo e filtros', status: 'Em andamento' },
    { id: 2, placa: 'GCM-1234', tipo: 'Corretiva', dataInicio: '2025-02-28', previsaoTermino: '2025-03-01', descricao: 'Substituição de pastilhas de freio', status: 'Concluída' },
    { id: 3, placa: 'GCM-9012', tipo: 'Preventiva', dataInicio: '2025-02-15', previsaoTermino: '2025-02-16', descricao: 'Alinhamento e balanceamento', status: 'Concluída' },
  ];

  const ocorrenciasData = [
    { titulo: 'Perturbação do Sossego', local: 'Rua das Flores, 123', hora: '14:30' },
    { titulo: 'Acidente de Trânsito', local: 'Av. Principal, 456', hora: '13:15' },
    { titulo: 'Apoio ao Cidadão', local: 'Praça Central', hora: '12:45' },
  ];

  return (
    <Dashboard>
      <div className="p-6 h-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Viaturas em Operação" 
            value={12} 
            icon={<Car className="h-5 w-5 text-gcm-600" />}
            color="text-gcm-600"
            className="animate-fade-up"
          />
          <StatCard 
            title="Ocorrências Ativas" 
            value={5} 
            icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
            color="text-red-600"
            className="animate-fade-up"
          />
          <StatCard 
            title="Efetivo em Serviço" 
            value={28} 
            icon={<Users className="h-5 w-5 text-green-600" />}
            color="text-green-600"
            className="animate-fade-up delay-75"
          />
          <StatCard 
            title="Alertas de Manutenção" 
            value={3} 
            icon={<Settings className="h-5 w-5 text-amber-600" />}
            color="text-amber-600"
            className="animate-fade-up delay-100"
          />
        </div>
        
        {/* Maps with Tabs */}
        <div className="mb-6">
          <Tabs defaultValue="occurrences" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-4 relative z-20">
              <TabsTrigger value="occurrences" className="flex-1">Mapa de Ocorrências</TabsTrigger>
              <TabsTrigger value="vehicles" className="flex-1">Rastreamento de Viaturas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="occurrences" className="mt-0 relative z-10">
              <OccurrenceMap />
            </TabsContent>
            
            <TabsContent value="vehicles" className="mt-0">
              <div className="relative z-0">
                <VehicleTrackingMap />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Tables and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <div className="lg:col-span-2">
            <VehicleTable vehicles={viaturasData} maintenances={manutencaoData} />
          </div>
          <div>
            <OccurrenceList occurrences={ocorrenciasData} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
