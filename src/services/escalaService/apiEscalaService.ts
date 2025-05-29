
import { supabase } from "@/integrations/supabase/client";
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption, ScheduleDay } from "@/types/database";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Get all escala items
export const getEscalaItems = async (): Promise<EscalaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('escala_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching escala items:", error);
      toast.error("Erro ao buscar itens de escala");
      return [];
    }

    return data.map(item => ({
      id: item.id,
      guarnicao: item.guarnicao,
      supervisor: item.supervisor,
      rota: item.rota,
      viatura: item.viatura,
      periodo: item.periodo,
      agent: item.agent,
      role: item.role,
      schedule: (item.schedule as any[] || []).map(s => ({
        day: s.day || s.date || '',
        date: s.date || s.day || '',
        active: s.active || s.shift === '24h' || false
      })) as ScheduleDay[],
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error("Exception fetching escala items:", error);
    toast.error("Erro ao buscar itens de escala");
    return [];
  }
};

// Get all guarnicoes
export const getGuarnicoes = async (): Promise<GuarnicaoOption[]> => {
  try {
    const { data, error } = await supabase
      .from('guarnicoes')
      .select('*');

    if (error) {
      console.error("Error fetching guarnicoes:", error);
      toast.error("Erro ao buscar guarnições");
      return [];
    }

    return data.map(item => ({
      id: item.id,
      nome: item.nome,
      supervisor: item.supervisor
    }));
  } catch (error) {
    console.error("Exception fetching guarnicoes:", error);
    toast.error("Erro ao buscar guarnições");
    return [];
  }
};

// Get all rotas
export const getRotas = async (): Promise<RotaOption[]> => {
  try {
    const { data, error } = await supabase
      .from('rotas')
      .select('*');

    if (error) {
      console.error("Error fetching rotas:", error);
      toast.error("Erro ao buscar rotas");
      return [];
    }

    return data.map(item => ({
      id: item.id,
      nome: item.nome
    }));
  } catch (error) {
    console.error("Exception fetching rotas:", error);
    toast.error("Erro ao buscar rotas");
    return [];
  }
};

// Get all viaturas
export const getViaturas = async (): Promise<ViaturaOption[]> => {
  try {
    const { data, error } = await supabase
      .from('viaturas')
      .select('*');

    if (error) {
      console.error("Error fetching viaturas:", error);
      toast.error("Erro ao buscar viaturas");
      return [];
    }

    return data.map(item => ({
      id: item.id,
      codigo: item.codigo,
      modelo: item.modelo
    }));
  } catch (error) {
    console.error("Exception fetching viaturas:", error);
    toast.error("Erro ao buscar viaturas");
    return [];
  }
};

// Get escala item by ID
export const getEscalaItemById = async (id: string): Promise<EscalaItem | null> => {
  try {
    const { data, error } = await supabase
      .from('escala_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching escala item by ID:", error);
      toast.error("Erro ao buscar item de escala");
      return null;
    }

    return {
      id: data.id,
      guarnicao: data.guarnicao,
      supervisor: data.supervisor,
      rota: data.rota,
      viatura: data.viatura,
      periodo: data.periodo,
      agent: data.agent,
      role: data.role,
      schedule: (data.schedule as any[] || []).map(s => ({
        day: s.day || s.date || '',
        date: s.date || s.day || '',
        active: s.active || s.shift === '24h' || false
      })) as ScheduleDay[],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Exception fetching escala item by ID:", error);
    toast.error("Erro ao buscar item de escala");
    return null;
  }
};

// Create new escala item
export const createEscalaItem = async (escalaData: {
  guarnicao: string;
  supervisor: string;
  rota: string;
  viatura: string;
  periodo: string;
  agent: string;
  role: string;
  schedule: any[];
}): Promise<EscalaItem | null> => {
  try {
    console.log("Creating escala item with data:", escalaData);
    
    // Get current user to satisfy RLS policy
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      console.error("No authenticated user found");
      toast.error("Você precisa estar autenticado para criar uma escala");
      return null;
    }
    
    const { data, error } = await supabase
      .from('escala_items')
      .insert([{
        guarnicao: escalaData.guarnicao,
        supervisor: escalaData.supervisor,
        rota: escalaData.rota,
        viatura: escalaData.viatura,
        periodo: escalaData.periodo,
        agent: escalaData.agent,
        role: escalaData.role,
        schedule: escalaData.schedule as Json,
        user_id: userId // Add user_id to satisfy RLS policy
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating escala item:", error);
      toast.error(`Erro ao criar item de escala: ${error.message}`);
      return null;
    }

    console.log("Escala item created successfully:", data);
    toast.success("Escala criada com sucesso");
    
    return {
      id: data.id,
      guarnicao: data.guarnicao,
      supervisor: data.supervisor,
      rota: data.rota,
      viatura: data.viatura,
      periodo: data.periodo,
      agent: data.agent,
      role: data.role,
      schedule: (data.schedule as any[] || []).map(s => ({
        day: s.day || s.date || '',
        date: s.date || s.day || '',
        active: s.active || s.shift === '24h' || false
      })) as ScheduleDay[],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Exception creating escala item:", error);
    toast.error("Erro ao criar item de escala");
    return null;
  }
};

// Update escala item
export const updateEscalaItem = async (escalaItem: EscalaItem): Promise<EscalaItem | null> => {
  try {
    const scheduleForDB = escalaItem.schedule as unknown as Json;
    
    // Get current user to satisfy RLS policy
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      console.error("No authenticated user found");
      toast.error("Você precisa estar autenticado para atualizar uma escala");
      return null;
    }
    
    const { data, error } = await supabase
      .from('escala_items')
      .update({
        guarnicao: escalaItem.guarnicao,
        supervisor: escalaItem.supervisor,
        rota: escalaItem.rota,
        viatura: escalaItem.viatura,
        periodo: escalaItem.periodo,
        agent: escalaItem.agent,
        role: escalaItem.role,
        schedule: scheduleForDB,
        user_id: userId // Ensure user_id is set for RLS policy
      })
      .eq('id', escalaItem.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating escala item:", error);
      toast.error(`Erro ao atualizar item de escala: ${error.message}`);
      return null;
    }

    toast.success("Item de escala atualizado com sucesso");
    return {
      id: data.id,
      guarnicao: data.guarnicao,
      supervisor: data.supervisor,
      rota: data.rota,
      viatura: data.viatura,
      periodo: data.periodo,
      agent: data.agent,
      role: data.role,
      schedule: (data.schedule as any[] || []).map(s => ({
        day: s.day || s.date || '',
        date: s.date || s.day || '',
        active: s.active || s.shift === '24h' || false
      })) as ScheduleDay[],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Exception updating escala item:", error);
    toast.error("Erro ao atualizar item de escala");
    return null;
  }
};

// Delete escala item
export const deleteEscalaItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('escala_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting escala item:", error);
      toast.error(`Erro ao excluir item de escala: ${error.message}`);
      return false;
    }

    toast.success("Item de escala excluído com sucesso");
    return true;
  } catch (error) {
    console.error("Exception deleting escala item:", error);
    toast.error("Erro ao excluir item de escala");
    return false;
  }
};
