
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkSession = async () => {
      setIsCheckingSession(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User already has an active session, expires at:", 
            session.expires_at ? new Date(session.expires_at * 1000).toISOString() : "unknown");
          
          // Get user profile from user_metadata
          const userProfile = session.user.user_metadata?.role || "Agente";
          
          // Store the user profile in localStorage for compatibility with existing code
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userProfile", userProfile);
          localStorage.setItem("userName", session.user.email || "");
          localStorage.setItem("userId", session.user.id);
          localStorage.setItem("userEmail", session.user.email || "");
          
          // Only redirect after we've confirmed there's a valid session
          setTimeout(() => {
            // Redirect based on user profile
            if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
              navigate("/index", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    if (isCheckingSession) return; // Don't allow login attempts while checking session
    
    setIsLoading(true);
    
    try {
      console.log("Login attempt with:", data.username);
      
      // Use Supabase auth for real authentication
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.username,
        password: data.password,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente",
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
    onSubmit: form.handleSubmit(onSubmit),
  };
}
