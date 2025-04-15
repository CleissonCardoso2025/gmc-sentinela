
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ClipboardCheck } from 'lucide-react';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const ProvidenciasTomadas = () => {
  const { providencias, handleToggleProvidencia } = useOcorrenciaForm();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center text-gcm-600">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Providências Tomadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {providencias.map((providencia) => (
            <div key={providencia.id} className="flex items-center space-x-2">
              <Checkbox
                id={`providencia-${providencia.id}`}
                checked={providencia.checked}
                onCheckedChange={() => handleToggleProvidencia(providencia.id)}
              />
              <Label
                htmlFor={`providencia-${providencia.id}`}
                className="cursor-pointer"
              >
                {providencia.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProvidenciasTomadas;
