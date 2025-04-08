
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginFormSchema } from "../schemas/loginSchema";
import { useToast } from "@/hooks/use-toast";

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
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userProfile = localStorage.getItem("userProfile");
    
    if (isAuthenticated === "true" && userProfile) {
      // Redirect based on user profile
      if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
        navigate("/index");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Mock login - replace with actual authentication
      console.log("Login attempt with:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set user as authenticated
      localStorage.setItem("isAuthenticated", "true");
      
      // Store username
      localStorage.setItem("userName", data.username);
      
      // Mock user profile - in a real app, this would come from your authentication service
      // For demonstration, we'll set a profile based on username
      let userProfile = "Agente"; // Default profile
      
      // Simple mock to set different profiles based on username
      if (data.username.toLowerCase().includes("inspetor")) {
        userProfile = "Inspetor";
      } else if (data.username.toLowerCase().includes("subinspetor")) {
        userProfile = "Subinspetor";
      } else if (data.username.toLowerCase().includes("supervisor")) {
        userProfile = "Supervisor";
      } else if (data.username.toLowerCase().includes("corregedor")) {
        userProfile = "Corregedor";
      }
      
      // Store the user profile in localStorage
      localStorage.setItem("userProfile", userProfile);
      
      // Success notification
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${userProfile}. Você será redirecionado.`,
      });
      
      // Redirect based on user profile
      setTimeout(() => {
        if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    form,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
