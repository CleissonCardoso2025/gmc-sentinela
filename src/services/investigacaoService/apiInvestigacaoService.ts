
import { supabase } from "@/integrations/supabase/client";
import { Investigacao, InvestigacaoAnexo } from "@/types/database";
import { toast } from "sonner";

// Helper function to safely validate and cast anexos
const validateAnexos = (anexosData: unknown): InvestigacaoAnexo[] => {
  // Check if it's an array first
  if (!Array.isArray(anexosData)) {
    console.error("Anexos data is not an array:", anexosData);
    return [];
  }

  // Validate each item in the array has the required properties
  const validAnexos = anexosData.filter((item): item is InvestigacaoAnexo => {
    const hasRequiredFields = item && 
      typeof item === 'object' && 
      'id' in item && 
      'path' in item && 
      'name' in item && 
      'type' in item;
    
    if (!hasRequiredFields) {
      console.error("Invalid anexo item:", item);
    }
    
    return hasRequiredFields;
  });

  return validAnexos;
};

// Get all investigations
export const getInvestigacoes = async (): Promise<Investigacao[]> => {
  try {
    const { data, error } = await supabase
      .from('investigacoes')
      .select('*')
      .order('created_at', { ascending: false }); // Order by newest first

    if (error) {
      console.error("Error fetching investigations:", error);
      toast.error("Erro ao buscar sindicâncias");
      return [];
    }

    // Map database fields to our interface and safely handle anexos
    return data.map(item => ({
      id: item.id,
      numero: item.numero,
      dataAbertura: item.dataabertura,
      investigado: item.investigado,
      motivo: item.motivo,
      status: item.status,
      etapaAtual: item.etapaatual,
      relatoInicial: item.relatoinicial,
      anexos: validateAnexos(item.anexos),
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
      anexos: validateAnexos(data.anexos),
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Exception fetching investigation by ID:", error);
    toast.error("Erro ao buscar sindicância");
    return null;
  }
};

// Upload anexo to investigation
export const uploadAnexo = async (
  investigacaoId: string, 
  file: File, 
  description?: string
): Promise<boolean> => {
  try {
    // First get the current investigation
    const { data: investigacao, error: fetchError } = await supabase
      .from('investigacoes')
      .select('anexos')
      .eq('id', investigacaoId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching investigation for upload:", fetchError);
      toast.error("Erro ao preparar upload");
      return false;
    }
    
    // Create a new anexo object
    const newAnexo: InvestigacaoAnexo = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      path: `anexos/${investigacaoId}/${file.name}`,
      description,
      uploaded_at: new Date().toISOString()
    };
    
    // Add to existing anexos array or create a new one
    const currentAnexos: Record<string, any>[] = Array.isArray(investigacao.anexos) ? investigacao.anexos : [];
    const updatedAnexos = [...currentAnexos, newAnexo];
    
    // Update the investigation record with the new anexos array
    const { error: updateError } = await supabase
      .from('investigacoes')
      .update({ 
        anexos: updatedAnexos,
        updated_at: new Date().toISOString()
      })
      .eq('id', investigacaoId);
    
    if (updateError) {
      console.error("Error updating investigation with new anexo:", updateError);
      toast.error("Erro ao salvar anexo");
      return false;
    }
    
    toast.success("Anexo adicionado com sucesso");
    return true;
  } catch (error) {
    console.error("Exception uploading anexo:", error);
    toast.error("Erro ao adicionar anexo");
    return false;
  }
};

// Delete anexo from investigation
export const deleteAnexo = async (investigacaoId: string, anexoId: string): Promise<boolean> => {
  try {
    // First get the current investigation
    const { data: investigacao, error: fetchError } = await supabase
      .from('investigacoes')
      .select('anexos')
      .eq('id', investigacaoId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching investigation for delete:", fetchError);
      toast.error("Erro ao preparar exclusão");
      return false;
    }
    
    // Filter out the anexo to delete
    const currentAnexos: Record<string, any>[] = Array.isArray(investigacao.anexos) ? investigacao.anexos : [];
    const updatedAnexos = currentAnexos.filter(anexo => anexo.id !== anexoId);
    
    // Update the investigation record with the filtered anexos array
    const { error: updateError } = await supabase
      .from('investigacoes')
      .update({ 
        anexos: updatedAnexos,
        updated_at: new Date().toISOString()
      })
      .eq('id', investigacaoId);
    
    if (updateError) {
      console.error("Error updating investigation after anexo deletion:", updateError);
      toast.error("Erro ao excluir anexo");
      return false;
    }
    
    toast.success("Anexo excluído com sucesso");
    return true;
  } catch (error) {
    console.error("Exception deleting anexo:", error);
    toast.error("Erro ao excluir anexo");
    return false;
  }
};

// Create new investigation
export const createInvestigacao = async (investigacao: Omit<Investigacao, 'id' | 'created_at' | 'updated_at' | 'anexos'>, anexos?: any[]): Promise<Investigacao | null> => {
  try {
    console.log("Creating investigation:", investigacao);
    
    const { data, error } = await supabase
      .from('investigacoes')
      .insert([{
        numero: investigacao.numero,
        dataabertura: investigacao.dataAbertura,
        investigado: investigacao.investigado,
        motivo: investigacao.motivo,
        status: investigacao.status,
        etapaatual: investigacao.etapaAtual,
        relatoinicial: investigacao.relatoInicial,
        anexos: anexos || []
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating investigation:", error);
      toast.error(`Erro ao criar sindicância: ${error.message}`);
      return null;
    }

    console.log("Investigation created successfully:", data);
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
      anexos: validateAnexos(data.anexos),
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Exception creating investigation:", error);
    toast.error("Erro ao criar sindicância");
    return null;
  }
};

// Update investigation status
export const updateInvestigacaoStatus = async (id: string, status: string, etapaAtual: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('investigacoes')
      .update({ 
        status: status,
        etapaatual: etapaAtual,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Error updating investigation status:", error);
      toast.error("Erro ao atualizar status da sindicância");
      return false;
    }

    toast.success("Status da sindicância atualizado com sucesso");
    return true;
  } catch (error) {
    console.error("Exception updating investigation status:", error);
    toast.error("Erro ao atualizar status da sindicância");
    return false;
  }
};
