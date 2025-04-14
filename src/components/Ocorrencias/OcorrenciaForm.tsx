import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MapPin, Search, FileText, Check, Users, Paperclip, Save, X, Camera, Clock, AlertTriangle, List, MapIcon, Wand2, Plus, Trash2, Phone, User, Ambulance, ClipboardCheck, ClipboardList, Shield, Locate } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GoogleMapComponent from '@/components/Map/GoogleMap';
import { MapMarker } from '@/types/maps';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { useAgentsData } from '@/hooks/use-agents-data';
import { useGeolocation } from '@/hooks/use-geolocation';

type OcorrenciaStatus = 'Aberta' | 'Encerrada' | 'Encaminhada' | 'Sob Investigação';
type OcorrenciaTipo = 'Trânsito' | 'Crime' | 'Dano ao patrimônio público' | 'Maria da Penha' | 'Apoio a outra instituição' | 'Outros';
type VinculoOcorrencia = 'Vítima' | 'Suspeito' | 'Testemunha';
type EstadoAparente = 'Lúcido' | 'Alterado' | 'Ferido';

interface Envolvido {
  nome: string;
  apelido?: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  endereco: string;
  telefone: string;
  vinculo: VinculoOcorrencia;
  estadoAparente: EstadoAparente;
}

interface ProvidenciaTomada {
  id: string;
  label: string;
  checked: boolean;
}

export const OcorrenciaForm = () => {
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState<OcorrenciaTipo>('Trânsito');
  const [status, setStatus] = useState<OcorrenciaStatus>('Aberta');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [envolvidos, setEnvolvidos] = useState<Envolvido[]>([]);
  const [showAddEnvolvido, setShowAddEnvolvido] = useState(false);
  const [position, setPosition] = useState<MapMarker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  
  const { agents, isLoading: agentsLoading, error: agentsError } = useAgentsData();
  const { location, loading: locationLoading, error: locationError, refreshPosition } = useGeolocation();
  
  const [providencias, setProvidencias] = useState<ProvidenciaTomada[]>([
    { id: '1', label: 'Condução para Delegacia', checked: false },
    { id: '2', label: 'Orientação à vítima', checked: false },
    { id: '3', label: 'Relatório ao Ministério Público', checked: false },
    { id: '4', label: 'Encaminhamento médico', checked: false },
    { id: '5', label: 'Registro de Boletim de Ocorrência', checked: false },
    { id: '6', label: 'Isolamento do local', checked: false },
  ]);

  useEffect(() => {
    const generateOcorrenciaNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `BO-${year}${month}${day}-${randomDigits}`;
    };

    setNumero(generateOcorrenciaNumber());
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().split(' ')[0].substring(0, 5);
    
    setData(formattedDate);
    setHora(formattedTime);
  }, []);

  const handleMapClick = (marker: MapMarker) => {
    setPosition(marker);
    setLocal(marker.address || 'Endereço não identificado');
    setShowMap(false);
  };

  const handleToggleProvidencia = (id: string) => {
    setProvidencias(providencias.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const handleAgentSelection = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      toast.info('Buscando sua localização atual...');
      
      refreshPosition();
      
      if (location.latitude && location.longitude) {
        setPosition({
          id: 'current-location',
          position: [location.latitude, location.longitude],
          title: 'Localização Atual',
          lat: location.latitude,
          lng: location.longitude,
          address: 'Obtendo endereço...'
        });
        
        try {
          const { data, error } = await supabase.functions.invoke('geocode', {
            body: { 
              address: `${location.latitude},${location.longitude}`, 
              reverse: true 
            }
          });
          
          if (error) {
            console.error('Error getting address:', error);
            toast.error('Não foi possível obter o endereço, mas suas coordenadas foram salvas');
            return;
          }
          
          if (data && data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setLocal(address);
            toast.success('Localização atual obtida com sucesso');
          } else {
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            toast.warning('Localização obtida, mas sem endereço identificável');
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
          toast.warning('Localização obtida, mas sem endereço identificável');
        }
      } else {
        toast.error('Não foi possível obter sua localização. Verifique as permissões do navegador.');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error('Erro ao obter localização atual');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!local || !descricao) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const dateTime = `${data}T${hora}`;
      
      const ocorrenciaData = {
        numero,
        tipo,
        status,
        data: dateTime,
        local,
        descricao,
        latitude: position?.lat,
        longitude: position?.lng,
        providencias: providencias.filter(p => p.checked).map(p => p.label),
        envolvidos,
        agentes_envolvidos: selectedAgents,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('ocorrencias')
        .insert(ocorrenciaData);
      
      if (error) throw error;
      
      toast.success('Ocorrência registrada com sucesso!');
      
      setTipo('Trânsito');
      setStatus('Aberta');
      setLocal('');
      setDescricao('');
      setPosition(null);
      setEnvolvidos([]);
      setProvidencias(providencias.map(p => ({ ...p, checked: false })));
      setSelectedAgents([]);
      
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setNumero(`BO-${year}${month}${day}-${randomDigits}`);
      
    } catch (error) {
      console.error('Error saving occurrence:', error);
      toast.error('Erro ao registrar ocorrência. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
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
                  <Select value={tipo} onValueChange={(value) => setTipo(value as OcorrenciaTipo)}>
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
                  <Select value={status} onValueChange={(value) => setStatus(value as OcorrenciaStatus)}>
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
                    <AlertTriangle className="h-3 w-3 mr-1" />
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center text-gcm-600">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Providências Tomadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {providencias.map((providencia) => (
                  <div key={providencia.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`providencia-${providencia.id}`}
                      checked={providencia.checked}
                      onCheckedChange={() => handleToggleProvidencia(providencia.id)}
                    />
                    <Label
                      htmlFor={`providencia-${providencia.id}`}
                      className="cursor-pointer"
                    >
                      {providencia.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center text-gcm-600">
                <Shield className="mr-2 h-5 w-5" />
                Agentes Envolvidos
              </CardTitle>
              <p className="text-sm text-muted-foreground">Guarnição Atual</p>
            </CardHeader>
            <CardContent>
              {agentsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : agentsError ? (
                <div className="text-sm text-red-500">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Erro ao carregar agentes
                </div>
              ) : agents.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Nenhum agente disponível
                </div>
              ) : (
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                      <Checkbox
                        id={`agent-${agent.id}`}
                        checked={selectedAgents.includes(agent.id)}
                        onCheckedChange={() => handleAgentSelection(agent.id)}
                      />
                      <div>
                        <Label
                          htmlFor={`agent-${agent.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {agent.nome}
                        </Label>
                        {agent.patente && (
                          <p className="text-xs text-muted-foreground">{agent.patente}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full bg-gcm-600 hover:bg-gcm-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Ocorrência
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-gcm-600 text-gcm-600 hover:bg-gcm-50"
              onClick={() => {
                setTipo('Trânsito');
                setStatus('Aberta');
                setLocal('');
                setDescricao('');
                setPosition(null);
                setEnvolvidos([]);
                setProvidencias(providencias.map(p => ({ ...p, checked: false })));
                setSelectedAgents([]);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar Formulário
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Selecione a localização da ocorrência</DialogTitle>
            <DialogDescription>
              Clique no mapa para marcar o local exato da ocorrência
            </DialogDescription>
          </DialogHeader>
          <div className="h-[500px] w-full">
            <GoogleMapComponent 
              markers={position ? [position] : []} 
              onMapClick={handleMapClick}
              draggable
              searchBox
              showUserLocation
            />
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};
