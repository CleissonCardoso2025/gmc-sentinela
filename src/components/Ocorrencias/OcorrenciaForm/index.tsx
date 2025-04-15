
import React from 'react';
import { OcorrenciaFormProvider } from './OcorrenciaFormContext';
import OcorrenciaFormContainer from './OcorrenciaFormContainer';

export const OcorrenciaForm = () => {
  return (
    <OcorrenciaFormProvider>
      <OcorrenciaFormContainer />
    </OcorrenciaFormProvider>
  );
};
