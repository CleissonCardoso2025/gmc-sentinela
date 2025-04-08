
import { supabase } from "@/integrations/supabase/client";
import { Investigacao } from "@/types/database";
import { toast } from "sonner";

// Get all investigations
export const getInvestigacoes = async (): Promise<Investigacao[]> => {
  try {
    const { data, error } = await supabase
      .from('investigacoes')
      .select('*');

    if (error) {
      console.error("Error fetching investigations:", error);
      toast.error("Erro ao buscar sindicâncias");
      return [];
    }

    // Map database fields to our interface
    return data.map(item => ({
      id: item.id,
      numero: item.numero,
      dataAbertura: item.dataabertura,
      investigado: item.investigado,
      motivo: item.motivo,
      status: item.status,
      etapaAtual: item.etapaatual,
      relatoInicial: item.relatoinicial,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error("Exception fetching investigations:", error);
    toast.error("Erro ao buscar sindicâncias");
    return [];
  }
};

// Get investigation by ID
export const getInvestigacaoById = async (id: string): Promise<Investigacao | null> => {
  try {
    const { data, error } = await supabase
      .from('investigacoes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching investigation by ID:", error);
      toast.error("Erro ao buscar sindicância");
      return null;
    }

    return {
      id: data.id,
      numero: data.numero,
      dataAbertura: data.dataabertura,
      investigado: data.investigado,
      motivo: data.motivo,
      status: data.status,
      etapaAtual: data.etapaatual,
      relatoInicial: data.relatoinicial,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Exception fetching investigation by ID:", error);
    toast.error("Erro ao buscar sindicância");
    return null;
  }
};

// Create new investigation
export const createInvestigacao = async (investigacao: Omit<Investigacao, 'id'>): Promise<Investigacao | null> => {
  try {
    const { data, error } = await supabase
      .from('investigacoes')
      .insert([{
        numero: investigacao.numero,
        dataabertura: investigacao.dataAbertura,
        investigado: investigacao.investigado,
        motivo: investigacao.motivo,
        status: investigacao.status,
        etapaatual: investigacao.etapaAtual,
        relatoinicial: investigacao.relatoInicial
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating investigation:", error);
      toast.error(`Erro ao criar sindicância: ${error.message}`);
      return null;
    }

    toast.success("Sindicância criada com sucesso");
    return {
      id: data.id,
      numero: data.numero,
      dataAbertura: data.dataabertura,
      investigado: data.investigado,
      motivo: data.motivo,
      status: data.status,
      etapaAtual: data.etapaatual,
      relatoInicial: data.relatoinicial,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Exception creating investigation:", error);
    toast.error("Erro ao criar sindicância");
    return null;
  }
};
