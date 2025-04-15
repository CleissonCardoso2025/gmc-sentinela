
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const FormActions = () => {
  const { isLoading, resetForm } = useOcorrenciaForm();

  return (
    <div className="flex flex-col space-y-2">
      <Button 
        type="submit" 
        className="w-full bg-gcm-600 hover:bg-gcm-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>Salvando...</>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Ocorrência
          </>
        )}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full border-gcm-600 text-gcm-600 hover:bg-gcm-50"
        onClick={resetForm}
      >
        <X className="mr-2 h-4 w-4" />
        Limpar Formulário
      </Button>
    </div>
  );
};

export default FormActions;
