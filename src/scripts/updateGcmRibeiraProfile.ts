
import { updateUserProfile } from "../services/userService/updateUserProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// This function will update the specific user's profile
export const updateGcmRibeiraProfile = async () => {
  const email = "gcmribeiradopombal@hotmail.com";
  const targetProfile = "Inspetor";
  
  try {
    console.log(`Checking if profile update is needed for ${email}...`);
    
    // First check if the user already has the target profile
    const { data: userMetadata } = await supabase.auth.getUser();
    
    // Check if user is logged in and if the current user is the target user
    if (userMetadata?.user && userMetadata.user.email === email) {
      const currentRole = userMetadata.user.user_metadata?.role;
      
      if (currentRole === targetProfile) {
        console.log(`User ${email} already has the correct profile: ${targetProfile}`);
        return false; // No update needed
      }
    }
    
    // Also check the profile in the database table
    const { data: userByEmail, error: searchError } = await supabase
      .from('users')
      .select('perfil')
      .eq('email', email)
      .maybeSingle();
      
    if (!searchError && userByEmail && userByEmail.perfil === targetProfile) {
      console.log(`User ${email} already has the correct profile in database: ${targetProfile}`);
      
      // If metadata doesn't match database, update localStorage but skip database update
      const currentUserEmail = localStorage.getItem('userEmail');
      if (currentUserEmail === email) {
        const currentProfile = localStorage.getItem('userProfile');
        if (currentProfile !== targetProfile) {
          localStorage.setItem('userProfile', targetProfile);
          console.log("Updated profile in localStorage to match database");
          toast.success(`Seu perfil foi atualizado para ${targetProfile}`);
        }
      }
      return false; // No database update needed
    }
    
    // If we get here, update is needed
    console.log(`Profile update needed for ${email} to ${targetProfile}...`);
    const success = await updateUserProfile(email, targetProfile);
    
    if (success) {
      console.log(`User ${email} now has profile of ${targetProfile}`);
      // Update localStorage if the current user is this user
      const currentUserEmail = localStorage.getItem('userEmail');
      if (currentUserEmail === email) {
        localStorage.setItem('userProfile', targetProfile);
        console.log("Profile updated in localStorage");
        toast.success(`Seu perfil foi atualizado para ${targetProfile}`);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking/updating profile:", error);
    return false;
  }
};

// Create a separate function for initialization that runs only once
let hasInitialized = false;
export const initializeProfileCheck = () => {
  if (hasInitialized) return;
  
  hasInitialized = true;
  console.log("Initializing profile check once");
  
  // We'll run this check after a brief delay to ensure auth is initialized
  setTimeout(() => {
    updateGcmRibeiraProfile().then(updated => {
      if (updated) {
        console.log("Profile of gcmribeiradopombal@hotmail.com updated during initialization");
      } else {
        console.log("No profile update was needed during initialization");
      }
    });
  }, 2000);
};
