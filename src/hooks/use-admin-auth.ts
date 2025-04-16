
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
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
          setUserRole(null);
          return;
        }
        
        // User is authenticated
        setIsAuthenticated(true);
        setUserId(session.user.id);
        
        // Check if user has admin role in user_metadata
        const role = session.user.user_metadata?.role;
        setUserRole(role);
        
        // For now, all authenticated users get admin access
        // But we store the actual role for future permission checking
        setIsAdmin(true);
        
        console.log("User authentication status:", { 
          isAuthenticated: true, 
          userId: session.user.id,
          role: role,
          isAdmin: true
        });
        
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserRole(null);
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
          
          // Check if user has admin role in user_metadata
          const role = session?.user.user_metadata?.role;
          setUserRole(role);
          
          // For now, all authenticated users get admin access
          setIsAdmin(true);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserId(null);
          setUserRole(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return { isAdmin, isAuthenticated, isLoading, userId, userRole };
}
