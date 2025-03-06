
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, X, Save } from "lucide-react";

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

  // Mock data for available agents, supervisors and vehicles
  const availableAgents = [
    "Agente Carlos Pereira",
    "Agente Ana Melo",
    "Agente Paulo Santos",
    "Agente Juliana Campos",
    "Agente Ricardo Alves",
    "Agente Fernanda Lima",
    "Agente Lucas Martins",
    "Agente Carla Dias",
    "Agente Bruno Sousa"
  ];

  const availableSupervisors = [
    "Sgt. Roberto Silva",
    "Sgt. Marcos Oliveira",
    "Sgt. Pedro Costa",
    "Sgt. Márcio Dias"
  ];

  const availableVehicles = [
    "GCM-1234 (Spin)",
    "GCM-5678 (Hilux)",
    "GCM-9012 (Duster)"
  ];

  const [formData, setFormData] = useState({
    date: guarnicao?.date || "",
    period: guarnicao?.period || "diurno",
    supervisor: guarnicao?.supervisor || "",
    selectedAgents: guarnicao?.team || [],
    vehicle: guarnicao?.vehicle || "",
    observations: guarnicao?.observations || ""
  });

  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    guarnicao?.team || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.date || !formData.supervisor || selectedAgents.length < 2 || !formData.vehicle) {
      toast({
        title: "Formulário incompleto",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit form data
    toast({
      title: "Guarnição salva",
      description: "A guarnição foi salva com sucesso."
    });
    onSave();
  };

  const toggleAgentSelection = (agent: string) => {
    if (selectedAgents.includes(agent)) {
      setSelectedAgents(selectedAgents.filter(a => a !== agent));
    } else {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input 
            id="date" 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <Select 
            value={formData.period}
            onValueChange={(value) => setFormData({...formData, period: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diurno">Diurno</SelectItem>
              <SelectItem value="noturno">Noturno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supervisor">Supervisor</Label>
        <Select 
          value={formData.supervisor}
          onValueChange={(value) => setFormData({...formData, supervisor: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o supervisor" />
          </SelectTrigger>
          <SelectContent>
            {availableSupervisors.map((supervisor) => (
              <SelectItem key={supervisor} value={supervisor}>
                {supervisor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Equipe (selecione no mínimo 2 agentes)</Label>
        <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
          {availableAgents.map((agent) => (
            <div 
              key={agent} 
              className={`p-2 rounded-md flex items-center justify-between cursor-pointer ${
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
          ))}
        </div>
        {selectedAgents.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Agentes selecionados ({selectedAgents.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedAgents.map((agent) => (
                <Badge key={agent} className="bg-gcm-100 text-gcm-800 hover:bg-gcm-200">
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
        <Label htmlFor="vehicle">Viatura</Label>
        <Select 
          value={formData.vehicle}
          onValueChange={(value) => setFormData({...formData, vehicle: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a viatura" />
          </SelectTrigger>
          <SelectContent>
            {availableVehicles.map((vehicle) => (
              <SelectItem key={vehicle} value={vehicle}>
                {vehicle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea 
          id="observations" 
          value={formData.observations}
          onChange={(e) => setFormData({...formData, observations: e.target.value})}
          placeholder="Detalhes adicionais sobre a guarnição..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Salvar Guarnição
        </Button>
      </div>
    </form>
  );
};

export default GuarnicaoForm;
