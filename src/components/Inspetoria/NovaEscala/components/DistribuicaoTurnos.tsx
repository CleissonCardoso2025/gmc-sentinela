
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shuffle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DistribuicaoTurnosProps } from '../types';

const DistribuicaoTurnos: React.FC<DistribuicaoTurnosProps> = ({
  selectedGuarnicao,
  handleSortSchedule,
  escalaType,
  setEscalaType
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">3. Distribua os Turnos</CardTitle>
        <CardDescription>Configuração da escala de trabalho</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="escalaType">Tipo de Escala</Label>
            <Select 
              value={escalaType}
              onValueChange={setEscalaType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de escala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24/72">Escala 24h/72h</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Distribuição de trabalho 24h seguidas de 72h de folga
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
              <p className="text-xs text-yellow-700">
                Ao sortear, o sistema distribuirá automaticamente os turnos no padrão 24h de trabalho seguido por 72h de folga.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleSortSchedule} 
            className="w-full"
            disabled={!selectedGuarnicao}
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Sortear Escala
          </Button>
          
          <p className="text-xs text-muted-foreground mt-1">
            Você poderá ajustar manualmente os turnos após o sorteio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistribuicaoTurnos;
