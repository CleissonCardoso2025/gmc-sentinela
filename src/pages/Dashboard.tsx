
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
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userProfile, setUserProfile] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API loading
    const loadUserData = async () => {
      setIsLoading(true);
      
      try {
        // In the future, replace with actual API call
        const storedUserName = localStorage.getItem("userName");
        const storedUserRole = localStorage.getItem("userRole");
        const storedUserProfile = localStorage.getItem("userProfile") || "Inspetor";
        
        setUserProfile(storedUserProfile);
        setUserName(storedUserName || "");
        setUserRole(storedUserRole || "");
        
        console.log("Perfil do usuário carregado:", storedUserProfile);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleTabChange = (value: string) => {
    if (value === "centro-comando") {
      console.log("Switched to Centro de Comando tab");
    } else if (value === "dashboard") {
      console.log("Switched to Dashboard tab");
    }
  };

  const goToIndexPage = () => {
    navigate('/index');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <WelcomeHeader userName={userName} role={userRole} />
        )}
        
        <Tabs defaultValue="dashboard" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            
            <TabsTrigger value="centro-comando" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Centro de Comando
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="space-y-6">
              <QuickStats />
              <QuickActions />
            </div>
            
            <div className="w-full">
              <AlertBoard maxDisplayedAlerts={3} />
            </div>
            
            <DashboardGrid 
              patrolRouteData={null} 
              workScheduleData={null}
              userName={userName}
            />
          </TabsContent>
          
          <TabsContent value="centro-comando" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard 
                title="Viaturas em Operação" 
                value={0} 
                icon={<Car className="h-5 w-5 text-gcm-600" />}
                color="text-gcm-600"
                className="animate-fade-up"
                isLoading={true}
              />
              <StatCard 
                title="Ocorrências Ativas" 
                value={0} 
                icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
                color="text-red-600"
                className="animate-fade-up"
                isLoading={true}
              />
              <StatCard 
                title="Efetivo em Serviço" 
                value={0} 
                icon={<Users className="h-5 w-5 text-green-600" />}
                color="text-green-600"
                className="animate-fade-up delay-75"
                isLoading={true}
              />
              <StatCard 
                title="Alertas de Manutenção" 
                value={0} 
                icon={<Settings className="h-5 w-5 text-amber-600" />}
                color="text-amber-600"
                className="animate-fade-up delay-100"
                isLoading={true}
              />
            </div>
            
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              <div className="lg:col-span-2">
                <VehicleTable vehicles={[]} maintenances={[]} />
              </div>
              <div>
                <OccurrenceList occurrences={[]} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
