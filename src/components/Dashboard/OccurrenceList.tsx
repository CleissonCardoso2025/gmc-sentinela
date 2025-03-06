
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Occurrence {
  titulo: string;
  local: string;
  hora: string;
}

interface OccurrenceListProps {
  occurrences?: Occurrence[];
  limit?: number;
}

const OccurrenceList: React.FC<OccurrenceListProps> = ({ occurrences = [], limit }) => {
  // Apply limit if provided
  const displayedOccurrences = limit ? occurrences.slice(0, limit) : occurrences;
  
  return (
    <Card className="shadow-md h-full animate-fade-up">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Últimas Ocorrências</h2>
      </div>
      
      <div className="p-4 space-y-3">
        {displayedOccurrences.length > 0 ? (
          displayedOccurrences.map((occurrence, index) => (
            <div 
              key={index} 
              className={cn(
                "p-3 rounded-lg border border-gray-100 transition-all duration-300",
                "hover:border-gray-200 hover:shadow-sm cursor-pointer",
                "animate-fade-up",
                { "animation-delay-100": index === 0 },
                { "animation-delay-200": index === 1 },
                { "animation-delay-300": index === 2 }
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h4 className="font-semibold text-gcm-600">{occurrence.titulo}</h4>
              <p className="text-gray-600 text-sm">{occurrence.local}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-500 text-xs">{occurrence.hora}</p>
                <span className="text-xs text-gcm-600 font-medium hover:underline">Ver detalhes</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhuma ocorrência registrada</p>
        )}
      </div>
    </Card>
  );
};

export default OccurrenceList;
