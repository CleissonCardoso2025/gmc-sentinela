
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, X, Save, Loader2 } from "lucide-react";
import { useAgentsData } from "@/hooks/use-agents-data";
import { supabase } from "@/integrations/supabase/client";

interface GuarnicaoFormProps {
  onSave: () => void;
  onCancel: () => void;
  guarnicao?: any;
}

const GuarnicaoForm: React.FC<GuarnicaoFormProps> = ({ 
  onSave, 
  onCancel,
  guarnicao 
}) => {
  const { toast } = useToast();
  const { agents, isLoading, error } = useAgentsData();
  const [isSaving, setIsSaving] = useState(false);

  // Separate agents by role (supervisors and regular agents)
  const availableSupervisors = agents
    .filter(agent => agent.patente === 'Supervisor' || agent.patente === 'Inspetor' || agent.patente === 'Subinspetor')
    .map(agent => agent.nome);

  const availableAgents = agents
    .filter(agent => agent.patente === 'Agente' || (!agent.patente && agent.nome !== guarnicao?.supervisor))
    .map(agent => agent.nome);

  const [formData, setFormData] = useState({
    name: guarnicao?.nome || "",
    supervisor: guarnicao?.supervisor || "",
    observations: guarnicao?.observations || ""
  });

  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    guarnicao?.membros?.map((m: any) => m.nome) || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Validate form
    if (!formData.name || !formData.supervisor || selectedAgents.length < 1) {
      toast({
        title: "Formulário incompleto",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    
    try {
      console.log("Saving guarnicao:", formData);
      
      // Insert guarnicao
      const { data: guarnicaoData, error: guarnicaoError } = await supabase
        .from('guarnicoes')
        .insert([{
          nome: formData.name,
          supervisor: formData.supervisor
        }])
        .select()
        .single();
      
      if (guarnicaoError) throw guarnicaoError;
      
      console.log("Guarnicao saved:", guarnicaoData);
      
      // Insert members
      if (selectedAgents.length > 0) {
        const membrosToInsert = selectedAgents.map(agentName => ({
          nome: agentName,
          guarnicao_id: guarnicaoData.id,
          funcao: 'Agente' // Default role
        }));
        
        console.log("Inserting members:", membrosToInsert);
        
        const { error: membrosError } = await supabase
          .from('membros_guarnicao')
          .insert(membrosToInsert);
        
        if (membrosError) throw membrosError;
      }
      
      toast({
        title: "Guarnição salva",
        description: "A guarnição foi salva com sucesso."
      });
      
      onSave();
    } catch (error: any) {
      console.error("Error saving guarnicao:", error);
      toast({
        title: "Erro ao salvar guarnição",
        description: error.message || "Não foi possível salvar a guarnição.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAgentSelection = (agent: string) => {
    if (selectedAgents.includes(agent)) {
      setSelectedAgents(selectedAgents.filter(a => a !== agent));
    } else {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando usuários...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Erro ao carregar usuários: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Guarnição</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Digite o nome da guarnição"
          className="transition-all duration-200 focus:border-primary"
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supervisor">Supervisor</Label>
        <Select 
          value={formData.supervisor}
          onValueChange={(value) => setFormData({...formData, supervisor: value})}
          disabled={isSaving}
        >
          <SelectTrigger className="transition-all duration-200 hover:border-primary">
            <SelectValue placeholder="Selecione o supervisor" />
          </SelectTrigger>
          <SelectContent>
            {availableSupervisors.length > 0 ? (
              availableSupervisors.map((supervisor) => (
                <SelectItem key={supervisor} value={supervisor}>
                  {supervisor}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-supervisors" disabled>
                Nenhum supervisor disponível
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Equipe (selecione no mínimo 1 agente)</Label>
        <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
          {availableAgents.length > 0 ? (
            availableAgents.map((agent) => (
              <div 
                key={agent} 
                className={`p-2 rounded-md flex items-center justify-between cursor-pointer transition-colors duration-200 ${
                  selectedAgents.includes(agent) 
                    ? 'bg-gcm-50 border border-gcm-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleAgentSelection(agent)}
              >
                <span>{agent}</span>
                {selectedAgents.includes(agent) && (
                  <CheckCircle className="h-4 w-4 text-gcm-600" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Nenhum agente disponível
            </div>
          )}
        </div>
        {selectedAgents.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Agentes selecionados ({selectedAgents.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedAgents.map((agent) => (
                <Badge key={agent} className="bg-gcm-100 text-gcm-800 hover:bg-gcm-200 animate-fade-in">
                  {agent}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAgentSelection(agent);
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea 
          id="observations" 
          value={formData.observations}
          onChange={(e) => setFormData({...formData, observations: e.target.value})}
          placeholder="Detalhes adicionais sobre a guarnição..."
          rows={3}
          className="transition-all duration-200 focus:border-primary"
          disabled={isSaving}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="transition-all duration-200 hover:bg-muted"
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="transition-all duration-200 hover:bg-primary/90"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Guarnição
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default GuarnicaoForm;
