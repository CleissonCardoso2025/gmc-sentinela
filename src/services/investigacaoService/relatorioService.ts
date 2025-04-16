
import { supabase } from "@/integrations/supabase/client";
import { InvestigacaoRelatorio } from "@/types/database";
import { toast } from "sonner";

export const getRelatoriosByInvestigacaoId = async (investigacaoId: string): Promise<InvestigacaoRelatorio[]> => {
  try {
    const { data, error } = await supabase
      .from('investigacoes')
      .select('relatorios')
      .eq('id', investigacaoId)
      .single();

    if (error) {
      console.error("Error fetching relatórios:", error);
      toast.error("Erro ao buscar os relatórios da sindicância");
      return [];
    }

    // Ensure we have a valid array of relatórios
    if (!data.relatorios || !Array.isArray(data.relatorios)) {
      console.warn("No relatórios found or invalid data structure");
      return [];
    }

    return data.relatorios as InvestigacaoRelatorio[];
  } catch (error) {
    console.error("Exception fetching relatórios:", error);
    toast.error("Erro ao buscar os relatórios da sindicância");
    return [];
  }
};

export const downloadRelatorio = async (relatorio: InvestigacaoRelatorio): Promise<boolean> => {
  try {
    // In a real application, this would connect to a file storage system
    // For now, we'll just simulate a successful download
    toast.success(`Relatório ${relatorio.title} baixado com sucesso`);
    return true;
  } catch (error) {
    console.error("Exception downloading relatório:", error);
    toast.error("Erro ao baixar o relatório");
    return false;
  }
};
