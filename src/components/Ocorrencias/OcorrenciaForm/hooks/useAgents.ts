
import { useState, useEffect } from 'react';
import { useAgentsData } from '@/hooks/use-agents-data';
import { AgentParticipation } from '../types';

export const useAgents = () => {
  const [agents, setAgents] = useState<AgentParticipation[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const { agents: agentsList, isLoading: agentsLoading, error: agentsError } = useAgentsData();

  useEffect(() => {
    if (agentsList && agentsList.length > 0) {
      setAgents(agentsList.map(agent => ({
        id: agent.id,
        name: agent.nome,
        role: agent.patente || '',
        nome: agent.nome,
        patente: agent.patente
      })));
    }
  }, [agentsList]);

  const handleAgentSelection = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const resetAgents = () => {
    setSelectedAgents([]);
  };

  return {
    agents,
    agentsLoading,
    agentsError,
    selectedAgents,
    handleAgentSelection,
    resetAgents
  };
};
