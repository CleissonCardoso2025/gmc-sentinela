
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const AgentesEnvolvidos = () => {
  const { agents, agentsLoading, agentsError, selectedAgents, handleAgentSelection } = useOcorrenciaForm();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center text-gcm-600">
          <Shield className="mr-2 h-5 w-5" />
          Agentes Envolvidos
        </CardTitle>
        <p className="text-sm text-muted-foreground">Guarnição Atual</p>
      </CardHeader>
      <CardContent>
        {agentsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : agentsError ? (
          <div className="text-sm text-red-500">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Erro ao carregar agentes
          </div>
        ) : agents.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            Nenhum agente disponível
          </div>
        ) : (
          <div className="space-y-2">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                <Checkbox
                  id={`agent-${agent.id}`}
                  checked={selectedAgents.includes(agent.id)}
                  onCheckedChange={() => handleAgentSelection(agent.id)}
                />
                <div>
                  <Label
                    htmlFor={`agent-${agent.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {agent.nome}
                  </Label>
                  {agent.patente && (
                    <p className="text-xs text-muted-foreground">{agent.patente}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentesEnvolvidos;
