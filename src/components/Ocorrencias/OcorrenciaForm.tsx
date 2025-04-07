import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Search, FileText, Check, Users, Paperclip, Save, X, Camera, Clock, AlertTriangle, List, MapIcon, Wand2, Plus, Trash2, Phone, User, Ambulance, ClipboardCheck, ClipboardList, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GoogleMapComponent from '@/components/Map/GoogleMap';
import { MapMarker } from '@/types/maps';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [numero, setNumero] = useState<string>('');
  const [data, setData] = useState<string>(new Date().toISOString().slice(0, 16));
  const [local, setLocal] = useState<string>('');
  const [enderecoCompleto, setEnderecoCompleto] = useState<string>('');
  const [coordenadas, setCoordenadas] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [tipo, setTipo] = useState<OcorrenciaTipo | ''>('');
  const [outroTipo, setOutroTipo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [agentes, setAgentes] = useState<string[]>([]);
  const [status, setStatus] = useState<OcorrenciaStatus>('Aberta');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCorrigindoTexto, setIsCorrigindoTexto] = useState<boolean>(false);
  const [anexos, setAnexos] = useState<File[]>([]);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [geocodeStatus, setGeocodeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [envolvidos, setEnvolvidos] = useState<Envolvido[]>([{
    nome: '',
    apelido: '',
    dataNascimento: '',
    rg: '',
    cpf: '',
    endereco: '',
    telefone: '',
    vinculo: 'Vítima',
    estadoAparente: 'Lúcido'
  }]);
  const [providenciasTomadas, setProvidenciasTomadas] = useState<ProvidenciaTomada[]>([{
    id: 'orientacao',
    label: 'Orientação às partes',
    checked: false
  }, {
    id: 'delegacia',
    label: 'Condução à Delegacia',
    checked: false
  }, {
    id: 'samu',
    label: 'Acionamento do SAMU',
    checked: false
  }, {
    id: 'conselho',
    label: 'Encaminhamento ao Conselho Tutelar',
    checked: false
  }, {
    id: 'apoio',
    label: 'Apoio à PM / Polícia Civil',
    checked: false
  }]);
  const [outrasProvidencias, setOutrasProvidencias] = useState<string>('');
  const guarnicaoAtual = [{
    id: '1',
    nome: 'Carlos Silva',
    patente: 'Guarda Civil'
  }, {
    id: '2',
    nome: 'Mariana Santos',
    patente: 'Guarda Civil'
  }, {
    id: '3',
    nome: 'João Oliveira',
    patente: 'Supervisor'
  }];
  useEffect(() => {
    if (coordenadas) {
      setMapMarkers([{
        id: 'local-ocorrencia',
        position: [coordenadas.lat, coordenadas.lng],
        title: 'Local da Ocorrência',
        content: local || enderecoCompleto || 'Local selecionado',
        icon: 'incident'
      }]);
    } else {
      setMapMarkers([]);
    }
  }, [coordenadas, local, enderecoCompleto]);
  const gerarNumeroOcorrencia = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `OCR-${year}${month}${day}-${random}`;
  };
  const capturarLocalizacao = () => {
    setIsLoading(true);
    setGeocodeStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const {
          latitude,
          longitude
        } = position.coords;
        setCoordenadas({
          lat: latitude,
          lng: longitude
        });
        try {
          const endereco = await obterEnderecoPorCoordenadas(latitude, longitude);
          const partes = endereco.split(',');
          if (partes.length > 1) {
            setLocal(partes[0].trim());
            setEnderecoCompleto(endereco);
          } else {
            setLocal(endereco);
            setEnderecoCompleto(endereco);
          }
          setGeocodeStatus('success');
          toast.success('Localização capturada com sucesso!');
        } catch (error) {
          console.error('Erro ao obter o endereço:', error);
          const coordsText = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
          setLocal('Local não identificado');
          setEnderecoCompleto(coordsText);
          setGeocodeStatus('error');
          toast.warning('Localização capturada, mas não foi possível obter o endereço completo.');
        } finally {
          setIsLoading(false);
        }
      }, error => {
        console.error('Erro ao capturar localização:', error);
        setGeocodeStatus('error');
        toast.error('Não foi possível capturar a localização. Verifique as permissões.');
        setIsLoading(false);
      });
    } else {
      setGeocodeStatus('error');
      toast.error('Geolocalização não suportada por este navegador.');
      setIsLoading(false);
    }
  };
  const obterEnderecoPorCoordenadas = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('geocode', {
        body: {
          address: `${latitude},${longitude}`,
          reverse: true
        }
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }
      if (data && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      throw new Error('Nenhum resultado encontrado');
    } catch (error) {
      console.error('Erro ao geocodificar:', error);
      throw error;
    }
  };
  const abrirMapaSelecao = () => {
    setIsMapOpen(true);
  };
  const handleMapClick = async (location: {
    lat: number;
    lng: number;
  }) => {
    setCoordenadas(location);
    try {
      setIsLoading(true);
      setGeocodeStatus('loading');
      const endereco = await obterEnderecoPorCoordenadas(location.lat, location.lng);
      const partes = endereco.split(',');
      if (partes.length > 1) {
        setLocal(partes[0].trim());
        setEnderecoCompleto(endereco);
      } else {
        setLocal(endereco);
        setEnderecoCompleto(endereco);
      }
      setGeocodeStatus('success');
      toast.success('Localização selecionada com sucesso!');
    } catch (error) {
      console.error('Erro ao obter o endereço:', error);
      const coordsText = `Latitude: ${location.lat.toFixed(6)}, Longitude: ${location.lng.toFixed(6)}`;
      setLocal('Local não identificado');
      setEnderecoCompleto(coordsText);
      setGeocodeStatus('error');
      toast.warning('Localização selecionada, mas não foi possível obter o endereço completo.');
    } finally {
      setIsLoading(false);
    }
  };
  const corrigirTexto = async () => {
    if (!descricao.trim()) {
      toast.error('Não há texto para corrigir.');
      return;
    }
    try {
      setIsCorrigindoTexto(true);
      const {
        data,
        error
      } = await supabase.functions.invoke('text-correction', {
        body: {
          text: descricao
        }
      });
      if (error) {
        throw new Error(error.message);
      }
      if (data?.correctedText) {
        setDescricao(data.correctedText);
        toast.success('Texto corrigido com sucesso!');
      } else {
        throw new Error('Não foi possível obter o texto corrigido.');
      }
    } catch (error) {
      console.error('Erro ao corrigir texto:', error);
      toast.error('Não foi possível corrigir o texto. Tente novamente mais tarde.');
    } finally {
      setIsCorrigindoTexto(false);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAnexos(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} arquivo(s) anexado(s) com sucesso!`);
    }
  };
  const removeAnexo = (index: number) => {
    setAnexos(anexos.filter((_, i) => i !== index));
  };
  const adicionarEnvolvido = () => {
    setEnvolvidos([...envolvidos, {
      nome: '',
      apelido: '',
      dataNascimento: '',
      rg: '',
      cpf: '',
      endereco: '',
      telefone: '',
      vinculo: 'Vítima',
      estadoAparente: 'Lúcido'
    }]);
    toast.success('Novo envolvido adicionado');
  };
  const removerEnvolvido = (index: number) => {
    if (envolvidos.length === 1) {
      toast.error('É necessário pelo menos um envolvido');
      return;
    }
    const novosEnvolvidos = [...envolvidos];
    novosEnvolvidos.splice(index, 1);
    setEnvolvidos(novosEnvolvidos);
    toast.success('Envolvido removido');
  };
  const atualizarEnvolvido = (index: number, campo: keyof Envolvido, valor: string) => {
    const novosEnvolvidos = [...envolvidos];
    novosEnvolvidos[index] = {
      ...novosEnvolvidos[index],
      [campo]: valor
    };
    setEnvolvidos(novosEnvolvidos);
  };
  const toggleProvidencia = (id: string) => {
    setProvidenciasTomadas(providenciasTomadas.map(item => item.id === id ? {
      ...item,
      checked: !item.checked
    } : item));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!local || !tipo || !descricao) {
      toast.error('Preencha todos os campos obrigatórios.');
      setIsLoading(false);
      return;
    }
    if (!numero) {
      setNumero(gerarNumeroOcorrencia());
    }
    const hasValidInvolveds = envolvidos.some(env => env.nome.trim() !== '');
    if (!hasValidInvolveds) {
      toast.error('Adicione ao menos um envolvido com nome preenchido.');
      setIsLoading(false);
      return;
    }
    setTimeout(() => {
      toast.success('Ocorrência registrada com sucesso!');
      setIsLoading(false);
      setDescricao('');
      setLocal('');
      setEnderecoCompleto('');
      setCoordenadas(null);
      setTipo('');
      setOutroTipo('');
      setAnexos([]);
      setNumero('');
      setEnvolvidos([{
        nome: '',
        apelido: '',
        dataNascimento: '',
        rg: '',
        cpf: '',
        endereco: '',
        telefone: '',
        vinculo: 'Vítima',
        estadoAparente: 'Lúcido'
      }]);
      setProvidenciasTomadas(providenciasTomadas.map(item => ({
        ...item,
        checked: false
      })));
      setOutrasProvidencias('');
    }, 1500);
  };
  const handleCancel = () => {
    if (window.confirm('Deseja realmente cancelar? Todas as alterações serão perdidas.')) {
      setDescricao('');
      setLocal('');
      setEnderecoCompleto('');
      setCoordenadas(null);
      setTipo('');
      setOutroTipo('');
      setAnexos([]);
      setNumero('');
      setEnvolvidos([{
        nome: '',
        apelido: '',
        dataNascimento: '',
        rg: '',
        cpf: '',
        endereco: '',
        telefone: '',
        vinculo: 'Vítima',
        estadoAparente: 'Lúcido'
      }]);
      setProvidenciasTomadas(providenciasTomadas.map(item => ({
        ...item,
        checked: false
      })));
      setOutrasProvidencias('');
      toast.info('Registro de ocorrência cancelado.');
    }
  };
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-gcm-600" />
          Registro de Nova Ocorrência
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="numero">Número da Ocorrência</Label>
              <Input id="numero" value={numero || 'Será gerado automaticamente'} readOnly disabled className="bg-gray-50" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data e Hora do Fato
              </Label>
              <Input id="data" type="datetime-local" value={data} onChange={e => setData(e.target.value)} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="local" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local da Ocorrência
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input id="local" value={local} onChange={e => setLocal(e.target.value)} placeholder="Digite o nome do local" className="w-full" required />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={capturarLocalizacao} disabled={isLoading} className="whitespace-nowrap">
                  <Search className="h-4 w-4 mr-2" />
                  Usar GPS
                </Button>
                
                <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="whitespace-nowrap">
                      <MapIcon className="h-4 w-4 mr-2" />
                      Selecionar no Mapa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Selecione a localização da ocorrência</DialogTitle>
                      <DialogDescription>
                        Clique no mapa para selecionar o local exato da ocorrência.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <GoogleMapComponent center={coordenadas || undefined} markers={mapMarkers} zoom={15} height="h-[400px]" onMapClick={handleMapClick} markerType="incident" />
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
            
            <div className="mt-3">
              <Label htmlFor="enderecoCompleto" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço Completo
              </Label>
              <Textarea id="enderecoCompleto" value={enderecoCompleto} onChange={e => setEnderecoCompleto(e.target.value)} placeholder="Digite o endereço completo do local da ocorrência" className="mt-1 resize-none h-20" />
              {coordenadas && <div className="text-xs text-gray-500 mt-1 space-y-1">
                  <p>
                    Coordenadas GPS: {coordenadas.lat.toFixed(6)}, {coordenadas.lng.toFixed(6)}
                  </p>
                  {geocodeStatus === 'loading' && <p className="text-amber-600 animate-pulse flex items-center">
                      <span className="mr-1 inline-block h-2 w-2 bg-amber-500 rounded-full"></span>
                      Buscando endereço...
                    </p>}
                  {geocodeStatus === 'error' && <p className="text-red-500">
                      Não foi possível obter o endereço automático. Edite manualmente.
                    </p>}
                  {geocodeStatus === 'success' && <p className="text-green-600">
                      Endereço obtido com sucesso. Você pode editar para refinar.
                    </p>}
                </div>}
            </div>
          </div>
          
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
            
            {tipo === 'Outros' && <Input className="mt-2" value={outroTipo} onChange={e => setOutroTipo(e.target.value)} placeholder="Especifique o tipo da ocorrência" required />}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="descricao" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrição da Ocorrência
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={corrigirTexto} disabled={isLoading || isCorrigindoTexto || !descricao} className="flex items-center gap-1">
                {isCorrigindoTexto ? <>
                    <span className="animate-spin mr-1">⟳</span>
                    Corrigindo...
                  </> : <>
                    <Wand2 className="h-3 w-3" />
                    Corrigir Texto
                  </>}
              </Button>
            </div>
            <Textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva detalhadamente a ocorrência..." className="min-h-[150px]" required />
          </div>
          
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-gcm-600" />
                Envolvidos
              </h3>
              <Button type="button" onClick={adicionarEnvolvido} variant="outline" size="sm" className="flex items-center gap-1 bg-green-800 hover:bg-green-700 text-zinc-50">
                <Plus className="h-4 w-4" />
                Adicionar novo envolvido
              </Button>
            </div>
            
            {envolvidos.map((envolvido, index) => <div key={index} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Envolvido {index + 1}
                  </h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removerEnvolvido(index)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`nome-${index}`}>Nome completo</Label>
                    <Input id={`nome-${index}`} value={envolvido.nome} onChange={e => atualizarEnvolvido(index, 'nome', e.target.value)} placeholder="Digite o nome completo" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`apelido-${index}`}>Apelido (opcional)</Label>
                    <Input id={`apelido-${index}`} value={envolvido.apelido} onChange={e => atualizarEnvolvido(index, 'apelido', e.target.value)} placeholder="Digite o apelido (se houver)" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`data-nascimento-${index}`}>Data de nascimento</Label>
                    <Input id={`data-nascimento-${index}`} type="date" value={envolvido.dataNascimento} onChange={e => atualizarEnvolvido(index, 'dataNascimento', e.target.value)} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`telefone-${index}`} className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <Input id={`telefone-${index}`} value={envolvido.telefone} onChange={e => atualizarEnvolvido(index, 'telefone', e.target.value)} placeholder="(00) 00000-0000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`rg-${index}`}>RG</Label>
                    <Input id={`rg-${index}`} value={envolvido.rg} onChange={e => atualizarEnvolvido(index, 'rg', e.target.value)} placeholder="Digite o RG" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`cpf-${index}`}>CPF</Label>
                    <Input id={`cpf-${index}`} value={envolvido.cpf} onChange={e => atualizarEnvolvido(index, 'cpf', e.target.value)} placeholder="000.000.000-00" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`endereco-${index}`} className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Endereço completo
                  </Label>
                  <Textarea id={`endereco-${index}`} value={envolvido.endereco} onChange={e => atualizarEnvolvido(index, 'endereco', e.target.value)} placeholder="Digite o endereço completo" className="h-20 resize-none" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`vinculo-${index}`}>Vínculo com a ocorrência</Label>
                    <Select value={envolvido.vinculo} onValueChange={(value: VinculoOcorrencia) => atualizarEnvolvido(index, 'vinculo', value)}>
                      <SelectTrigger id={`vinculo-${index}`}>
                        <SelectValue placeholder="Selecione o vínculo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vítima">Vítima</SelectItem>
                        <SelectItem value="Suspeito">Suspeito</SelectItem>
                        <SelectItem value="Testemunha">Testemunha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`estado-${index}`}>Estado aparente</Label>
                    <Select value={envolvido.estadoAparente} onValueChange={(value: EstadoAparente) => atualizarEnvolvido(index, 'estadoAparente', value)}>
                      <SelectTrigger id={`estado-${index}`}>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lúcido">Lúcido</SelectItem>
                        <SelectItem value="Alterado">Alterado</SelectItem>
                        <SelectItem value="Ferido">Ferido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>)}
          </div>
          
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-gcm-600" />
              Providências Tomadas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {providenciasTomadas.map(providencia => <div key={providencia.id} className="flex items-center space-x-2">
                  <Checkbox id={providencia.id} checked={providencia.checked} onCheckedChange={() => toggleProvidencia(providencia.id)} />
                  <Label htmlFor={providencia.id} className="cursor-pointer flex items-center">
                    {providencia.id === 'delegacia' && <Shield className="h-4 w-4 mr-2 text-gcm-500" />}
                    {providencia.id === 'samu' && <Ambulance className="h-4 w-4 mr-2 text-gcm-500" />}
                    {providencia.label}
                  </Label>
                </div>)}
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="outras-providencias" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Outras providências
                </Label>
                <Textarea id="outras-providencias" value={outrasProvidencias} onChange={e => setOutrasProvidencias(e.target.value)} placeholder="Descreva outras providências tomadas (se houver)..." className="h-20 resize-none" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Agentes Envolvidos (Guarnição Atual)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md bg-gray-50">
              {guarnicaoAtual.map(agente => <div key={agente.id} className="flex items-center gap-2 p-2 border rounded bg-white">
                  <input type="checkbox" id={`agente-${agente.id}`} checked={agentes.includes(agente.id)} onChange={e => {
                if (e.target.checked) {
                  setAgentes([...agentes, agente.id]);
                } else {
                  setAgentes(agentes.filter(id => id !== agente.id));
                }
              }} className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor={`agente-${agente.id}`} className="flex-1 text-sm">
                    {agente.nome}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {agente.patente}
                    </Badge>
                  </label>
                </div>)}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Evidências e Anexos
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()} className="mx-auto flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Anexar Fotos / Vídeos
              </Button>
              <input id="file-upload" type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={handleFileChange} />
              <p className="text-xs text-gray-500 mt-2">
                Formatos aceitos: imagens, vídeos e PDFs
              </p>
            </div>
            
            {anexos.length > 0 && <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Arquivos anexados:</p>
                <div className="space-y-2">
                  {anexos.map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAnexo(index)} className="h-6 w-6 text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>)}
                </div>
              </div>}
          </div>
          
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
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading || isCorrigindoTexto} className="flex-1 bg-gcm-600 hover:bg-gcm-700 text-white flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Salvar e Registrar Ocorrência
              {isLoading && <span className="ml-2 animate-spin">⏳</span>}
            </Button>
            
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading || isCorrigindoTexto} className="flex-1 flex items-center justify-center gap-2">
              <X className="h-4 w-4" />
              Cancelar e Voltar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
};