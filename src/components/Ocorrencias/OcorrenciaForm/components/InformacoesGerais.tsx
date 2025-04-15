
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, MapPin, Locate, Wand2 } from 'lucide-react';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const InformacoesGerais = () => {
  const {
    numero, setNumero,
    tipo, setTipo,
    status, setStatus,
    data, setData,
    hora, setHora,
    local, setLocal,
    descricao, setDescricao,
    locationLoading,
    locationError,
    handleGetCurrentLocation,
    setShowMap,
    handleCorrectText,
    isCorrectingText
  } = useOcorrenciaForm();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center text-gcm-600">
          <FileText className="mr-2 h-5 w-5" />
          Informações Gerais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Número da Ocorrência</Label>
            <Input 
              id="numero" 
              value={numero} 
              onChange={(e) => setNumero(e.target.value)} 
              readOnly 
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Ocorrência</Label>
            <Select value={tipo} onValueChange={(value: any) => setTipo(value)}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trânsito">Trânsito</SelectItem>
                <SelectItem value="Crime">Crime</SelectItem>
                <SelectItem value="Dano ao patrimônio público">Dano ao patrimônio público</SelectItem>
                <SelectItem value="Maria da Penha">Maria da Penha</SelectItem>
                <SelectItem value="Apoio a outra instituição">Apoio a outra instituição</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Encerrada">Encerrada</SelectItem>
                <SelectItem value="Encaminhada">Encaminhada</SelectItem>
                <SelectItem value="Sob Investigação">Sob Investigação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input 
              id="data" 
              type="date" 
              value={data} 
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hora">Hora</Label>
            <Input 
              id="hora" 
              type="time" 
              value={hora} 
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="local">Local</Label>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleGetCurrentLocation}
                className="text-gcm-500"
                disabled={locationLoading}
              >
                <Locate className="mr-1 h-4 w-4" />
                {locationLoading ? 'Obtendo...' : 'Minha Localização'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMap(true)}
                className="text-gcm-500"
              >
                <MapPin className="mr-1 h-4 w-4" />
                Selecionar no Mapa
              </Button>
            </div>
          </div>
          <Input 
            id="local" 
            value={local} 
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Endereço completo da ocorrência"
          />
          {locationError && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              {locationError}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva detalhadamente a ocorrência"
            className="h-32"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCorrectText}
            disabled={isCorrectingText || !descricao.trim()}
            className="text-gcm-500"
          >
            <Wand2 className="mr-1 h-4 w-4" />
            {isCorrectingText ? 'Corrigindo...' : 'Corrigir Texto'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformacoesGerais;
