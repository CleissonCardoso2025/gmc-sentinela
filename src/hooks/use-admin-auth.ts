
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessionInitialized, setSessionInitialized] = useState<boolean>(false);
  
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // First set up the auth state listener to handle changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log("Auth state changed:", event, newSession?.expires_at ? new Date(newSession.expires_at * 1000).toISOString() : null);
          
          // Update state with the new session
          setSession(newSession);
          setUser(newSession?.user || null);
          setIsAuthenticated(!!newSession);
          setUserId(newSession?.user?.id || null);
          
          if (newSession?.user) {
            // Check if user has admin role in user_metadata
            const role = newSession.user.user_metadata?.role;
            setUserRole(role);
            
            // For now, all authenticated users get admin access
            setIsAdmin(true);
            
            console.log("User authenticated:", { 
              userId: newSession.user.id,
              role: role,
              isAdmin: true,
              expiresAt: newSession.expires_at ? new Date(newSession.expires_at * 1000).toISOString() : null
            });
          } else {
            setIsAdmin(false);
            setUserRole(null);
            console.log("User not authenticated");
          }
          
          setSessionInitialized(true);
          setIsLoading(false);
        });
        
        subscription = authListener.subscription;
        
        // Then check for an existing session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          throw error;
        }
        
        if (initialSession) {
          console.log("Initial session found, expires at:", 
            initialSession.expires_at ? new Date(initialSession.expires_at * 1000).toISOString() : "unknown");
          
          setSession(initialSession);
          setUser(initialSession.user);
          setIsAuthenticated(true);
          setUserId(initialSession.user.id);
          
          // Check if user has admin role in user_metadata
          const role = initialSession.user.user_metadata?.role;
          setUserRole(role);
          
          // For now, all authenticated users get admin access
          setIsAdmin(true);
        } else {
          console.log("No active session found");
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserRole(null);
        }
        
        setSessionInitialized(true);
      } catch (error) {
        console.error("Authentication initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);
  
  // Function to refresh the session
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        console.log("Session refreshed, new expiry:", 
          data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : "unknown");
      }
      
      return { session: data.session, error: null };
    } catch (error) {
      console.error("Failed to refresh session:", error);
      toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      return { session: null, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    isAdmin, 
    isAuthenticated, 
    isLoading,
    sessionInitialized,
    userId, 
    userRole,
    session,
    user,
    refreshSession
  };
}
