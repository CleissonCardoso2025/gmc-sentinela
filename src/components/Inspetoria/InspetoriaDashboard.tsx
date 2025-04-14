
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, Clock } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import AlertPanel from './AlertPanel';
import EmptyState from "@/components/Dashboard/EmptyState";

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

  // Limpa todos os dados, mantendo apenas os valores de estado inicial
  const totalUsers = 0;
  const activeUsers = 0;
  const totalVehicles = 0;
  const availableVehicles = 0;
  const usersData = [];
  const vehiclesData = [];
  const isLoading = false;

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
            <EmptyState
              title="Sem dados disponíveis"
              description="Não há dados de ocorrências para exibir"
              icon="chart"
            />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Alertas do Sistema</h2>
            <EmptyState
              title="Sem alertas"
              description="Não há alertas pendentes no momento"
              icon="info"
            />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Progresso das Operações</h2>
            <EmptyState
              title="Sem operações"
              description="Não há operações em andamento"
              icon="info"
            />
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
          <EmptyState
            title="Sem usuários"
            description="Não há usuários cadastrados"
            icon="users"
          />
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
          <EmptyState
            title="Sem viaturas"
            description="Não há viaturas cadastradas"
            icon="vehicle"
          />
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
