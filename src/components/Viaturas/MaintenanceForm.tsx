
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
  maintenance?: Maintenance;
  onSave: (maintenance: Maintenance) => void;
  onCancel: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ 
  vehicle, 
  maintenance, 
  onSave, 
  onCancel 
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<Maintenance>(
    maintenance || {
      id: 0,
      veiculoId: vehicle?.id || 0,
      data: today,
      tipo: "Preventiva",
      quilometragem: vehicle?.quilometragem || 0,
      custo: 0,
      status: "Agendada",
      observacoes: "",
      descricao: ""
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "quilometragem" || name === "custo" 
        ? Number(value) 
        : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.data) {
      newErrors.data = "Data é obrigatória";
    }
    
    if (!formData.tipo) {
      newErrors.tipo = "Tipo de serviço é obrigatório";
    }
    
    if (!formData.descricao) {
      newErrors.descricao = "Descrição é obrigatória";
    }
    
    if (formData.quilometragem <= 0) {
      newErrors.quilometragem = "Quilometragem deve ser maior que zero";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        ...formData,
        veiculoId: vehicle?.id || 0
      });
    }
  };
  
  if (!vehicle) return <div>Selecione um veículo primeiro</div>;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="font-semibold">Viatura: {vehicle.placa} - {vehicle.modelo} {vehicle.marca}</h3>
        <p className="text-sm text-gray-600">Quilometragem atual: {vehicle.quilometragem.toLocaleString()} km</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data da Manutenção *</Label>
          <Input
            id="data"
            name="data"
            type="date"
            value={formData.data}
            onChange={handleChange}
            className={errors.data ? "border-red-500" : ""}
          />
          {errors.data && <p className="text-red-500 text-sm">{errors.data}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Serviço *</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => handleSelectChange("tipo", value)}
          >
            <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Preventiva">Preventiva</SelectItem>
              <SelectItem value="Corretiva">Corretiva</SelectItem>
              <SelectItem value="Revisão">Revisão</SelectItem>
              <SelectItem value="Troca de Óleo">Troca de Óleo</SelectItem>
              <SelectItem value="Troca de Pneus">Troca de Pneus</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quilometragem">Quilometragem (km) *</Label>
          <Input
            id="quilometragem"
            name="quilometragem"
            type="number"
            value={formData.quilometragem}
            onChange={handleChange}
            className={errors.quilometragem ? "border-red-500" : ""}
          />
          {errors.quilometragem && <p className="text-red-500 text-sm">{errors.quilometragem}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custo">Custo (R$)</Label>
          <Input
            id="custo"
            name="custo"
            type="number"
            step="0.01"
            value={formData.custo}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
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
        
        <div className="space-y-2">
          <Label htmlFor="previsaoTermino">Previsão de Término</Label>
          <Input
            id="previsaoTermino"
            name="previsaoTermino"
            type="date"
            value={formData.previsaoTermino || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição do Serviço *</Label>
        <Textarea
          id="descricao"
          name="descricao"
          rows={2}
          value={formData.descricao}
          onChange={handleChange}
          className={errors.descricao ? "border-red-500" : ""}
        />
        {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações Adicionais</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          value={formData.observacoes}
          onChange={handleChange}
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
