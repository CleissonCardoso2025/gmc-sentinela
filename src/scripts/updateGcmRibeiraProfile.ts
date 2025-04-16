
import { updateUserProfile } from "../services/userService/updateUserProfile";
import { toast } from "sonner";

// This function will update the specific user's profile
export const updateGcmRibeiraProfile = async () => {
  const email = "gcmribeiradopombal@hotmail.com";
  const newProfile = "Inspetor";
  
  try {
    console.log(`Atualizando perfil do usuário ${email} para ${newProfile}...`);
    const success = await updateUserProfile(email, newProfile);
    
    if (success) {
      console.log(`Usuário ${email} agora tem perfil de ${newProfile}`);
      // Update localStorage if the current user is this user
      const currentUserEmail = localStorage.getItem('userEmail');
      if (currentUserEmail === email) {
        localStorage.setItem('userProfile', newProfile);
        console.log("Perfil atualizado no localStorage");
        toast.success(`Seu perfil foi atualizado para ${newProfile}`);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    toast.error("Erro ao atualizar perfil do usuário");
    return false;
  }
};

// Run the function once on import to ensure the user has the correct profile
updateGcmRibeiraProfile().then(success => {
  if (success) {
    console.log("Perfil do usuário gcmribeiradopombal@hotmail.com atualizado com sucesso durante a inicialização");
  }
});
