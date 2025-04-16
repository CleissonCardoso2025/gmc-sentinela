
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      
      try {
        // First, get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          console.log("No active session found");
          setIsAuthenticated(false);
          setIsAdmin(false);
          return;
        }
        
        // If user is authenticated, give them admin access
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setIsAdmin(true); // Give all authenticated users admin access
        
        console.log("User authentication status:", { 
          isAuthenticated: true, 
          userId: session.user.id,
          isAdmin: true
        });
        
      } catch (error) {
        console.error("Authentication check failed:", error);
        toast.error("Falha ao verificar autenticação");
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthentication();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(true);
          setUserId(session?.user.id || null);
          setIsAdmin(true); // Give all authenticated users admin access
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserId(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { isAdmin, isAuthenticated, isLoading, userId };
}
