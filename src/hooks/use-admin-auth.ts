
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
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
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
      
      setIsLoading(false);
    });
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
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
      } catch (error) {
        console.error("Authentication initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
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
      
      return data.session;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      toast({
        title: "Erro de autenticação",
        description: "Sua sessão expirou. Por favor, faça login novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    isAdmin, 
    isAuthenticated, 
    isLoading, 
    userId, 
    userRole,
    session,
    user,
    refreshSession
  };
}
