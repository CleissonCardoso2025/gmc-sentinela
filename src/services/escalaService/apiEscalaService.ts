
import { AbstractBaseService } from '../api/baseService';
import { EscalaService } from './types';
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption } from '@/components/Inspetoria/Escala/types';
import { supabase } from '@/integrations/supabase/client';

export class ApiEscalaService extends AbstractBaseService implements EscalaService {
  constructor() {
    super('escala');
  }

  async getEscalaItems(): Promise<EscalaItem[]> {
    try {
      const { data, error } = await supabase
        .from('escala_items' as any)
        .select('*');
      
      if (error) throw error;
      
      return data.map(item => ({
        id: Number(item.id),
        guarnicao: item.guarnicao,
        supervisor: item.supervisor,
        rota: item.rota,
        viatura: item.viatura,
        periodo: item.periodo,
        agent: item.agent,
        role: item.role,
        schedule: item.schedule
      }));
    } catch (error) {
      console.error('Error fetching escala items:', error);
      throw error;
    }
  }

  async getGuarnicoes(): Promise<GuarnicaoOption[]> {
    try {
      const { data, error } = await supabase
        .from('guarnicoes' as any)
        .select('*');
      
      if (error) throw error;
      
      return data.map(item => ({
        id: String(item.id),
        nome: item.nome,
        supervisor: item.supervisor
      }));
    } catch (error) {
      console.error('Error fetching guarnicoes:', error);
      throw error;
    }
  }

  async getRotas(): Promise<RotaOption[]> {
    try {
      const { data, error } = await supabase
        .from('rotas' as any)
        .select('*');
      
      if (error) throw error;
      
      return data.map(item => ({
        id: String(item.id),
        nome: item.nome
      }));
    } catch (error) {
      console.error('Error fetching rotas:', error);
      throw error;
    }
  }

  async getViaturas(): Promise<ViaturaOption[]> {
    try {
      const { data, error } = await supabase
        .from('viaturas' as any)
        .select('*');
      
      if (error) throw error;
      
      return data.map(item => ({
        id: String(item.id),
        codigo: item.codigo,
        modelo: item.modelo
      }));
    } catch (error) {
      console.error('Error fetching viaturas:', error);
      throw error;
    }
  }

  async updateEscalaItem(item: EscalaItem): Promise<EscalaItem> {
    try {
      const { data, error } = await supabase
        .from('escala_items' as any)
        .update({
          guarnicao: item.guarnicao,
          supervisor: item.supervisor,
          rota: item.rota,
          viatura: item.viatura,
          periodo: item.periodo,
          agent: item.agent,
          role: item.role,
          schedule: item.schedule
        })
        .eq('id', item.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: Number(data.id),
        guarnicao: data.guarnicao,
        supervisor: data.supervisor,
        rota: data.rota,
        viatura: data.viatura,
        periodo: data.periodo,
        agent: data.agent,
        role: data.role,
        schedule: data.schedule
      };
    } catch (error) {
      console.error(`Error updating escala item with ID ${item.id}:`, error);
      throw error;
    }
  }

  async createEscalaItem(item: Omit<EscalaItem, 'id'>): Promise<EscalaItem> {
    try {
      const { data, error } = await supabase
        .from('escala_items' as any)
        .insert([{
          guarnicao: item.guarnicao,
          supervisor: item.supervisor,
          rota: item.rota,
          viatura: item.viatura,
          periodo: item.periodo,
          agent: item.agent,
          role: item.role,
          schedule: item.schedule
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: Number(data.id),
        guarnicao: data.guarnicao,
        supervisor: data.supervisor,
        rota: data.rota,
        viatura: data.viatura,
        periodo: data.periodo,
        agent: data.agent,
        role: data.role,
        schedule: data.schedule
      };
    } catch (error) {
      console.error('Error creating escala item:', error);
      throw error;
    }
  }

  async deleteEscalaItem(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('escala_items' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting escala item with ID ${id}:`, error);
      throw error;
    }
  }
}
