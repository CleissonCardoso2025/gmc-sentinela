
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isEditing,
  isSubmitting = false,
  readOnly = false 
}) => {
  if (readOnly) return null;
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Salvando...' : 'Criando...'}
          </>
        ) : (
          isEditing ? 'Salvar' : 'Criar Usuário'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
