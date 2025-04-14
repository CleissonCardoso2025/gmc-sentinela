
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Car, CheckCircle, AlertCircle, Clock, Wrench, Eye } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicleLocations } from '@/hooks/use-vehicle-locations';
import EmptyState from './EmptyState';

interface VehicleTableProps {
  vehicles?: Array<any>;
  maintenances?: Array<any>;
}

const VehicleTable: React.FC<VehicleTableProps> = () => {
  const navigate = useNavigate();
  const { vehicles, isLoading } = useVehicleLocations();
  
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'em serviço':
      case 'ativo':
      case 'disponível':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Em serviço</Badge>;
      case 'manutenção':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Manutenção</Badge>;
      case 'indisponível':
      case 'baixada':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Indisponível</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Desconhecido</Badge>;
    }
  };
  
  return (
    <Card className="w-full h-full animate-fade-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Car className="h-5 w-5 mr-2 text-gcm-600" />
          Situação das Viaturas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="px-6 pb-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              title="Sem viaturas" 
              description="Não há viaturas cadastradas no sistema." 
              icon="car" 
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Viatura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Condutor</TableHead>
                <TableHead className="hidden md:table-cell">Última Atualização</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((viatura) => (
                <TableRow key={viatura.id}>
                  <TableCell className="font-medium">{viatura.placa}</TableCell>
                  <TableCell>{getStatusBadge(viatura.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {viatura.condutor || "Não designado"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {viatura.lastUpdate ? new Date(viatura.lastUpdate).toLocaleString('pt-BR') : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {vehicles.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => navigate('/viaturas')}
            >
              Gerenciar viaturas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleTable;
