
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginFormSchema } from "../schemas/loginSchema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false); // Iniciar como false para evitar atrasos
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Remover a verificação de sessão duplicada no hook useLoginForm
  // para evitar conflitos com o componente Login.tsx

  const handleSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Limpar espaços em branco nas credenciais
      const cleanEmail = data.username.trim();
      const cleanPassword = data.password.trim();
      
      console.log("Tentativa de login com:", cleanEmail);
      
      // Autenticação via Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });
      
      if (error) {
        console.error("Erro de login:", error);
        
        // Mensagem de erro específica
        let errorMessage = "Verifique suas credenciais e tente novamente";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        } else if (error.status === 429) {
          errorMessage = "Muitas tentativas de login. Por favor, aguarde alguns minutos e tente novamente.";
        }
        
        toast({
          title: "Erro ao fazer login",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false); // Importante: desativar o estado de carregamento em caso de erro
        return;
      }
      
      const session = authData.session;
      const user = authData.user;
      
      if (!session || !user) {
        toast({
          title: "Erro ao fazer login",
          description: "Não foi possível estabelecer uma sessão",
          variant: "destructive",
        });
        setIsLoading(false); // Importante: desativar o estado de carregamento em caso de erro
        return;
      }
      
      // Definir perfil do usuário - forçar para "Inspetor" para o usuário cleissoncardoso@gmail.com
      let userProfile = user.user_metadata?.role || "Agente";
      if (user.email === "cleissoncardoso@gmail.com") {
        userProfile = "Inspetor";
      }
      
      // Armazenar dados no localStorage ANTES do redirecionamento
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userProfile", userProfile);
      localStorage.setItem("userName", user.email || "");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email || "");
      
      // Notificação de sucesso
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${userProfile}. Você será redirecionado.`,
        duration: 2000, // Reduzido para 2 segundos
      });
      
      // IMPORTANTE: Não desativar o estado de carregamento aqui para evitar que o formulário seja limpo
      
      // Redirecionar com base no perfil - sem atrasos para Inspetores
      console.log(`Redirecionando usuário com perfil ${userProfile}`);
      
      // Redirecionamento simples com window.location após um pequeno atraso
      setTimeout(() => {
        if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
          window.location.href = "/index"; // Usar window.location para forçar uma navegação completa
        } else if (userProfile === "Agente" || userProfile === "Corregedor") {
          window.location.href = "/perfil";
        } else {
          window.location.href = "/dashboard";
        }
      }, 500); // Atraso de 500ms para garantir que o localStorage seja atualizado
    } catch (error) {
      console.error("Erro de login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsLoading(false); // Desativar o estado de carregamento apenas em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    form,
    isLoading,
    isCheckingSession,
    showPassword,
    togglePasswordVisibility,
    onSubmit: handleSubmit,
  };
}
