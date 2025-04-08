
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthorization } from '@/hooks/use-authorization';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  userProfile: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userProfile, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAccessToPage } = useAuthorization(userProfile);
  
  // Login page should always be accessible
  if (location.pathname === '/login') {
    return <>{children}</>;
  }
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if the stored profile should be redirected
  useEffect(() => {
    const storedUserProfile = localStorage.getItem('userProfile');
    
    // If there's a logged in user and they're at the root path
    if (storedUserProfile && location.pathname === '/index') {
      // Only redirect non-inspetors to dashboard
      if (storedUserProfile !== 'Inspetor') {
        navigate('/dashboard');
      }
    }
  }, [location.pathname, navigate]);
  
  const hasAccess = hasAccessToPage(location.pathname);
  
  if (!hasAccess) {
    toast.error("Você não tem permissão para acessar esta página");
    
    return (
      <div className="p-8 max-w-md mx-auto my-12 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="mb-6">
          Você não tem permissão para acessar esta página. 
          Por favor, contate o administrador se acredita que isto é um erro.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
