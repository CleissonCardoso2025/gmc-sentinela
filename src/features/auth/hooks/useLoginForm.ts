
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("User already has an active session");
        
        // Get user profile from user_metadata
        const userProfile = session.user.user_metadata?.role || "Agente";
        
        // Store the user profile in localStorage for compatibility with existing code
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userProfile", userProfile);
        localStorage.setItem("userName", session.user.email || "");
        localStorage.setItem("userId", session.user.id);
        
        // Redirect based on user profile
        if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
          navigate("/index");
        } else {
          navigate("/dashboard");
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Login attempt with:", data.username);
      
      // Since we're using mock auth for now, simulate Supabase auth
      // In production, this would use supabase.auth.signInWithPassword
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user login - in a real implementation, you'd use Supabase auth
      const mockUserProfile = getMockUserProfile(data.username);
      
      // Store auth data in localStorage for now (this is just for the mock implementation)
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userProfile", mockUserProfile);
      localStorage.setItem("userName", data.username);
      localStorage.setItem("userId", "e632890d-208e-489b-93a3-eae0dd0a9a08"); // Mock ID
      
      // Success notification
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${mockUserProfile}. Você será redirecionado.`,
      });
      
      // Redirect based on user profile
      setTimeout(() => {
        if (mockUserProfile === "Inspetor" || mockUserProfile === "Subinspetor") {
          navigate("/index");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine user profile based on username (mock implementation)
  const getMockUserProfile = (username: string): string => {
    if (username.toLowerCase().includes("inspetor")) {
      return "Inspetor";
    } else if (username.toLowerCase().includes("subinspetor")) {
      return "Subinspetor";
    } else if (username.toLowerCase().includes("supervisor")) {
      return "Supervisor";
    } else if (username.toLowerCase().includes("corregedor")) {
      return "Corregedor";
    }
    return "Agente"; // Default profile
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    form,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
