
import React from 'react';
import { AlertTriangle } from "lucide-react";

const EscalaInfo: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Informações da escala</h3>
          <p className="text-sm text-yellow-700 mt-1">
            As escalas seguem o turno de 24h por 72h. A guarnição, viatura e rota selecionadas ficarão 
            disponíveis para todos os guardas escalados. O supervisor do plantão tem acesso à lista completa da escala.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EscalaInfo;
