
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  readOnly?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isEditing,
  readOnly = false 
}) => {
  if (readOnly) return null;
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditing ? 'Salvar' : 'Criar Usuário'}
      </Button>
    </div>
  );
};

export default FormActions;
