
import React from 'react';

interface EscalaLegendProps {
  filteredDataCount: number;
  totalDataCount: number;
}

const EscalaLegend: React.FC<EscalaLegendProps> = ({ filteredDataCount, totalDataCount }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm">Presente</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm">Folga</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm">Licença</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm">Falta</span>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        Exibindo {filteredDataCount} de {totalDataCount} escalas
      </div>
    </div>
  );
};

export default EscalaLegend;
