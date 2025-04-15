
import React from 'react';
import { useOcorrenciaForm } from './OcorrenciaFormContext';
import InformacoesGerais from './components/InformacoesGerais';
import AnexosOcorrencia from './components/AnexosOcorrencia';
import ProvidenciasTomadas from './components/ProvidenciasTomadas';
import AgentesEnvolvidos from './components/AgentesEnvolvidos';
import MapDialog from './components/MapDialog';
import CameraDialog from './components/CameraDialog';
import FormActions from './components/FormActions';

const OcorrenciaFormContainer = () => {
  const { handleSubmit, showMap, showCameraDialog } = useOcorrenciaForm();

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <InformacoesGerais />
          <AnexosOcorrencia />
          <ProvidenciasTomadas />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <AgentesEnvolvidos />
          <FormActions />
        </div>
      </div>

      {showMap && <MapDialog />}
      {showCameraDialog && <CameraDialog />}
    </form>
  );
};

export default OcorrenciaFormContainer;
