
import React, { useState, useEffect } from "react";
import { LoginBackground } from "@/features/auth/components/LoginBackground";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, AlertTriangle, Check } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{password?: string; confirm?: string}>({});
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessingHash, setIsProcessingHash] = useState(true);

  // Verificar a sessão e token na URL
  useEffect(() => {
    const processHashParams = async () => {
      setIsProcessingHash(true);
      
      try {
        // Log da URL para depuração
        console.log("URL completa:", window.location.href);
        console.log("Hash:", window.location.hash);
        
        const hashParams = window.location.hash;
        
        // Verificar se temos hash de recuperação
        if (!hashParams || !hashParams.includes("type=recovery")) {
          console.warn("URL não contém parâmetros de recuperação");
          setErrorMessage("Link de recuperação inválido ou expirado. Por favor, solicite um novo link.");
          setIsProcessingHash(false);
          return;
        }
        
        // Extrair e processar o token diretamente do hash
        const { data, error } = await supabase.auth.exchangeCodeForSession(hashParams.substring(1));
        
        if (error) {
          console.error("Erro ao processar token:", error);
          throw error;
        }
        
        console.log("Token processado com sucesso:", data);
        
        // Verificamos se já existe uma sessão (usuário já logado)
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          console.log("Usuário já autenticado:", sessionData.session.user);
        }
        
      } catch (error: any) {
        console.error("Erro ao processar parâmetros de URL:", error);
        
        let errorMsg = "Link de redefinição inválido ou expirado. Por favor, solicite um novo.";
        if (error.message && error.message.includes("expired")) {
          errorMsg = "O link de redefinição expirou. Por favor, solicite um novo link.";
        }
        
        setErrorMessage(errorMsg);
        
        toast({
          title: "Erro ao processar link de recuperação",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setIsProcessingHash(false);
      }
    };
    
    processHashParams();
  }, [toast]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: {password?: string; confirm?: string} = {};
    let isValid = true;
    
    if (!password) {
      newErrors.password = "A senha é obrigatória";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }
    
    if (!confirmPassword) {
      newErrors.confirm = "Confirme sua senha";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirm = "As senhas não coincidem";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Tentando atualizar senha...");
      const { data, error } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (error) {
        console.error("Erro ao redefinir senha:", error);
        throw error;
      }
      
      console.log("Senha atualizada com sucesso:", data);
      
      // Mostrar mensagem de sucesso
      setIsComplete(true);
      
      toast({
        title: "Senha atualizada com sucesso",
        description: "Você será redirecionado para a página de login.",
      });
      
      // Redirecionar para login após um breve atraso
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
      
    } catch (error: any) {
      console.error("Erro detalhado ao redefinir senha:", error);
      
      // Mensagem de erro personalizada baseada no tipo
      let errorMsg = "Ocorreu um erro ao redefinir sua senha. Tente novamente.";
      
      if (error.message) {
        if (error.message.includes("session")) {
          errorMsg = "Sessão de autenticação expirada ou inválida. Por favor, solicite um novo link de recuperação.";
        } else if (error.message.includes("JWT")) {
          errorMsg = "O link de redefinição expirou. Por favor, solicite um novo.";
        } else if (error.message.includes("User not found")) {
          errorMsg = "Usuário não encontrado. Verifique seu email.";
        }
      }
      
      toast({
        title: "Erro ao redefinir senha",
        description: errorMsg,
        variant: "destructive",
      });
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginBackground>
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img 
          src="/lovable-uploads/83b69061-6005-432b-8d81-e2ab0d07dc10.png" 
          alt="Sentinela" 
          className="w-[240px]" 
        />
      </div>
      
      {/* Reset Password Form */}
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Redefinir Senha</h1>
        
        {isProcessingHash ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
            <p className="text-gray-300">Verificando link de recuperação...</p>
          </div>
        ) : errorMessage ? (
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-800 rounded-md p-4 text-red-300">
              <p className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </p>
            </div>
            <Button 
              type="button" 
              onClick={() => navigate("/login", { replace: true })}
              className="w-full"
            >
              Voltar para Login
            </Button>
          </div>
        ) : isComplete ? (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-800 rounded-md p-4 text-green-300">
              <p className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Sua senha foi atualizada com sucesso. Você será redirecionado para a página de login.
                </span>
              </p>
            </div>
            <Button 
              type="button" 
              onClick={() => navigate("/login", { replace: true })}
              className="w-full"
            >
              Ir para Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-300">Nova Senha</Label>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900/60 border-gray-700 text-white pr-10" 
                  placeholder="Digite sua nova senha"
                  disabled={isLoading}
                />
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
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-900/60 border-gray-700 text-white pr-10" 
                  placeholder="Confirme sua nova senha"
                  disabled={isLoading}
                />
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
              {errors.confirm && <p className="text-sm text-red-500">{errors.confirm}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Processando...</span>
                </div>
              ) : "Atualizar Senha"}
            </Button>
            
            <div className="text-center">
              <a 
                href="/login" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Voltar para o login
              </a>
            </div>
          </form>
        )}
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Sentinela. Todos os direitos reservados.
      </div>
    </LoginBackground>
  );
};

export default ResetPassword;
