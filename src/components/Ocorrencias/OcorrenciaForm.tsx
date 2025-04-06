
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Search, FileText, Check, Users, Paperclip, Save, X, Camera, Clock, AlertTriangle, List, MapIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LeafletMap from '@/components/Map/LeafletMap';
import { MapMarker } from '@/types/maps';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

type OcorrenciaStatus = 'Aberta' | 'Encerrada' | 'Encaminhada' | 'Sob Investigação';
type OcorrenciaTipo = 'Trânsito' | 'Crime' | 'Dano ao patrimônio público' | 'Maria da Penha' | 'Apoio a outra instituição' | 'Outros';

export const OcorrenciaForm = () => {
  const [numero, setNumero] = useState<string>('');
  const [data, setData] = useState<string>(new Date().toISOString().slice(0, 16));
  const [local, setLocal] = useState<string>('');
  const [coordenadas, setCoordenadas] = useState<{lat: number, lng: number} | null>(null);
  const [tipo, setTipo] = useState<OcorrenciaTipo | ''>('');
  const [outroTipo, setOutroTipo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [agentes, setAgentes] = useState<string[]>([]);
  const [status, setStatus] = useState<OcorrenciaStatus>('Aberta');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anexos, setAnexos] = useState<File[]>([]);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  
  // Simulação de agentes da guarnição atual
  const guarnicaoAtual = [
    { id: '1', nome: 'Carlos Silva', patente: 'Guarda Civil' },
    { id: '2', nome: 'Mariana Santos', patente: 'Guarda Civil' },
    { id: '3', nome: 'João Oliveira', patente: 'Supervisor' },
  ];

  // Atualiza os marcadores do mapa quando as coordenadas mudam
  useEffect(() => {
    if (coordenadas) {
      setMapMarkers([
        {
          id: 'local-ocorrencia',
          position: [coordenadas.lat, coordenadas.lng],
          title: 'Local da Ocorrência',
          content: local || 'Local selecionado',
          icon: 'incident'
        }
      ]);
    } else {
      setMapMarkers([]);
    }
  }, [coordenadas, local]);

  // Função para gerar número de ocorrência
  const gerarNumeroOcorrencia = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `OCR-${year}${month}${day}-${random}`;
  };

  // Capturar localização via GPS
  const capturarLocalizacao = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordenadas({ lat: latitude, lng: longitude });
          
          // Buscar endereço usando geocodificação reversa
          try {
            const endereco = await obterEnderecoPorCoordenadas(latitude, longitude);
            setLocal(endereco);
            toast.success('Localização capturada com sucesso!');
          } catch (error) {
            console.error('Erro ao obter o endereço:', error);
            setLocal(`Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`);
            toast.warning('Localização capturada, mas não foi possível obter o endereço completo.');
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Erro ao capturar localização:', error);
          toast.error('Não foi possível capturar a localização. Verifique as permissões.');
          setIsLoading(false);
        }
      );
    } else {
      toast.error('Geolocalização não suportada por este navegador.');
      setIsLoading(false);
    }
  };

  // Obter endereço a partir de coordenadas (geocodificação reversa)
  const obterEnderecoPorCoordenadas = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { address: `${latitude},${longitude}`, reverse: true }
      });
      
      if (error) throw new Error(error.message);
      
      if (data && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      
      throw new Error('Nenhum resultado encontrado');
    } catch (error) {
      console.error('Erro ao geocodificar:', error);
      throw error;
    }
  };

  // Abrir seleção de localização no mapa
  const abrirMapaSelecao = () => {
    setIsMapOpen(true);
  };

  // Atualiza as coordenadas quando o usuário clica no mapa
  const handleMapClick = async (location: { lat: number, lng: number }) => {
    setCoordenadas(location);
    
    try {
      setIsLoading(true);
      const endereco = await obterEnderecoPorCoordenadas(location.lat, location.lng);
      setLocal(endereco);
      toast.success('Localização selecionada com sucesso!');
    } catch (error) {
      console.error('Erro ao obter o endereço:', error);
      setLocal(`Latitude: ${location.lat.toFixed(6)}, Longitude: ${location.lng.toFixed(6)}`);
      toast.warning('Localização selecionada, mas não foi possível obter o endereço completo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Correção automática de texto (simplificada para demonstração)
  const corrigirTexto = () => {
    setIsLoading(true);
    
    // Em um cenário real, isso usaria uma API de correção ortográfica
    // Aqui apenas simulamos com algumas correções básicas
    const textoCorrigido = descricao
      .replace(/\s+/g, ' ')
      .replace(/\s+\./g, '.')
      .replace(/\s+,/g, ',')
      .trim();
    
    setTimeout(() => {
      setDescricao(textoCorrigido);
      toast.success('Texto corrigido com sucesso!');
      setIsLoading(false);
    }, 1000);
  };

  // Lidar com upload de anexos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAnexos((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} arquivo(s) anexado(s) com sucesso!`);
    }
  };

  // Remover anexo
  const removeAnexo = (index: number) => {
    setAnexos(anexos.filter((_, i) => i !== index));
  };

  // Salvar ocorrência
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validação básica
    if (!local || !tipo || !descricao) {
      toast.error('Preencha todos os campos obrigatórios.');
      setIsLoading(false);
      return;
    }
    
    // Gerar número de ocorrência se não existir
    if (!numero) {
      setNumero(gerarNumeroOcorrencia());
    }
    
    // Simulando envio para API
    setTimeout(() => {
      toast.success('Ocorrência registrada com sucesso!');
      setIsLoading(false);
      
      // Em um cenário real, redirecionaria para a lista ou detalhes da ocorrência
      // No nosso exemplo, apenas limpa o formulário
      setDescricao('');
      setLocal('');
      setCoordenadas(null);
      setTipo('');
      setOutroTipo('');
      setAnexos([]);
      setNumero('');
    }, 1500);
  };

  // Cancelar e voltar
  const handleCancel = () => {
    if (window.confirm('Deseja realmente cancelar? Todas as alterações serão perdidas.')) {
      // Em um cenário real, redirecionaria para a lista de ocorrências
      setDescricao('');
      setLocal('');
      setCoordenadas(null);
      setTipo('');
      setOutroTipo('');
      setAnexos([]);
      setNumero('');
      toast.info('Registro de ocorrência cancelado.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-gcm-600" />
          Registro de Nova Ocorrência
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Número da Ocorrência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="numero">Número da Ocorrência</Label>
              <Input
                id="numero"
                value={numero || 'Será gerado automaticamente'}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>
            
            {/* Data e Hora */}
            <div className="space-y-2">
              <Label htmlFor="data" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data e Hora do Fato
              </Label>
              <Input
                id="data"
                type="datetime-local"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Local da Ocorrência */}
          <div className="space-y-2">
            <Label htmlFor="local" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local da Ocorrência
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  id="local"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  placeholder="Digite o endereço completo"
                  className="w-full"
                  required
                />
                {coordenadas && (
                  <p className="text-xs text-gray-500 mt-1">
                    Coordenadas GPS: {coordenadas.lat.toFixed(6)}, {coordenadas.lng.toFixed(6)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={capturarLocalizacao}
                  disabled={isLoading}
                  className="whitespace-nowrap"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Usar GPS
                </Button>
                
                <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      <MapIcon className="h-4 w-4 mr-2" />
                      Selecionar no Mapa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Selecione a localização da ocorrência</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <LeafletMap 
                        center={coordenadas ? [coordenadas.lat, coordenadas.lng] : [-23.550520, -46.633308]} 
                        markers={mapMarkers}
                        zoom={15}
                        height="h-[400px]"
                        onMapClick={handleMapClick}
                        markerType="incident"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Clique no mapa para selecionar o local exato da ocorrência.
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button type="button" variant="outline" onClick={() => setIsMapOpen(false)}>
                        Fechar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          {/* Tipo da Ocorrência */}
          <div className="space-y-2">
            <Label htmlFor="tipo" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Tipo da Ocorrência
            </Label>
            <Select value={tipo} onValueChange={(value: OcorrenciaTipo) => setTipo(value)}>
              <SelectTrigger id="tipo" className="w-full">
                <SelectValue placeholder="Selecione o tipo de ocorrência" />
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
            
            {tipo === 'Outros' && (
              <Input
                className="mt-2"
                value={outroTipo}
                onChange={(e) => setOutroTipo(e.target.value)}
                placeholder="Especifique o tipo da ocorrência"
                required
              />
            )}
          </div>
          
          {/* Descrição da Ocorrência */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="descricao" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrição da Ocorrência
              </Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={corrigirTexto}
                disabled={isLoading || !descricao}
                className="flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Corrigir Texto
              </Button>
            </div>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva detalhadamente a ocorrência..."
              className="min-h-[150px]"
              required
            />
          </div>
          
          {/* Agentes Envolvidos */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agentes Envolvidos (Guarnição Atual)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md bg-gray-50">
              {guarnicaoAtual.map((agente) => (
                <div key={agente.id} className="flex items-center gap-2 p-2 border rounded bg-white">
                  <input
                    type="checkbox"
                    id={`agente-${agente.id}`}
                    checked={agentes.includes(agente.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAgentes([...agentes, agente.id]);
                      } else {
                        setAgentes(agentes.filter((id) => id !== agente.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor={`agente-${agente.id}`} className="flex-1 text-sm">
                    {agente.nome}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {agente.patente}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Evidências e Anexos */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Evidências e Anexos
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="mx-auto flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Anexar Fotos / Vídeos
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-2">
                Formatos aceitos: imagens, vídeos e PDFs
              </p>
            </div>
            
            {/* Lista de anexos */}
            {anexos.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Arquivos anexados:</p>
                <div className="space-y-2">
                  {anexos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAnexo(index)}
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Status da Ocorrência */}
          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Status da Ocorrência
            </Label>
            <Select value={status} onValueChange={(value: OcorrenciaStatus) => setStatus(value as OcorrenciaStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Encerrada">Encerrada</SelectItem>
                <SelectItem value="Encaminhada">Encaminhada</SelectItem>
                <SelectItem value="Sob Investigação">Sob Investigação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gcm-600 hover:bg-gcm-700 text-white flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar e Registrar Ocorrência
              {isLoading && <span className="ml-2 animate-spin">⏳</span>}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar e Voltar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
