import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin-auth';

interface ProtectedRouteProps {
  userProfile: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userProfile, children }) => {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Verificar permissões apenas quando o componente montar ou o caminho mudar
    // Isso evita loops de redirecionamento
    const checkAccess = () => {
      // Se não autenticado, redireciona para login
      if (!isAuthenticated) {
        setRedirectPath('/login');
        return;
      }

      // Inspetor e Subinspetor têm acesso total
      if (userProfile === 'Inspetor' || userProfile === 'Subinspetor') {
        setRedirectPath(null); // Sem redirecionamento
        return;
      }

      // Usuários com perfil "Agente" têm acesso restrito
      if (userProfile === 'Agente') {
        // Lista de caminhos permitidos para Agentes
        const allowedPaths = [
          '/ocorrencias', 
          '/perfil'
        ];
        
        // Verifica se o caminho atual começa com algum dos caminhos permitidos
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
        // Lista de caminhos permitidos para Corregedores
        const allowedPaths = [
          '/ocorrencias', 
          '/corregedoria',
          '/perfil'
        ];
        
        // Verifica se o caminho atual começa com algum dos caminhos permitidos
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

    checkAccess();
  }, [isAuthenticated, userProfile, currentPath]);

  // Redirecionamento se necessário
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
