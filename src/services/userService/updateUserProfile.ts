
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateUserProfile = async (email: string, newProfile: string): Promise<boolean> => {
  try {
    // First, find the user by email
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    
    if (findError) {
      console.error("Error finding user:", findError);
      toast.error(`Erro ao buscar usuário com e-mail ${email}`);
      return false;
    }
    
    if (!users || users.length === 0) {
      console.log(`Usuário com e-mail ${email} não encontrado. Tentando criar...`);
      
      // If user doesn't exist, create it
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ 
          email, 
          perfil: newProfile, 
          nome: email.split('@')[0],
          status: true 
        }])
        .select();
      
      if (createError) {
        console.error("Error creating user:", createError);
        toast.error(`Erro ao criar usuário: ${createError.message}`);
        return false;
      }
      
      toast.success(`Usuário ${email} criado com perfil ${newProfile}`);
      return true;
    }
    
    const user = users[0];
    
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
