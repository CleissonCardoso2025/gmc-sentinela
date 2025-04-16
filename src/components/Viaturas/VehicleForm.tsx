
import React, { useState, useEffect } from 'react';
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
import { Vehicle } from "@/pages/Viaturas";

interface VehicleFormProps {
  vehicle: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
  onCancel: () => void;
  disabled?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  vehicle, 
  onSave, 
  onCancel, 
  disabled = false 
}) => {
  const initialState: Vehicle = {
    id: 0,
    placa: "",
    modelo: "",
    marca: "",
    ano: new Date().getFullYear().toString(),
    tipo: "Patrulha",
    status: "Em serviço",
    quilometragem: 0,
    ultimaManutencao: new Date().toISOString().split('T')[0],
    proximaManutencao: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    observacoes: ""
  };

  const [formData, setFormData] = useState<Vehicle>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else {
      setFormData(initialState);
    }
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "quilometragem" ? Number(value) : value
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
    
    if (!formData.placa) {
      newErrors.placa = "Placa é obrigatória";
    }
    
    if (!formData.modelo) {
      newErrors.modelo = "Modelo é obrigatório";
    }
    
    if (!formData.marca) {
      newErrors.marca = "Marca é obrigatória";
    }
    
    if (!formData.ano) {
      newErrors.ano = "Ano é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    if (validate()) {
      onSave({
        ...formData,
        id: vehicle?.id || 0
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="placa">Placa *</Label>
          <Input
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            className={errors.placa ? "border-red-500" : ""}
            disabled={disabled}
          />
          {errors.placa && <p className="text-red-500 text-sm">{errors.placa}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className={errors.modelo ? "border-red-500" : ""}
            disabled={disabled}
          />
          {errors.modelo && <p className="text-red-500 text-sm">{errors.modelo}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            className={errors.marca ? "border-red-500" : ""}
            disabled={disabled}
          />
          {errors.marca && <p className="text-red-500 text-sm">{errors.marca}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ano">Ano de Fabricação *</Label>
          <Input
            id="ano"
            name="ano"
            value={formData.ano}
            onChange={handleChange}
            className={errors.ano ? "border-red-500" : ""}
            disabled={disabled}
          />
          {errors.ano && <p className="text-red-500 text-sm">{errors.ano}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Viatura</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => handleSelectChange("tipo", value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Patrulha">Patrulha</SelectItem>
              <SelectItem value="Transporte">Transporte</SelectItem>
              <SelectItem value="Administrativa">Administrativa</SelectItem>
              <SelectItem value="Especializada">Especializada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Em serviço">Em serviço</SelectItem>
              <SelectItem value="Manutenção">Manutenção</SelectItem>
              <SelectItem value="Inoperante">Inoperante</SelectItem>
              <SelectItem value="Reserva">Reserva</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quilometragem">Quilometragem Atual (km)</Label>
          <Input
            id="quilometragem"
            name="quilometragem"
            type="number"
            value={formData.quilometragem}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="proximaManutencao">Próxima Manutenção</Label>
          <Input
            id="proximaManutencao"
            name="proximaManutencao"
            type="date"
            value={formData.proximaManutencao}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          rows={4}
          value={formData.observacoes}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={disabled}>
          Cancelar
        </Button>
        <Button type="submit" disabled={disabled}>
          {disabled ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
