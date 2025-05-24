
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  userProfile: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userProfile, children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      try {
        // Verificar sessão do Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error || !data.session) {
          console.log("Usuário não autenticado, redirecionando para login");
          setIsAuthenticated(false);
          setRedirectPath('/login');
          return;
        }

        // Usuário autenticado
        setIsAuthenticated(true);

        // Verificar permissões de acesso
        checkAccess();
        
      } catch (error) {
        if (isMounted) {
          console.error("Erro na verificação de autenticação:", error);
          setIsAuthenticated(false);
          setRedirectPath('/login');
        }
      }
    };

    const checkAccess = () => {
      // Inspetor e Subinspetor têm acesso total
      if (userProfile === 'Inspetor' || userProfile === 'Subinspetor') {
        setRedirectPath(null);
        return;
      }

      // Usuários com perfil "Agente" têm acesso restrito
      if (userProfile === 'Agente') {
        const allowedPaths = ['/ocorrencias', '/perfil'];
        const isAllowed = allowedPaths.some(path => 
          currentPath === path || currentPath.startsWith(`${path}/`)
        );
        
        if (!isAllowed) {
          setRedirectPath('/perfil');
          return;
        }
      }
      
      // Usuários com perfil "Corregedor" têm acesso restrito
      if (userProfile === 'Corregedor') {
        const allowedPaths = ['/ocorrencias', '/corregedoria', '/perfil'];
        const isAllowed = allowedPaths.some(path => 
          currentPath === path || currentPath.startsWith(`${path}/`)
        );
        
        if (!isAllowed) {
          setRedirectPath('/perfil');
          return;
        }
      }

      // Se chegou aqui, não precisa de redirecionamento
      setRedirectPath(null);
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [userProfile, currentPath]);

  // Mostrar loading enquanto verifica
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Verificando permissões...</div>
      </div>
    );
  }

  // Redirecionamento se necessário
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
