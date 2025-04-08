
import { updateUserProfile } from "../services/userService/updateUserProfile";

// This function will update the specific user's profile
export const updateGcmRibeiraProfile = async () => {
  const email = "gcmribeiradopombal@hotmail.com";
  const newProfile = "Inspetor";
  
  console.log(`Atualizando perfil do usuário ${email} para ${newProfile}...`);
  const success = await updateUserProfile(email, newProfile);
  
  if (success) {
    console.log(`Usuário ${email} agora tem perfil de ${newProfile}`);
    // Update localStorage if the current user is this user
    const currentUserEmail = localStorage.getItem('userEmail');
    if (currentUserEmail === email) {
      localStorage.setItem('userProfile', newProfile);
      console.log("Perfil atualizado no localStorage");
    }
  }
};
