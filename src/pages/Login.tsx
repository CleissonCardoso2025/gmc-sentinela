import React, { useEffect } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginBackground } from "@/features/auth/components/LoginBackground";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import InstallBanner from "@/components/pwa/InstallBanner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Guard clause: já autenticado, não monta login
    if (localStorage.getItem("isAuthenticated") === "true") {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
        navigate("/index", { replace: true });
      } else if (userProfile === "Agente" || userProfile === "Corregedor") {
        navigate("/perfil", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    let isMounted = true; // Cancellation pattern

    // Verificar se o usuário acabou de fazer logout
    const justSignedOut = location.state?.signedOut === true;
    if (justSignedOut) {
      console.log("Usuário acabou de sair, permanecendo na página de login");
      // Limpar o estado para evitar loops
      window.history.replaceState({}, document.title);
      return;
    }

    // Verificação de sessão rápida e simples
    const checkSession = async () => {
      try {
        // Verificar se já existe uma sessão
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error || !data.session) {
          console.log("Nenhuma sessão válida encontrada, permanecendo na tela de login");
          return;
        }

        // Se há sessão, configurar dados do usuário e redirecionar
        console.log("Sessão encontrada, redirecionando...");

        // Definir perfil do usuário - forçar para "Inspetor" para o usuário cleissoncardoso@gmail.com
        let userProfile = data.session.user.user_metadata?.role || "Agente";
        if (data.session.user.email === "cleissoncardoso@gmail.com") {
          userProfile = "Inspetor";
        }

        // Armazenar dados do usuário no localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userProfile", userProfile);
        localStorage.setItem("userName", data.session.user.email || "");
        localStorage.setItem("userId", data.session.user.id);
        localStorage.setItem("userEmail", data.session.user.email || "");

        // Redirecionamento simples com navigate
        if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
          navigate("/index", { replace: true });
        } else if (userProfile === "Agente" || userProfile === "Corregedor") {
          navigate("/perfil", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Falha na verificação de sessão:", error);
        }
      }
    };

    // Iniciar a verificação de sessão imediatamente
    checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, location]);

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
