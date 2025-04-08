
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateUserProfile = async (email: string, newProfile: string): Promise<boolean> => {
  try {
    // First, find the user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (findError) {
      console.error("Error finding user:", findError);
      toast.error(`Usuário com e-mail ${email} não encontrado`);
      return false;
    }
    
    if (!user) {
      toast.error(`Usuário com e-mail ${email} não encontrado`);
      return false;
    }
    
    // Then update the user's profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ perfil: newProfile })
      .eq('id', user.id);
    
    if (updateError) {
      console.error("Error updating user profile:", updateError);
      toast.error(`Erro ao atualizar perfil: ${updateError.message}`);
      return false;
    }
    
    toast.success(`Perfil do usuário ${email} atualizado para ${newProfile}`);
    return true;
  } catch (error) {
    console.error("Exception updating user profile:", error);
    toast.error("Erro ao atualizar perfil do usuário");
    return false;
  }
};
