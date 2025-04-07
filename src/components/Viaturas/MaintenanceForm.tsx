
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Vehicle, Maintenance } from "@/pages/Viaturas";

interface MaintenanceFormProps {
  vehicle: Vehicle | null;
  onSave: (maintenance: Maintenance) => void;
  onCancel: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ vehicle, onSave, onCancel }) => {
  const [maintenance, setMaintenance] = useState<Partial<Maintenance>>({
    veiculoId: vehicle?.id || 0,
    data: new Date().toISOString().split('T')[0],
    tipo: "Preventiva",
    quilometragem: vehicle?.quilometragem || 0,
    custo: 0,
    status: "Agendada",
    descricao: "",
    observacoes: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setMaintenance({
      ...maintenance,
      [name]: name === "quilometragem" || name === "custo" ? Number(value) : value
    });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setMaintenance({
      ...maintenance,
      [field]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave(maintenance as Maintenance);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="font-medium">Informações do Veículo</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm font-medium">Placa:</p>
            <p className="text-sm">{vehicle?.placa}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Modelo:</p>
            <p className="text-sm">{vehicle?.marca} {vehicle?.modelo}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Status Atual:</p>
            <p className="text-sm">{vehicle?.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Quilometragem Atual:</p>
            <p className="text-sm">{vehicle?.quilometragem} km</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="data">Data da Manutenção</Label>
          <Input
            id="data"
            name="data"
            type="date"
            value={maintenance.data}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Manutenção</Label>
          <Select 
            value={maintenance.tipo} 
            onValueChange={(value) => handleSelectChange("tipo", value)}
          >
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Preventiva">Preventiva</SelectItem>
              <SelectItem value="Corretiva">Corretiva</SelectItem>
              <SelectItem value="Revisão">Revisão</SelectItem>
              <SelectItem value="Troca de Óleo">Troca de Óleo</SelectItem>
              <SelectItem value="Troca de Peças">Troca de Peças</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quilometragem">Quilometragem na Manutenção</Label>
          <Input
            id="quilometragem"
            name="quilometragem"
            type="number"
            value={maintenance.quilometragem}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custo">Custo (R$)</Label>
          <Input
            id="custo"
            name="custo"
            type="number"
            step="0.01"
            value={maintenance.custo}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status da Manutenção</Label>
          <Select 
            value={maintenance.status} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Agendada">Agendada</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Concluída">Concluída</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {maintenance.status === "Agendada" && (
          <div className="space-y-2">
            <Label htmlFor="previsaoTermino">Previsão de Término</Label>
            <Input
              id="previsaoTermino"
              name="previsaoTermino"
              type="date"
              value={maintenance.previsaoTermino || ""}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição do Serviço</Label>
        <Textarea
          id="descricao"
          name="descricao"
          placeholder="Descreva o serviço a ser realizado"
          value={maintenance.descricao}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações Adicionais</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          placeholder="Observações adicionais sobre a manutenção"
          value={maintenance.observacoes}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Manutenção
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
