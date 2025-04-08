
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define form schema with validation
const formSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Mock login - replace with actual authentication
      console.log("Login attempt with:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      
      // Store the user profile in localStorage (in a real app, this might be in a secure cookie or state management)
      localStorage.setItem("userProfile", userProfile);
      
      // Success notification
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${userProfile}. Você será redirecionado.`,
      });
      
      // Redirect based on user profile
      setTimeout(() => {
        if (userProfile === "Inspetor") {
          navigate("/"); // Inspetor goes to index
        } else {
          navigate("/dashboard"); // Others go to dashboard
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black overflow-hidden relative">
      {/* Background lighting effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]" />
      
      <div className="z-10 w-full max-w-md px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/83b69061-6005-432b-8d81-e2ab0d07dc10.png" 
            alt="Sentinela" 
            className="w-[240px]" 
          />
        </div>
        
        {/* Login Form */}
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Acesso ao Sistema</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Usuário</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          className="pl-10 bg-gray-900/60 border-gray-700 text-white" 
                          placeholder="Digite seu usuário"
                          disabled={isLoading}
                        />
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          type={showPassword ? "text" : "password"} 
                          className="pl-10 pr-10 bg-gray-900/60 border-gray-700 text-white" 
                          placeholder="Digite sua senha"
                          disabled={isLoading}
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <button 
                          type="button" 
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-gray-400"
                          tabIndex={-1}
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <div className="text-right">
                <a 
                  href="#" 
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Recuperação de senha",
                      description: "Funcionalidade em desenvolvimento",
                    });
                  }}
                >
                  Esqueceu a senha?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Sentinela. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;
