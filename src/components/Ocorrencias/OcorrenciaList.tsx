
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FileText, Eye, ArrowUpDown, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import EmptyState from '@/components/Dashboard/EmptyState';

type OcorrenciaStatus = 'Aberta' | 'Encerrada' | 'Encaminhada' | 'Sob Investigação' | 'Todas';
type OcorrenciaTipo = 'Trânsito' | 'Crime' | 'Dano ao patrimônio público' | 'Maria da Penha' | 'Apoio a outra instituição' | 'Outros' | 'Todas';

// Interface para a estrutura de dados da ocorrência
interface Ocorrencia {
  id: string;
  numero: string;
  data: string;
  local: string;
  tipo: string;
  status: string;
  descricao: string;
}

export const OcorrenciaList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OcorrenciaStatus>('Todas');
  const [tipoFilter, setTipoFilter] = useState<OcorrenciaTipo>('Todas');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filtrarHoje, setFiltrarHoje] = useState(true);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOcorrencias();
  }, []);

  const fetchOcorrencias = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ocorrencias')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;

      setOcorrencias(data || []);
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
      toast.error('Não foi possível carregar as ocorrências');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar se uma data é de hoje
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filtragem e ordenação dos dados
  const filteredOcorrencias = ocorrencias
    .filter(ocorrencia => {
      // Filtro de texto
      const matchesSearch = 
        ocorrencia.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ocorrencia.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ocorrencia.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de status
      const matchesStatus = statusFilter === 'Todas' || ocorrencia.status === statusFilter;
      
      // Filtro de tipo
      const matchesTipo = tipoFilter === 'Todas' || ocorrencia.tipo === tipoFilter;
      
      // Filtro de data (hoje)
      const matchesDate = !filtrarHoje || isToday(ocorrencia.data);
      
      return matchesSearch && matchesStatus && matchesTipo && matchesDate;
    })
    .sort((a, b) => {
      // Ordenação por data
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Função para formatar a data para exibição
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Função para retornar a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberta':
        return 'bg-blue-100 text-blue-800';
      case 'Encerrada':
        return 'bg-green-100 text-green-800';
      case 'Encaminhada':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sob Investigação':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para navegar para a página de detalhes da ocorrência
  const handleViewDetails = (id: string) => {
    navigate(`/ocorrencias/${id}`);
  };

  // Título do card com contagem de resultados
  const getCardTitle = () => {
    const total = filteredOcorrencias.length;
    const hoje = format(new Date(), "dd 'de' MMMM", { locale: ptBR });
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gcm-600" />
          <span className="hidden sm:inline">Ocorrências Registradas</span>
          <span className="sm:hidden">Ocorrências</span>
          {filtrarHoje && <Badge className="ml-2 bg-blue-100 text-blue-800">Hoje: {hoje}</Badge>}
          <Badge variant="outline" className="ml-2">
            {total} {total === 1 ? 'resultado' : 'resultados'}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          <ArrowUpDown className="h-4 w-4 mr-1" />
          {sortOrder === 'asc' ? 'Mais antigas' : 'Mais recentes'}
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {getCardTitle()}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por número, local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: OcorrenciaStatus) => setStatusFilter(value)}>
            <SelectTrigger id="statusFilter" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todos os Status</SelectItem>
              <SelectItem value="Aberta">Aberta</SelectItem>
              <SelectItem value="Encerrada">Encerrada</SelectItem>
              <SelectItem value="Encaminhada">Encaminhada</SelectItem>
              <SelectItem value="Sob Investigação">Sob Investigação</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={tipoFilter} onValueChange={(value: OcorrenciaTipo) => setTipoFilter(value)}>
            <SelectTrigger id="tipoFilter" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todos os Tipos</SelectItem>
              <SelectItem value="Trânsito">Trânsito</SelectItem>
              <SelectItem value="Crime">Crime</SelectItem>
              <SelectItem value="Dano ao patrimônio público">Dano ao patrimônio público</SelectItem>
              <SelectItem value="Maria da Penha">Maria da Penha</SelectItem>
              <SelectItem value="Apoio a outra instituição">Apoio a outra instituição</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant={filtrarHoje ? "default" : "outline"}
            className="flex items-center justify-center gap-2 transition-all duration-200"
            onClick={() => setFiltrarHoje(!filtrarHoje)}
          >
            <Calendar className="h-4 w-4" />
            {filtrarHoje ? "Mostrando Hoje" : "Mostrar Todas"}
          </Button>
        </div>
        
        {/* Lista de ocorrências */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gcm-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando ocorrências...</p>
            </div>
          ) : filteredOcorrencias.length > 0 ? (
            filteredOcorrencias.map((ocorrencia, index) => (
              <div 
                key={ocorrencia.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gcm-600">{ocorrencia.numero || `OCR-${ocorrencia.id.slice(0, 6)}`}</h3>
                      <Badge className={getStatusColor(ocorrencia.status)}>
                        {ocorrencia.status}
                      </Badge>
                      {isToday(ocorrencia.data) && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          Hoje
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(ocorrencia.data)}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 md:mt-0 hover:bg-gcm-50"
                    onClick={() => handleViewDetails(ocorrencia.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium">Local:</p>
                    <p className="text-sm text-gray-600">{ocorrencia.local}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Tipo:</p>
                    <p className="text-sm text-gray-600">{ocorrencia.tipo}</p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm font-medium">Descrição:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{ocorrencia.descricao}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              title="Sem ocorrências" 
              description="Nenhuma ocorrência encontrada com os filtros selecionados." 
              icon="search"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
