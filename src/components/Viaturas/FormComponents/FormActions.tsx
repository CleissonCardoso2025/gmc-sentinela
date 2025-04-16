
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  disabled?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  disabled = false 
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={disabled}>
        Cancelar
      </Button>
      <Button type="submit" disabled={disabled}>
        {disabled ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
};

export default FormActions;
