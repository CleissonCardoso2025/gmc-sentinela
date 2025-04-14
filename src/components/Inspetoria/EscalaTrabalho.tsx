import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption, ScheduleDay } from './Escala/types';

const EscalaTrabalho: React.FC = () => {
  const [escalaItems, setEscalaItems] = useState<EscalaItem[]>([]);
  const [guarnicoes, setGuarnicoes] = useState<GuarnicaoOption[]>([]);
  const [rotas, setRotas] = useState<RotaOption[]>([]);
  const [viaturas, setViaturas] = useState<ViaturaOption[]>([]);
  const [selectedEscalaItem, setSelectedEscalaItem] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [guarnicao, setGuarnicao] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [rota, setRota] = useState('');
  const [viatura, setViatura] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [agent, setAgent] = useState('');
  const [role, setRole] = useState('');
  const [schedule, setSchedule] = useState<any[]>([]);

  // Fetch options for selects
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const { data: guarnicaoData, error: guarnicaoError } = await supabase
          .from('guarnicoes')
          .select('id, nome, supervisor');

        if (guarnicaoError) throw guarnicaoError;
        setGuarnicoes(guarnicaoData || []);

        const { data: rotaData, error: rotaError } = await supabase
          .from('rotas')
          .select('id, nome');

        if (rotaError) throw rotaError;
        setRotas(rotaData || []);

        const { data: viaturaData, error: viaturaError } = await supabase
          .from('viaturas')
          .select('id, codigo, modelo');

        if (viaturaError) throw viaturaError;
        setViaturas(viaturaData || []);

        const { data, error } = await supabase
          .from('escala')
          .select('*');

        if (error) throw error;

        // Convert JSON data to ScheduleDay array
        const transformedData = data.map(item => ({
          ...item,
          schedule: Array.isArray(item.schedule) 
            ? item.schedule.map((scheduleItem: any) => ({
                day: scheduleItem.day || '',
                shift: scheduleItem.shift || '',
                status: scheduleItem.status || ''
              }))
            : []
        })) as EscalaItem[];

        setEscalaItems(transformedData);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast({
          title: "Erro ao carregar opções",
          description: "Não foi possível carregar as opções para os campos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [toast]);

  const handleEdit = (id: string) => {
    const item = escalaItems.find(item => item.id === id);
    if (item) {
      setSelectedEscalaItem(id);
      setGuarnicao(item.guarnicao);
      setSupervisor(item.supervisor);
      setRota(item.rota);
      setViatura(item.viatura);
      setPeriodo(item.periodo);
      setAgent(item.agent);
      setRole(item.role);
      setSchedule(item.schedule);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setSelectedEscalaItem(null);
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setGuarnicao('');
    setSupervisor('');
    setRota('');
    setViatura('');
    setPeriodo('');
    setAgent('');
    setRole('');
    setSchedule([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guarnicao || !supervisor || !rota || !viatura || !periodo || !agent || !role || !schedule.length) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const newItem = {
      id: selectedEscalaItem || uuidv4(),
      guarnicao,
      supervisor,
      rota,
      viatura,
      periodo,
      agent,
      role,
      schedule
    };

    try {
      setIsLoading(true);
      if (isEditing && selectedEscalaItem) {
        // Update existing item
        const { error } = await supabase
          .from('escala')
          .update(newItem)
          .eq('id', selectedEscalaItem);

        if (error) throw error;

        setEscalaItems(escalaItems.map(item => item.id === selectedEscalaItem ? newItem : item));
        toast({
          title: "Escala atualizada",
          description: "A escala foi atualizada com sucesso.",
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('escala')
          .insert(newItem);

        if (error) throw error;

        setEscalaItems([...escalaItems, newItem]);
        toast({
          title: "Escala criada",
          description: "A escala foi criada com sucesso.",
        });
      }
      handleCancel();
    } catch (error) {
      console.error("Error saving escala:", error);
      toast({
        title: "Erro ao salvar escala",
        description: "Não foi possível salvar a escala.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('escala')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEscalaItems(escalaItems.filter(item => item.id !== id));
      toast({
        title: "Escala excluída",
        description: "A escala foi excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting escala:", error);
      toast({
        title: "Erro ao excluir escala",
        description: "Não foi possível excluir a escala.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Editar Escala' : 'Nova Escala'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guarnicao">Guarnição</Label>
              <Select value={guarnicao} onValueChange={setGuarnicao}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a Guarnição" />
                </SelectTrigger>
                <SelectContent>
                  {guarnicoes.map(guarnicao => (
                    <SelectItem key={guarnicao.id} value={guarnicao.id}>{guarnicao.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                type="text"
                id="supervisor"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                placeholder="Nome do Supervisor"
              />
            </div>
            <div>
              <Label htmlFor="rota">Rota</Label>
              <Select value={rota} onValueChange={setRota}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a Rota" />
                </SelectTrigger>
                <SelectContent>
                  {rotas.map(rota => (
                    <SelectItem key={rota.id} value={rota.id}>{rota.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="viatura">Viatura</Label>
              <Select value={viatura} onValueChange={setViatura}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a Viatura" />
                </SelectTrigger>
                <SelectContent>
                  {viaturas.map(viatura => (
                    <SelectItem key={viatura.id} value={viatura.id}>{viatura.codigo} - {viatura.modelo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Input
                type="text"
                id="periodo"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                placeholder="Período"
              />
            </div>
            <div>
              <Label htmlFor="agent">Agente</Label>
              <Input
                type="text"
                id="agent"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                placeholder="Agente"
              />
            </div>
            <div>
              <Label htmlFor="role">Função</Label>
              <Input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Função"
              />
            </div>
            <div>
              <Label htmlFor="schedule">Escala</Label>
              <Input
                type="text"
                id="schedule"
                value={JSON.stringify(schedule)}
                onChange={(e) => {
                  try {
                    const parsedSchedule = JSON.parse(e.target.value);
                    setSchedule(parsedSchedule);
                  } catch (error) {
                    console.error("Invalid JSON format", error);
                    toast({
                      title: "Erro de formato",
                      description: "Formato JSON inválido.",
                      variant: "destructive"
                    });
                  }
                }}
                placeholder="Escala (JSON)"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              {isEditing && (
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Escalas Cadastradas</h2>
          <Table>
            <TableCaption>Lista de escalas de trabalho.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Guarnição</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Rota</TableHead>
                <TableHead>Viatura</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escalaItems.map((escalaItem) => (
                <TableRow key={escalaItem.id}>
                  <TableCell className="font-medium">{escalaItem.guarnicao}</TableCell>
                  <TableCell>{escalaItem.supervisor}</TableCell>
                  <TableCell>{escalaItem.rota}</TableCell>
                  <TableCell>{escalaItem.viatura}</TableCell>
                  <TableCell>{escalaItem.periodo}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(escalaItem.id)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(escalaItem.id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscalaTrabalho;
