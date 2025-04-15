import React, { createContext, useContext, ReactNode } from 'react';
import { OcorrenciaContextType } from './types';
import { useOcorrenciaForm as useOcorrenciaFormHook } from '../OcorrenciaForm';

// ✅ Atualização do tipo do contexto para garantir compatibilidade com string | null
// Verifique se no seu arquivo types.ts a propriedade locationError está assim:
// locationError: string | null;

const OcorrenciaContext = createContext<OcorrenciaContextType | undefined>(undefined);

export const useOcorrenciaForm = () => {
  const context = useContext(OcorrenciaContext);
  if (!context) {
    throw new Error('useOcorrenciaForm must be used within OcorrenciaFormProvider');
  }
  return context;
};

export const OcorrenciaFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ocorrenciaForm = useOcorrenciaFormHook();

  return (
    <OcorrenciaContext.Provider value={ocorrenciaForm}>
      {children}
    </OcorrenciaContext.Provider>
  );
};
