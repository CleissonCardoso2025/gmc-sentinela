
import React from 'react';
import EmptyState from '@/components/Dashboard/EmptyState';

const InspetoriaOccurrences: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Ocorrências Cadastradas</h2>
      </div>

      <EmptyState 
        title="Sem ocorrências" 
        description="Nenhuma ocorrência foi registrada." 
        icon="info"
      />
    </div>
  );
};

export default InspetoriaOccurrences;
