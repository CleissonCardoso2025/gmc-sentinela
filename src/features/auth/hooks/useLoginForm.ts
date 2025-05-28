
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginFormSchema } from "../schemas/loginSchema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useLoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormInitializing, setIsFormInitializing] = useState(true);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange"
  });

  // Aguardar a inicialização completa do formulário
  useEffect(() => {
    console.log("useLoginForm: Form initialization check", {
      formExists: !!form,
      control: !!form?.control,
      formState: !!form?.formState,
      register: !!form?.register,
      defaultValues: form?.getValues(),
      errors: form?.formState?.errors
    });

    // Verificar se todos os elementos essenciais do form estão prontos
    if (form && form.control && form.formState && form.register) {
      console.log("useLoginForm: Form is fully initialized");
      setIsFormInitializing(false);
    }
  }, [form, form.control, form.formState, form.register]);

  const handleSubmit = async (data: LoginFormValues) => {
    console.log("useLoginForm: handleSubmit called with data:", {
      username: data.username,
      password: data.password ? "***" : "empty"
    });

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
        return;
      }
      
      // Definir perfil do usuário - forçar para "Inspetor" para o usuário cleissoncardoso@gmail.com
      let userProfile = user.user_metadata?.role || "Agente";
      if (user.email === "cleissoncardoso@gmail.com") {
        userProfile = "Inspetor";
      }
      
      // Armazenar dados no localStorage de forma consistente
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userProfile", userProfile);
      localStorage.setItem("userName", user.email || "");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email || "");
      
      // Notificação de sucesso
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${userProfile}!`,
        duration: 2000,
      });
      
      console.log(`Login bem-sucedido, redirecionando usuário com perfil ${userProfile}`);
      
      // Redirecionamento baseado no perfil
      if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
        navigate("/index", { replace: true });
      } else if (userProfile === "Agente" || userProfile === "Corregedor") {
        navigate("/perfil", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Erro de login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    console.log("useLoginForm: togglePasswordVisibility called, current state:", showPassword);
    setShowPassword(!showPassword);
  };

  // Sempre retornar o objeto form, mas usar isFormInitializing para controlar a renderização
  return {
    form,
    isFormInitializing,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    onSubmit: handleSubmit,
  };
}
