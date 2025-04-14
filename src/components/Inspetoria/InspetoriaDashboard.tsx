
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, FileText, Users, Car, MapPin, AlertTriangle } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import AlertPanel from './AlertPanel';

// Lazy load the components for better performance
const RecentOccurrences = React.lazy(() => import('@/components/Dashboard/RecentOccurrences'));
const TasksProgress = React.lazy(() => import('@/components/Dashboard/TasksProgress'));
const Chart = React.lazy(() => import('@/components/Dashboard/Chart'));
const UserList = React.lazy(() => import('@/components/Dashboard/UserList'));
const VehicleList = React.lazy(() => import('@/components/Dashboard/VehicleList'));

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, loading }) => {
  return (
    <Card className="shadow-md">
      <CardContent className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium">{title}</h2>
          {loading ? (
            <Skeleton className="h-4 w-[100px]" />
          ) : (
            <div className="text-2xl font-semibold">{value}</div>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : (
          icon
        )}
      </CardContent>
    </Card>
  );
};

const InspetoriaDashboard: React.FC = () => {
  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [availableVehicles, setAvailableVehicles] = useState<number>(0);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
	const [vehiclesData, setVehiclesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch total users
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('count', { count: 'exact' });
        if (usersError) throw usersError;
        setTotalUsers(users ? users[0].count : 0);

        // Fetch active users
        const { data: active, error: activeError } = await supabase
          .from('users')
          .select('count', { count: 'exact' })
          .eq('status', true);
        if (activeError) throw activeError;
        setActiveUsers(active ? active[0].count : 0);
        
        // Fetch users data
        const { data: usersDataResult, error: usersDataError } = await supabase
          .from('users')
          .select('*')
          .limit(5);
        if (usersDataError) throw usersDataError;
        setUsersData(usersDataResult || []);

        // Fetch total vehicles
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('viaturas')
          .select('count', { count: 'exact' });
        if (vehiclesError) throw vehiclesError;
        setTotalVehicles(vehicles ? vehicles[0].count : 0);

        // Fetch available vehicles (you might need to adjust the query based on your database structure)
        const { data: available, error: availableError } = await supabase
          .from('viaturas')
          .select('count', { count: 'exact' }); // Add condition if you have a status column
        if (availableError) throw availableError;
        setAvailableVehicles(available ? available[0].count : 0);
				
				// Fetch vehicles data
        const { data: vehiclesDataResult, error: vehiclesDataError } = await supabase
          .from('viaturas')
          .select('*')
          .limit(5);
        if (vehiclesDataError) throw vehiclesDataError;
        setVehiclesData(vehiclesDataResult || []);

        // Fetch recent logs (example, adjust based on your actual logs table)
        const { data: logs, error: logsError } = await supabase
          .from('ocorrencias')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        if (logsError) throw logsError;
        setRecentLogs(logs || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do painel.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total de Usuários"
          value={totalUsers}
          icon={<Users className="h-8 w-8 text-gcm-500" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Usuários Ativos"
          value={activeUsers}
          icon={<Users className="h-8 w-8 text-green-500" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Total de Viaturas"
          value={totalVehicles}
          icon={<Car className="h-8 w-8 text-gcm-500" />}
          loading={isLoading}
        />
        <DashboardCard
          title="Viaturas Disponíveis"
          value={availableVehicles}
          icon={<Car className="h-8 w-8 text-green-500" />}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-semibold">Ocorrências por tipo</h2>
              <DateRangePicker date={date} setDate={setDate} />
            </div>
            <React.Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <Chart date={date} />
            </React.Suspense>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Alertas do Sistema</h2>
            <AlertPanel />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Progresso das Operações</h2>
            <React.Suspense fallback={<Skeleton className="h-[240px] w-full" />}>
              <TasksProgress />
            </React.Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-md">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lista de Usuários</h2>
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {totalUsers}
              </Badge>
            </div>
          </div>
          <React.Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            {usersData && <UserList users={usersData} />}
          </React.Suspense>
        </Card>

        <Card className="shadow-md">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lista de Viaturas</h2>
              <Badge variant="secondary">
                <Car className="h-3 w-3 mr-1" />
                {totalVehicles}
              </Badge>
            </div>
          </div>
          <React.Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            {vehiclesData && (
              <VehicleList 
                vehicles={vehiclesData.map(vehicle => ({
                  ...vehicle,
                  status: vehicle.status || "Ativo", // Provide default status
                  quilometragem: vehicle.quilometragem || 0, // Provide default quilometragem
                  proximaManutencao: vehicle.proximaManutencao || new Date().toISOString() // Provide default proximaManutencao
                }))} 
              />
            )}
          </React.Suspense>
        </Card>
      </div>
    </div>
  );
};

interface DateRangePickerProps {
  date: { from: Date; to: Date };
  setDate: (date: { from: Date; to: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ date, setDate }) => {
  return (
    <div className="flex items-center space-x-2">
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {date?.from && date?.to ? (
          <>
            {format(date.from, "dd MMM yyyy", { locale: ptBR })} - {format(date.to, "dd MMM yyyy", { locale: ptBR })}
          </>
        ) : (
          "Selecione um período"
        )}
      </span>
    </div>
  );
};

export default InspetoriaDashboard;
