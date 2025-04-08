
import { supabase } from "@/integrations/supabase/client";
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption, ScheduleDay } from "@/types/database";
import { toast } from "sonner";

// Get all escala items
export const getEscalaItems = async (): Promise<EscalaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('escala_items')
      .select('*');

    if (error) {
      console.error("Error fetching escala items:", error);
      toast.error("Erro ao buscar escalas");
      return [];
    }

    // Parse the JSON schedule data
    return data.map(item => ({
      ...item,
      schedule: typeof item.schedule === 'string' 
        ? JSON.parse(item.schedule) 
        : item.schedule
    })) as EscalaItem[];
  } catch (error) {
    console.error("Exception fetching escala items:", error);
    toast.error("Erro ao buscar escalas");
    return [];
  }
};

// Get guarnicoes for dropdown options
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

    return data as GuarnicaoOption[];
  } catch (error) {
    console.error("Exception fetching guarnicoes:", error);
    toast.error("Erro ao buscar guarnições");
    return [];
  }
};

// Get rotas for dropdown options
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

    return data as RotaOption[];
  } catch (error) {
    console.error("Exception fetching rotas:", error);
    toast.error("Erro ao buscar rotas");
    return [];
  }
};

// Get viaturas for dropdown options
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

    return data as ViaturaOption[];
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
      toast.error("Erro ao buscar escala");
      return null;
    }

    // Parse the JSON schedule data
    return {
      ...data,
      schedule: typeof data.schedule === 'string' 
        ? JSON.parse(data.schedule) 
        : data.schedule
    } as EscalaItem;
  } catch (error) {
    console.error("Exception fetching escala item by ID:", error);
    toast.error("Erro ao buscar escala");
    return null;
  }
};

// Create new escala item
export const createEscalaItem = async (escalaItem: Omit<EscalaItem, 'id'>): Promise<EscalaItem | null> => {
  try {
    // Ensure schedule is stored as JSONB
    const itemToInsert = {
      ...escalaItem,
      schedule: typeof escalaItem.schedule === 'string' 
        ? escalaItem.schedule 
        : JSON.stringify(escalaItem.schedule)
    };

    const { data, error } = await supabase
      .from('escala_items')
      .insert([itemToInsert])
      .select()
      .single();

    if (error) {
      console.error("Error creating escala item:", error);
      toast.error(`Erro ao criar escala: ${error.message}`);
      return null;
    }

    toast.success("Escala criada com sucesso");
    
    return {
      ...data,
      schedule: typeof data.schedule === 'string' 
        ? JSON.parse(data.schedule) 
        : data.schedule
    } as EscalaItem;
  } catch (error) {
    console.error("Exception creating escala item:", error);
    toast.error("Erro ao criar escala");
    return null;
  }
};

// Update escala item
export const updateEscalaItem = async (escalaItem: EscalaItem): Promise<EscalaItem | null> => {
  try {
    // Ensure schedule is stored as JSONB
    const itemToUpdate = {
      guarnicao: escalaItem.guarnicao,
      supervisor: escalaItem.supervisor,
      rota: escalaItem.rota,
      viatura: escalaItem.viatura,
      periodo: escalaItem.periodo,
      agent: escalaItem.agent,
      role: escalaItem.role,
      schedule: typeof escalaItem.schedule === 'string' 
        ? escalaItem.schedule 
        : JSON.stringify(escalaItem.schedule)
    };

    const { data, error } = await supabase
      .from('escala_items')
      .update(itemToUpdate)
      .eq('id', escalaItem.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating escala item:", error);
      toast.error(`Erro ao atualizar escala: ${error.message}`);
      return null;
    }

    toast.success("Escala atualizada com sucesso");
    
    return {
      ...data,
      schedule: typeof data.schedule === 'string' 
        ? JSON.parse(data.schedule) 
        : data.schedule
    } as EscalaItem;
  } catch (error) {
    console.error("Exception updating escala item:", error);
    toast.error("Erro ao atualizar escala");
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
      toast.error(`Erro ao excluir escala: ${error.message}`);
      return false;
    }

    toast.success("Escala excluída com sucesso");
    return true;
  } catch (error) {
    console.error("Exception deleting escala item:", error);
    toast.error("Erro ao excluir escala");
    return false;
  }
};
