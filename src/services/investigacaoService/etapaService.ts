
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Etapa {
  id: string;
  investigacao_id: string;
  nome: string;
  descricao: string;
  responsavel: string;
  data: string;
  concluida: boolean;
  ordem: number;
  created_at?: string;
  updated_at?: string;
}

// Get all etapas for a specific investigation
export const getEtapasByInvestigacaoId = async (investigacaoId: string): Promise<Etapa[]> => {
  try {
    const { data, error } = await supabase
      .from('etapas_investigacao')
      .select('*')
      .eq('investigacao_id', investigacaoId)
      .order('ordem', { ascending: true });

    if (error) {
      console.error("Error fetching etapas:", error);
      toast.error("Erro ao buscar as etapas da sindicância");
      return [];
    }

    return data as Etapa[];
  } catch (error) {
    console.error("Exception fetching etapas:", error);
    toast.error("Erro ao buscar as etapas da sindicância");
    return [];
  }
};

// Update etapa status
export const updateEtapaStatus = async (id: string, concluida: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('etapas_investigacao')
      .update({ 
        concluida: concluida,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Error updating etapa status:", error);
      toast.error("Erro ao atualizar o status da etapa");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception updating etapa status:", error);
    toast.error("Erro ao atualizar o status da etapa");
    return false;
  }
};

// Add new etapa
export const addEtapa = async (etapa: Omit<Etapa, 'id' | 'created_at' | 'updated_at'>): Promise<Etapa | null> => {
  try {
    const { data, error } = await supabase
      .from('etapas_investigacao')
      .insert([etapa])
      .select()
      .single();

    if (error) {
      console.error("Error adding etapa:", error);
      toast.error(`Erro ao adicionar etapa: ${error.message}`);
      return null;
    }

    toast.success("Etapa adicionada com sucesso");
    return data as Etapa;
  } catch (error) {
    console.error("Exception adding etapa:", error);
    toast.error("Erro ao adicionar etapa");
    return null;
  }
};
