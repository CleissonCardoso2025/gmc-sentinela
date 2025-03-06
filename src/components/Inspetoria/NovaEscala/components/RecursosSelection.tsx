
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecursosSelectionProps } from '../types';
import { guarnicoes, viaturas, rotas } from '../constants';

const RecursosSelection: React.FC<RecursosSelectionProps> = ({
  selectedGuarnicaoId,
  setSelectedGuarnicaoId,
  selectedViaturaId,
  setSelectedViaturaId,
  selectedRotaId,
  setSelectedRotaId
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">2. Selecione os Recursos</CardTitle>
        <CardDescription>Guarnição, viatura e rota</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="guarnicao">Guarnição</Label>
            <Select 
              value={selectedGuarnicaoId}
              onValueChange={setSelectedGuarnicaoId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma guarnição" />
              </SelectTrigger>
              <SelectContent>
                {guarnicoes.map(guarnicao => (
                  <SelectItem key={guarnicao.id} value={guarnicao.id}>
                    {guarnicao.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="viatura">Viatura</Label>
            <Select 
              value={selectedViaturaId}
              onValueChange={setSelectedViaturaId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma viatura" />
              </SelectTrigger>
              <SelectContent>
                {viaturas.map(viatura => (
                  <SelectItem key={viatura.id} value={viatura.id}>
                    {viatura.codigo} ({viatura.modelo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rota">Rota de Patrulhamento</Label>
            <Select 
              value={selectedRotaId}
              onValueChange={setSelectedRotaId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma rota" />
              </SelectTrigger>
              <SelectContent>
                {rotas.map(rota => (
                  <SelectItem key={rota.id} value={rota.id}>
                    {rota.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecursosSelection;
