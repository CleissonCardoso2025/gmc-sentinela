
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
        
        setIsAuthenticated(true);
        setUserId(session.user.id);
        
        // Check if the user has admin access
        // For this example, we're assuming admin users have the "Inspetor" profile
        // In a production system, you'd check for specific roles in a user_roles table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('perfil')
          .eq('id', session.user.id)
          .single();
        
        if (userError) {
          console.error("Error fetching user role:", userError);
          // Don't throw here - we'll just set isAdmin to false
          setIsAdmin(false);
          return;
        }
        
        // Check if the user profile is "Inspetor" which grants admin access
        setIsAdmin(userData?.perfil === 'Inspetor');
        console.log("User authentication status:", { 
          isAuthenticated: true, 
          userId: session.user.id,
          isAdmin: userData?.perfil === 'Inspetor',
          profile: userData?.perfil
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
          
          // Check admin status when auth state changes
          if (session) {
            try {
              const { data, error } = await supabase
                .from('users')
                .select('perfil')
                .eq('id', session.user.id)
                .single();
                
              if (error) throw error;
              setIsAdmin(data?.perfil === 'Inspetor');
            } catch (error) {
              console.error("Error checking admin status:", error);
              setIsAdmin(false);
            }
          }
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
