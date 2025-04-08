
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/Dashboard';
import { WelcomeHeader } from '@/components/Dashboard/WelcomeHeader';
import { QuickStats } from '@/components/Dashboard/QuickStats';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { AlertBoard } from '@/components/Dashboard/AlertBoard';
import { DashboardGrid } from '@/components/Dashboard/DashboardGrid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StatCard from '@/components/Dashboard/StatCard';
import OccurrenceMap from '@/components/Dashboard/OccurrenceMap';
import VehicleTrackingMap from '@/components/Dashboard/VehicleTrackingMap';
import VehicleTable from '@/components/Dashboard/VehicleTable';
import OccurrenceList from '@/components/Dashboard/OccurrenceList';
import { Car, AlertTriangle, Users, Settings, LayoutDashboard, Home } from 'lucide-react';

const Dashboard = () => {
  const [userName, setUserName] = useState<string>("Carlos Silva");
  const [userRole, setUserRole] = useState<string>("Guarda Civil Municipal");
  const [userProfile, setUserProfile] = useState<string>("");
  
  useEffect(() => {
    // Get user info from localStorage
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");
    const storedUserProfile = localStorage.getItem("userProfile") || "";
    
    setUserProfile(storedUserProfile);
    
    if (storedUserName) {
      setUserName(storedUserName);
      // Save for other components
      localStorage.setItem("userName", storedUserName);
    }
    
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Mock data for patrol route
  const patrolRouteData = {
    name: "Rota Central - Setor 2",
    locations: [
      { id: 1, name: "Praça da República", time: "09:00", status: "Completo" },
      { id: 2, name: "Mercado Municipal", time: "10:30", status: "Completo" },
      { id: 3, name: "Escola Municipal João Silva", time: "12:00", status: "Pendente" },
      { id: 4, name: "Terminal Rodoviário", time: "14:30", status: "Pendente" },
      { id: 5, name: "Parque Central", time: "16:00", status: "Pendente" }
    ],
    startTime: "08:00",
    endTime: "17:00",
    date: "08/04/2025"
  };

  // Mock data for work schedule
  const workScheduleData = [
    { id: 1, date: "08/04/2025", dayOfWeek: "Segunda", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 2, date: "09/04/2025", dayOfWeek: "Terça", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 3, date: "10/04/2025", dayOfWeek: "Quarta", shift: "Folga", startTime: "-", endTime: "-", role: "-" },
    { id: 4, date: "11/04/2025", dayOfWeek: "Quinta", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 5, date: "12/04/2025", dayOfWeek: "Sexta", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" }
  ];

  // Mock data for the Index page
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

  // Check if user is Inspetor or Subinspetor
  const isInspetorOrSubinspetor = userProfile === 'Inspetor' || userProfile === 'Subinspetor';

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        <WelcomeHeader userName={userName} role={userRole} />
        
        {/* Tabs for different views */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            
            {/* Only show the Centro de Comando tab for Inspetor or Subinspetor */}
            {isInspetorOrSubinspetor && (
              <TabsTrigger value="centro-comando" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Centro de Comando
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Dashboard Tab Content */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* First section - Stats and Quick Actions */}
            <div className="space-y-6">
              <QuickStats />
              <QuickActions />
            </div>
            
            {/* Alert Board - Now horizontal and below first section */}
            <div className="w-full">
              <AlertBoard maxDisplayedAlerts={3} />
            </div>
            
            <DashboardGrid 
              patrolRouteData={patrolRouteData} 
              workScheduleData={workScheduleData}
              userName={userName}
            />
          </TabsContent>
          
          {/* Centro de Comando Tab Content (from Index.tsx) */}
          {isInspetorOrSubinspetor && (
            <TabsContent value="centro-comando" className="space-y-6">
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
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
