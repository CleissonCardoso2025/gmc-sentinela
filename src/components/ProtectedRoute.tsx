
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthorization } from '@/hooks/use-authorization';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  userProfile: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userProfile, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAccessToPage } = useAuthorization(userProfile);
  const { 
    isAuthenticated, 
    isLoading, 
    sessionInitialized,
    user, 
    userRole, 
    refreshSession 
  } = useAdminAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  
  // Login page should always be accessible
  const isLoginPage = location.pathname === '/login';
  
  // Make sure we refresh the session if needed
  useEffect(() => {
    let mounted = true;
    
    const checkSessionValidity = async () => {
      if (mounted && isAuthenticated && user) {
        // Check if session is near expiration, and refresh if needed
        const { session, error } = await refreshSession();
        if (mounted && !session && error) {
          console.error("Failed to refresh session:", error);
          // If session refresh failed, redirect to login
          toast.error("Sua sessão expirou. Por favor, faça login novamente.");
          navigate('/login', { replace: true });
        }
      }
    };
    
    if (sessionInitialized) {
      checkSessionValidity();
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user, sessionInitialized, refreshSession, navigate]);
  
  // Store auth data for pages that still use localStorage-based auth
  useEffect(() => {
    let mounted = true;

    const setupLocalStorage = () => {
      if (!mounted || !isAuthenticated || !user || !sessionInitialized) return;
      
      localStorage.setItem('isAuthenticated', 'true');
      
      // Get user profile from user_metadata or fall back to the role passed to this component
      const effectiveUserProfile = userRole || userProfile;
      localStorage.setItem('userProfile', effectiveUserProfile);
      
      // Set user ID for auth checks
      localStorage.setItem('userId', user.id);
      localStorage.setItem('currentUserId', user.id);
      
      // Set user email
      if (user.email) {
        localStorage.setItem('userEmail', user.email);
      } else if (effectiveUserProfile === 'Inspetor') {
        // For testing, if no email is set but user is an Inspetor, use the default email
        localStorage.setItem('userEmail', 'gcmribeiradopombal@hotmail.com');
      }
    };
    
    setupLocalStorage();
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user, userProfile, userRole, sessionInitialized]);
  
  // Check if the stored profile should be redirected from root to dashboard
  useEffect(() => {
    let mounted = true;
    
    const handleRedirect = () => {
      if (!mounted || !sessionInitialized || !isAuthenticated || location.pathname !== '/') return;
      
      setIsRedirecting(true);
      setTimeout(() => {
        if (mounted) {
          navigate('/dashboard', { replace: true });
          setIsRedirecting(false);
        }
      }, 100);
    };
    
    handleRedirect();
    
    return () => {
      mounted = false;
    };
  }, [location.pathname, navigate, isAuthenticated, sessionInitialized]);
  
  // Determine if user has access to the requested page
  useEffect(() => {
    // Only check access if not on login page and authenticated
    if (!isLoginPage && isAuthenticated && sessionInitialized) {
      // Special check for /index path - only Inspetor or Subinspetor can access
      if (location.pathname === '/index') {
        const effectiveProfile = userRole || userProfile;
        const canAccess = effectiveProfile === 'Inspetor' || effectiveProfile === 'Subinspetor';
        
        if (!canAccess) {
          toast.error("Você não tem permissão para acessar o Centro de Comando");
          navigate('/dashboard', { replace: true });
          return;
        }
      }
      
      // Check if user has access to the current page
      const access = hasAccessToPage(location.pathname);
      setHasAccess(access);
      
      if (!access) {
        toast.error("Você não tem permissão para acessar esta página");
      }
    } else {
      // By default, allow access to login page
      setHasAccess(isLoginPage);
    }
  }, [isLoginPage, location.pathname, hasAccessToPage, userProfile, userRole, isAuthenticated, sessionInitialized, navigate]);
  
  // Show loading state while auth is being checked
  if (isLoading || !sessionInitialized || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // If login page, always render
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If no access, show access denied message
  if (!hasAccess) {
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
  
  // If user has access, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
