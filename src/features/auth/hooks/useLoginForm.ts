
import { useState, useEffect, useRef } from "react";
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const sessionCheckCompletedRef = useRef(false);
  const isMountedRef = useRef(true);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Check if user is already authenticated on component mount
  useEffect(() => {
    isMountedRef.current = true;
    
    const checkSession = async () => {
      // Skip if we've already checked the session
      if (sessionCheckCompletedRef.current || !isMountedRef.current) return;
      
      setIsCheckingSession(true);
      try {
        sessionCheckCompletedRef.current = true;
        
        // Check if we just logged out (passed via state)
        const justSignedOut = location.state?.signedOut === true;
        if (justSignedOut) {
          console.log("User just signed out, skipping session check");
          setIsCheckingSession(false);
          return;
        }
        
        const { data } = await supabase.auth.getSession();
        
        if (isMountedRef.current && data.session) {
          console.log("User already has an active session, expires at:", 
            data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : "unknown");
          
          // Get user profile from user_metadata
          const userProfile = data.session.user.user_metadata?.role || "Agente";
          
          // Store the user profile in localStorage for compatibility with existing code
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userProfile", userProfile);
          localStorage.setItem("userName", data.session.user.email || "");
          localStorage.setItem("userId", data.session.user.id);
          localStorage.setItem("userEmail", data.session.user.email || "");
          
          // Only redirect after we've confirmed there's a valid session
          if (isMountedRef.current) {
            setTimeout(() => {
              // Redirect based on user profile
              if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
                navigate("/index", { replace: true });
              } else {
                navigate("/dashboard", { replace: true });
              }
            }, 100);
          }
        } else if (isMountedRef.current) {
          setIsCheckingSession(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (isMountedRef.current) {
          setIsCheckingSession(false);
        }
      }
    };
    
    checkSession();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [navigate, location]);

  const handleSubmit = async (data: LoginFormValues) => {
    if (isCheckingSession) return; // Don't allow login attempts while checking session
    
    setIsLoading(true);
    
    try {
      // Limpar qualquer espaço em branco nas credenciais
      const cleanEmail = data.username.trim();
      const cleanPassword = data.password.trim();
      
      console.log("Login attempt with:", cleanEmail);
      
      // Use Supabase auth for real authentication
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // Exibir mensagem de erro mais específica
        let errorMessage = "Verifique suas credenciais e tente novamente";
        
        // Verificar tipo de erro para fornecer mensagem mais específica
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
      
      // Get user profile from user_metadata
      const userProfile = user.user_metadata?.role || "Agente";
      
      // Store auth data in localStorage for now (for compatibility with existing code)
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userProfile", userProfile);
      localStorage.setItem("userName", user.email || "");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email || "");
      
      // Success notification
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${userProfile}. Você será redirecionado.`,
      });
      
      // Wait a moment to ensure session is properly set before redirecting
      setTimeout(() => {
        if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
          navigate("/index", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 100);
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      });
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
