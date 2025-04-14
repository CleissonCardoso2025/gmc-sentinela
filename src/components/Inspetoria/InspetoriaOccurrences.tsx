
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, MapPin, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useOccurrenceData, Occurrence } from "@/hooks/use-occurrence-data";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import OccurrenceEditForm from './OccurrenceEditForm';
import EmptyState from '@/components/Dashboard/EmptyState';

const InspetoriaOccurrences: React.FC = () => {
  const { occurrences, isLoading, refetchOccurrences } = useOccurrenceData('12m');
  const [editingOccurrence, setEditingOccurrence] = useState<string | null>(null);

  const handleSaveEdit = (updatedOccurrence: any) => {
    // In a real application, this would update the occurrence in the database
    console.log("Saving updated occurrence:", updatedOccurrence);
    
    // For now, we'll just close the edit form
    setEditingOccurrence(null);
    
    // In a real app with a proper backend, we would refetch after saving
    refetchOccurrences();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gcm-600"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "HH:mm", { locale: ptBR });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          Ocorrências Cadastradas
        </h2>
      </div>

      {occurrences.length === 0 ? (
        <EmptyState 
          title="Sem ocorrências" 
          description="Nenhuma ocorrência foi registrada nos últimos 12 meses." 
          icon="info"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {occurrences.map((occurrence) => (
            <Card 
              key={occurrence.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              {editingOccurrence === occurrence.id ? (
                <CardContent className="p-4">
                  <OccurrenceEditForm
                    occurrence={occurrence}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingOccurrence(null)}
                  />
                </CardContent>
              ) : (
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{occurrence.titulo || occurrence.tipo}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingOccurrence(occurrence.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm">{occurrence.local}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(occurrence.data)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{formatTime(occurrence.data)}</span>
                    </div>
                  </div>
                  
                  {occurrence.descricao && (
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                      {occurrence.descricao}
                    </p>
                  )}
                  
                  {occurrence.status && (
                    <div className="mt-3">
                      <Badge 
                        variant="outline" 
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {occurrence.status}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspetoriaOccurrences;
