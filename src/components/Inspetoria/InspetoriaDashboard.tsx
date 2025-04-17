
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, Clock, Megaphone } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertBoard } from '@/components/Dashboard/AlertBoard';
import EmptyState from "@/components/Dashboard/EmptyState";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DateRangeType } from '@/hooks/use-occurrence-data';
import Chart from '@/components/Dashboard/Chart';
import UserList from '@/components/Dashboard/UserList';
import VehicleList from '@/components/Dashboard/VehicleList';

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

  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [availableVehicles, setAvailableVehicles] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [occurrencesByType, setOccurrencesByType] = useState([]);
  const [tasksProgress, setTasksProgress] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch users data
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*');
        
        if (usersError) throw usersError;
        
        const activeUsersList = users?.filter(user => user.status === true) || [];
        setTotalUsers(users?.length || 0);
        setActiveUsers(activeUsersList.length);
        setUsersData(users || []);

        // Fetch vehicles data
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('viaturas')
          .select('*');
        
        if (vehiclesError) throw vehiclesError;
        
        // Ideally we would have a status field to determine available vehicles
        // For now, let's assume all are available as a placeholder
        setTotalVehicles(vehicles?.length || 0);
        setAvailableVehicles(vehicles?.length || 0);
        setVehiclesData(vehicles || []);

        // Fetch alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (alertsError) throw alertsError;
        setAlerts(alertsData || []);

        // Fetch occurrences by type using the date range
        const fromDate = format(date.from, 'yyyy-MM-dd');
        const toDate = format(date.to, 'yyyy-MM-dd');
        
        const { data: occurrences, error: occurrencesError } = await supabase
          .from('ocorrencias')
          .select('tipo, id')
          .gte('created_at', `${fromDate}T00:00:00`)
          .lte('created_at', `${toDate}T23:59:59`);
        
        if (occurrencesError) throw occurrencesError;
        
        // Process occurrences by type for chart
        const occurrenceTypes = {};
        occurrences?.forEach(occurrence => {
          const tipo = occurrence.tipo;
          occurrenceTypes[tipo] = (occurrenceTypes[tipo] || 0) + 1;
        });
        
        const chartData = Object.keys(occurrenceTypes).map(type => ({
          name: type,
          quantidade: occurrenceTypes[type]
        }));
        
        setOccurrencesByType(chartData);
        
        // For tasks progress, we could use the escala_items or another relevant table
        // For now, using a placeholder
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar os dados do dashboard.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [date, toast]);

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
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : occurrencesByType.length > 0 ? (
              <Chart date={{from: date.from, to: date.to} as DateRangeType} />
            ) : (
              <EmptyState
                title="Sem dados disponíveis"
                description="Não há dados de ocorrências para exibir"
                icon="info"
              />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Alertas do Sistema</h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : alerts.length > 0 ? (
              <AlertBoard maxDisplayedAlerts={5} showViewAll={false} />
            ) : (
              <EmptyState
                title="Sem alertas"
                description="Não há alertas pendentes no momento"
                icon="info"
              />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Progresso das Operações</h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <EmptyState
                title="Sem operações"
                description="Não há operações em andamento"
                icon="info"
              />
            )}
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
          {isLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : usersData.length > 0 ? (
            <UserList users={usersData} />
          ) : (
            <EmptyState
              title="Sem usuários"
              description="Não há usuários cadastrados"
              icon="users"
            />
          )}
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
          {isLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : vehiclesData.length > 0 ? (
            <VehicleList vehicles={vehiclesData} />
          ) : (
            <EmptyState
              title="Sem viaturas"
              description="Não há viaturas cadastradas"
              icon="car"
            />
          )}
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
