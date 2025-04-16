import { updateUserProfile } from "../services/userService/updateUserProfile";
import { toast } from "sonner";

// Track if the profile was updated in the current session
let profileUpdatedInSession = false;

// This function will update the specific user's profile
export const updateGcmRibeiraProfile = async () => {
  const email = "gcmribeiradopombal@hotmail.com";
  const newProfile = "Inspetor";
  
  // If the profile was already updated in this session, skip update
  if (profileUpdatedInSession) {
    console.log(`Profile update for ${email} already done in this session, skipping`);
    return true;
  }
  
  try {
    // Check if current profile is already set to the target value
    const currentProfile = localStorage.getItem('userProfile');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userEmail === email && currentProfile === newProfile) {
      console.log(`User ${email} already has profile ${newProfile}, no update needed`);
      profileUpdatedInSession = true;
      return true;
    }
    
    console.log(`Atualizando perfil do usuário ${email} para ${newProfile}...`);
    const success = await updateUserProfile(email, newProfile, true);
    
    if (success) {
      console.log(`Usuário ${email} agora tem perfil de ${newProfile}`);
      // Update localStorage if the current user is this user
      if (userEmail === email) {
        localStorage.setItem('userProfile', newProfile);
        console.log("Perfil atualizado no localStorage");
        toast.success(`Seu perfil foi atualizado para ${newProfile}`);
      }
      
      // Set flag to avoid repeated updates in the same session
      profileUpdatedInSession = true;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    toast.error("Erro ao atualizar perfil do usuário");
    return false;
  }
};

// Run the function once on import, but with a small delay to ensure
// other components are initialized first
setTimeout(() => {
  updateGcmRibeiraProfile().then(success => {
    if (success) {
      console.log("Perfil do usuário gcmribeiradopombal@hotmail.com verificado durante a inicialização");
    }
  });
}, 1000);
