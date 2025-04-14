
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateUserProfile = async (email: string, newProfile: string): Promise<boolean> => {
  try {
    // First, find the user by email
    const { data: userByEmail, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (searchError) {
      console.error("Error finding user by email:", searchError);
      return false;
    }

    // If user exists, update their profile
    if (userByEmail) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ perfil: newProfile })
        .eq('id', userByEmail.id);

      if (updateError) {
        console.error("Error updating user profile:", updateError);
        return false;
      }

      console.log(`User ${email} profile updated to ${newProfile}`);
      return true;
    }
    
    // If user doesn't exist, create a new one with this email and profile
    const { error: createError } = await supabase
      .from('users')
      .insert([{ 
        email: email, 
        perfil: newProfile,
        nome: email.split('@')[0], // Using part of email as name
        status: true
      }]);

    if (createError) {
      console.error("Error creating user:", createError);
      return false;
    }

    console.log(`New user created for ${email} with profile ${newProfile}`);
    return true;
    
  } catch (error) {
    console.error("Exception in updateUserProfile:", error);
    return false;
  }
};
