
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Occurrence } from '@/hooks/use-occurrence-data';
import { useOccurrenceData } from '@/hooks/use-occurrence-data';
import EmptyState from './EmptyState';

const OccurrenceList = () => {
  const navigate = useNavigate();
  const { occurrences, isLoading } = useOccurrenceData('7d');

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="h-full animate-fade-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
          Ocorrências Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-6 pb-6 space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : occurrences.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              title="Sem ocorrências" 
              description="Não há ocorrências registradas recentemente." 
              icon="info" 
            />
          </div>
        ) : (
          <div className="divide-y">
            {occurrences.slice(0, 5).map((occurrence, index) => (
              <div 
                key={occurrence.id} 
                className="p-4 hover:bg-gray-50 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {occurrence.titulo || occurrence.tipo}
                    </h3>
                    <p className="text-sm text-gray-600">{occurrence.local}</p>
                  </div>
                  <Badge 
                    variant={occurrence.status === 'Aberta' ? 'destructive' : 'outline'}
                    className="ml-2"
                  >
                    {occurrence.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(occurrence.data)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => navigate(`/ocorrencias/${occurrence.id}`)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {occurrences.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => navigate('/ocorrencias')}
            >
              Ver todas as ocorrências
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OccurrenceList;
