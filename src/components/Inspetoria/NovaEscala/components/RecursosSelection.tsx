
import React, { useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RecursosSelectionProps } from '../types';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RecursosSelection: React.FC<RecursosSelectionProps> = ({
  selectedGuarnicaoId,
  setSelectedGuarnicaoId,
  selectedViaturaId,
  setSelectedViaturaId,
  selectedRotaId,
  setSelectedRotaId,
  supervisor,
  setSupervisor,
  guarnicoes,
  viaturas,
  rotas,
  isLoading
}) => {
  // Auto-fill supervisor when guarnicao is selected
  useEffect(() => {
    if (selectedGuarnicaoId) {
      const selectedGuarnicao = guarnicoes.find(g => g.id === selectedGuarnicaoId);
      if (selectedGuarnicao) {
        setSupervisor(selectedGuarnicao.supervisor);
      }
    }
  }, [selectedGuarnicaoId, guarnicoes, setSupervisor]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. Selecione os Recursos</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {guarnicoes.length > 0 ? (
              <Select 
                value={selectedGuarnicaoId || ""}
                onValueChange={setSelectedGuarnicaoId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma guarnição" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {guarnicoes.map(guarnicao => (
                    <SelectItem key={guarnicao.id} value={guarnicao.id}>
                      {guarnicao.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Nenhuma guarnição encontrada. Cadastre guarnições primeiro.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supervisor">Supervisor</Label>
            <Input
              id="supervisor"
              value={supervisor}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Preenchido automaticamente com base na guarnição selecionada
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="viatura">Viatura</Label>
            {viaturas.length > 0 ? (
              <Select 
                value={selectedViaturaId || ""}
                onValueChange={setSelectedViaturaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma viatura" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {viaturas.map(viatura => (
                    <SelectItem key={viatura.id} value={viatura.id}>
                      {viatura.codigo} ({viatura.modelo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Nenhuma viatura encontrada. Cadastre viaturas primeiro.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rota">Rota de Patrulhamento</Label>
            {rotas.length > 0 ? (
              <Select 
                value={selectedRotaId || ""}
                onValueChange={setSelectedRotaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma rota" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {rotas.map(rota => (
                    <SelectItem key={rota.id} value={rota.id}>
                      {rota.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Nenhuma rota encontrada. Cadastre rotas primeiro.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecursosSelection;
