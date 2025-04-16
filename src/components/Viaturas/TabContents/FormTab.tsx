
import React from 'react';
import { Card } from "@/components/ui/card";
import VehicleForm from "@/components/Viaturas/VehicleForm";
import { useVehicles } from '@/contexts/VehicleContext';

interface FormTabProps {
  formMode: "add" | "edit" | null;
  selectedVehicle: any;
  onCancel: () => void;
}

const FormTab: React.FC<FormTabProps> = ({ formMode, selectedVehicle, onCancel }) => {
  const { handleSaveVehicle, saveDisabled } = useVehicles();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {formMode === "add" ? "Adicionar Nova Viatura" : "Editar Viatura"}
      </h2>
      <VehicleForm 
        vehicle={selectedVehicle} 
        onSave={handleSaveVehicle} 
        onCancel={onCancel} 
        disabled={saveDisabled}
      />
    </Card>
  );
};

export default FormTab;
