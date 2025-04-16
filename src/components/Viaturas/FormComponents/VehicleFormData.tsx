
import React from 'react';
import FormField from './FormField';
import SelectField from './SelectField';
import { Vehicle } from "@/pages/Viaturas";

interface VehicleFormDataProps {
  formData: Vehicle;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  disabled?: boolean;
}

const vehicleTypes = [
  { value: "Patrulha", label: "Patrulha" },
  { value: "Transporte", label: "Transporte" },
  { value: "Administrativa", label: "Administrativa" },
  { value: "Especializada", label: "Especializada" }
];

const vehicleStatus = [
  { value: "Em serviço", label: "Em serviço" },
  { value: "Manutenção", label: "Manutenção" },
  { value: "Inoperante", label: "Inoperante" },
  { value: "Reserva", label: "Reserva" }
];

const VehicleFormData: React.FC<VehicleFormDataProps> = ({
  formData,
  errors,
  handleChange,
  handleSelectChange,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        id="placa"
        name="placa"
        label="Placa"
        value={formData.placa}
        onChange={handleChange}
        error={errors.placa}
        disabled={disabled}
        required
      />
      
      <FormField
        id="modelo"
        name="modelo"
        label="Modelo"
        value={formData.modelo}
        onChange={handleChange}
        error={errors.modelo}
        disabled={disabled}
        required
      />
      
      <FormField
        id="marca"
        name="marca"
        label="Marca"
        value={formData.marca}
        onChange={handleChange}
        error={errors.marca}
        disabled={disabled}
        required
      />
      
      <FormField
        id="ano"
        name="ano"
        label="Ano de Fabricação"
        value={formData.ano}
        onChange={handleChange}
        error={errors.ano}
        disabled={disabled}
        required
      />
      
      <SelectField
        id="tipo"
        name="tipo"
        label="Tipo de Viatura"
        value={formData.tipo}
        onValueChange={(value) => handleSelectChange("tipo", value)}
        options={vehicleTypes}
        disabled={disabled}
      />
      
      <SelectField
        id="status"
        name="status"
        label="Status"
        value={formData.status}
        onValueChange={(value) => handleSelectChange("status", value)}
        options={vehicleStatus}
        disabled={disabled}
      />
      
      <FormField
        id="quilometragem"
        name="quilometragem"
        label="Quilometragem Atual (km)"
        value={formData.quilometragem}
        onChange={handleChange}
        type="number"
        disabled={disabled}
      />
      
      <FormField
        id="proximaManutencao"
        name="proximaManutencao"
        label="Próxima Manutenção"
        value={formData.proximaManutencao}
        onChange={handleChange}
        type="date"
        disabled={disabled}
      />
    </div>
  );
};

export default VehicleFormData;
