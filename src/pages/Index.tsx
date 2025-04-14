
import React from 'react';
import StatCard from '@/components/Dashboard/StatCard';
import OccurrenceMap from '@/components/Dashboard/OccurrenceMap';
import VehicleTrackingMap from '@/components/Dashboard/VehicleTrackingMap';
import VehicleTable from '@/components/Dashboard/VehicleTable';
import OccurrenceList from '@/components/Dashboard/OccurrenceList';
import { Car, AlertTriangle, Users, Settings } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Dashboard from '@/layouts/Dashboard';
import { useOccurrenceData } from '@/hooks/use-occurrence-data';
import { useVehicleLocations } from '@/hooks/use-vehicle-locations';
import { QuickStats } from '@/components/Dashboard/QuickStats';

const Index = () => {
  // Usar hooks reais para obter dados do banco de dados
  const { occurrences } = useOccurrenceData('7d');
  const { vehicles } = useVehicleLocations();
  
  return (
    <Dashboard>
      <div className="p-6 h-full">
        {/* Stats/Métricas */}
        <div className="mb-6">
          <QuickStats />
        </div>
        
        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Viaturas em Operação" 
            value={vehicles.length} 
            icon={<Car className="h-5 w-5 text-gcm-600" />}
            color="text-gcm-600"
            className="animate-fade-up"
          />
          <StatCard 
            title="Ocorrências Ativas" 
            value={occurrences.filter(o => o.status === 'Aberta').length} 
            icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
            color="text-red-600"
            className="animate-fade-up"
          />
          <StatCard 
            title="Efetivo em Serviço" 
            value={0} 
            icon={<Users className="h-5 w-5 text-green-600" />}
            color="text-green-600"
            className="animate-fade-up delay-75"
          />
          <StatCard 
            title="Alertas de Manutenção" 
            value={0} 
            icon={<Settings className="h-5 w-5 text-amber-600" />}
            color="text-amber-600"
            className="animate-fade-up delay-100"
          />
        </div>
        
        {/* Mapas com Tabs */}
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
        
        {/* Tabelas e Listas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <div className="lg:col-span-2">
            <VehicleTable vehicles={[]} maintenances={[]} />
          </div>
          <div>
            <OccurrenceList occurrences={[]} />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
