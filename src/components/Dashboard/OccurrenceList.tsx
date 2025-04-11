
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from './EmptyState';
import { Occurrence } from '@/hooks/use-occurrence-data';

interface OccurrenceListProps {
  occurrences?: Occurrence[];
  limit?: number;
  isLoading?: boolean;
}

const OccurrenceList: React.FC<OccurrenceListProps> = ({ 
  occurrences = [], 
  limit,
  isLoading = false
}) => {
  // Apply limit if provided
  const displayedOccurrences = limit ? occurrences.slice(0, limit) : occurrences;
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }
    
    if (displayedOccurrences.length === 0) {
      return (
        <div className="p-4">
          <EmptyState 
            title="Sem ocorrências" 
            description="Não há ocorrências registradas." 
            icon="info"
          />
        </div>
      );
    }
    
    return (
      <div className="p-4 space-y-3">
        {displayedOccurrences.map((occurrence, index) => (
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
              <p className="text-gray-500 text-xs">
                {new Date(occurrence.data).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <span className="text-xs text-gcm-600 font-medium hover:underline">Ver detalhes</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="shadow-md h-full animate-fade-up">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Últimas Ocorrências</h2>
      </div>
      
      {renderContent()}
    </Card>
  );
};

export default OccurrenceList;
