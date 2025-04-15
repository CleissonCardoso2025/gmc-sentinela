
import { useState } from 'react';
import { ProvidenciaTomada } from '../types';

export const useProvidencias = () => {
  const [providencias, setProvidencias] = useState<ProvidenciaTomada[]>([
    { id: '1', label: 'Condução para Delegacia', checked: false },
    { id: '2', label: 'Orientação à vítima', checked: false },
    { id: '3', label: 'Relatório ao Ministério Público', checked: false },
    { id: '4', label: 'Encaminhamento médico', checked: false },
    { id: '5', label: 'Registro de Boletim de Ocorrência', checked: false },
    { id: '6', label: 'Isolamento do local', checked: false },
  ]);

  const handleToggleProvidencia = (id: string) => {
    setProvidencias(providencias.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const resetProvidencias = () => {
    setProvidencias(providencias.map(p => ({ ...p, checked: false })));
  };

  return {
    providencias,
    handleToggleProvidencia,
    resetProvidencias
  };
};
