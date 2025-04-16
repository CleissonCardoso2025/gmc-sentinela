
import React, { useEffect } from 'react';
import { useInvestigationStats } from '@/hooks/use-investigation-stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown, Clock, CheckCircle, Archive } from 'lucide-react';

interface InvestigationStatsProps {
  refreshTrigger?: number;
}

export function InvestigationStats({ refreshTrigger = 0 }: InvestigationStatsProps) {
  const { stats, isLoading, refetch } = useInvestigationStats();
  
  // Refetch stats when refreshTrigger changes
  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Em andamento
          </CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.emAndamento}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.emAndamentoVariacao > 0 ? (
              <span className="text-green-500 flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" />
                +{stats.emAndamentoVariacao} desde o mês passado
              </span>
            ) : stats.emAndamentoVariacao < 0 ? (
              <span className="text-red-500 flex items-center">
                <ChevronDown className="h-3 w-3 mr-1" />
                {stats.emAndamentoVariacao} desde o mês passado
              </span>
            ) : (
              <span>Sem alteração desde o mês passado</span>
            )}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Concluídas
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.concluidas}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.concluidasVariacao > 0 ? (
              <span className="text-green-500 flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" />
                +{stats.concluidasVariacao} desde o mês passado
              </span>
            ) : stats.concluidasVariacao < 0 ? (
              <span className="text-red-500 flex items-center">
                <ChevronDown className="h-3 w-3 mr-1" />
                {stats.concluidasVariacao} desde o mês passado
              </span>
            ) : (
              <span>Sem alteração desde o mês passado</span>
            )}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Arquivadas
          </CardTitle>
          <Archive className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.arquivadas}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.arquivadasVariacao > 0 ? (
              <span className="text-green-500 flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" />
                +{stats.arquivadasVariacao} desde o mês passado
              </span>
            ) : stats.arquivadasVariacao < 0 ? (
              <span className="text-red-500 flex items-center">
                <ChevronDown className="h-3 w-3 mr-1" />
                {stats.arquivadasVariacao} desde o mês passado
              </span>
            ) : (
              <span>Sem alteração desde o mês passado</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
