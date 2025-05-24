
import React, { useEffect, useState } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginBackground } from "@/features/auth/components/LoginBackground";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import InstallBanner from "@/components/pwa/InstallBanner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        // Verificar se o usuário acabou de fazer logout
        const justSignedOut = location.state?.signedOut === true;
        if (justSignedOut) {
          console.log("Usuário acabou de sair, permanecendo na página de login");
          // Limpar o estado para evitar loops
          window.history.replaceState({}, document.title);
          if (isMounted) setIsChecking(false);
          return;
        }

        // Verificar sessão no Supabase de forma mais robusta
        const { data, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error("Erro ao verificar sessão:", error);
          // Limpar localStorage em caso de erro
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userProfile");
          setIsChecking(false);
          return;
        }

        if (data.session && data.session.user) {
          console.log("Sessão válida encontrada, redirecionando...");
          
          // Definir perfil do usuário
          let userProfile = data.session.user.user_metadata?.role || "Agente";
          if (data.session.user.email === "cleissoncardoso@gmail.com") {
            userProfile = "Inspetor";
          }

          // Armazenar dados no localStorage de forma consistente
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userProfile", userProfile);
          localStorage.setItem("userName", data.session.user.email || "");
          localStorage.setItem("userId", data.session.user.id);
          localStorage.setItem("userEmail", data.session.user.email || "");

          // Redirecionamento direto baseado no perfil
          if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
            navigate("/index", { replace: true });
          } else if (userProfile === "Agente" || userProfile === "Corregedor") {
            navigate("/perfil", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        } else {
          console.log("Nenhuma sessão encontrada, mostrando tela de login");
          // Limpar qualquer dados antigos do localStorage
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userProfile");
          setIsChecking(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Erro na verificação de autenticação:", error);
          // Limpar localStorage em caso de erro
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userProfile");
          setIsChecking(false);
        }
      }
    };

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, [navigate, location.state?.signedOut]);

  // Mostrar loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <LoginBackground>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-white text-lg">Verificando autenticação...</div>
        </div>
      </LoginBackground>
    );
  }

  // Mostrar tela de login
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
      
      {/* Login Form */}
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Acesso ao Sistema</h1>
        <LoginForm />
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Sentinela. Todos os direitos reservados.
      </div>

      {/* PWA Install Banner */}
      <InstallBanner />
    </LoginBackground>
  );
};

export default Login;
