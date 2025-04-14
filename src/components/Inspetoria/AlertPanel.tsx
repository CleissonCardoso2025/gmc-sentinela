
import React from 'react';
import EmptyState from '../Dashboard/EmptyState';

const AlertPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <EmptyState
        title="Sem alertas"
        description="Não há alertas pendentes no momento."
        icon="info"
      />
    </div>
  );
};

export default AlertPanel;
