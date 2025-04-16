
import React, { useState, useEffect } from 'react';
import { Vehicle } from "@/pages/Viaturas";
import FormActions from './FormComponents/FormActions';
import VehicleFormData from './FormComponents/VehicleFormData';
import TextAreaField from './FormComponents/TextAreaField';

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
      <VehicleFormData 
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        disabled={disabled}
      />
      
      <TextAreaField
        id="observacoes"
        name="observacoes"
        label="Observações"
        value={formData.observacoes}
        onChange={handleChange}
        disabled={disabled}
      />
      
      <FormActions onCancel={onCancel} disabled={disabled} />
    </form>
  );
};

export default VehicleForm;
