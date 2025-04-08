
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Route, CalendarDays, Clock, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";

interface PatrolLocation {
  id: number;
  name: string;
  time: string;
  status: string;
}

interface PatrolRouteData {
  name: string;
  locations: PatrolLocation[];
  startTime: string;
  endTime: string;
  date: string;
}

interface PatrolRouteCardProps {
  patrolRouteData: PatrolRouteData;
}

export const PatrolRouteCard: React.FC<PatrolRouteCardProps> = ({ patrolRouteData }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completo":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completo</Badge>;
      case "Pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-md animate-fade-up" style={{ animationDelay: '200ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Route className="h-5 w-5 mr-2 text-gcm-600" />
          Rota de Patrulhamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-3 border-b">
            <div className="flex items-center mb-2 sm:mb-0">
              <h3 className="font-medium">{patrolRouteData.name}</h3>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>{patrolRouteData.date}</span>
              <Clock className="h-4 w-4 ml-3 mr-1" />
              <span>{patrolRouteData.startTime} - {patrolRouteData.endTime}</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Local</TableHead>
                  <TableHead>Horário Previsto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patrolRouteData.locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gcm-600" />
                      {location.name}
                    </TableCell>
                    <TableCell>{location.time}</TableCell>
                    <TableCell>{getStatusBadge(location.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
