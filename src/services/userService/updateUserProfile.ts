
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateUserProfile = async (email: string, newProfile: string): Promise<boolean> => {
  try {
    console.log(`Attempting to update profile for email: ${email} to profile: ${newProfile}`);
    
    // First, find the user by email
    const { data: userByEmail, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();  // Using maybeSingle instead of single to prevent errors if no user is found

    if (searchError) {
      console.error("Error finding user by email:", searchError);
      return false;
    }

    // If user exists, check if update is needed
    if (userByEmail) {
      console.log("User found:", userByEmail);
      
      // Skip update if the profile is already correct
      if (userByEmail.perfil === newProfile) {
        console.log(`User ${email} already has the correct profile (${newProfile}). No update needed.`);
        return false;
      }
      
      // Update the profile since it's different
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
    console.log("User not found, creating new user");
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
