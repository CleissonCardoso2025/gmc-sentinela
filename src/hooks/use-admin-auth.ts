
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';

// Configuration for refresh throttling
const REFRESH_THROTTLE_MS = 60000; // Minimum time between refresh attempts (1 minute)
const REFRESH_BACKOFF_MAX = 5 * 60 * 1000; // Maximum backoff time (5 minutes)
const REFRESH_BACKOFF_FACTOR = 2; // Exponential backoff factor

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessionInitialized, setSessionInitialized] = useState<boolean>(false);
  
  // Refs for throttling and backoff
  const lastRefreshAttempt = useRef<number>(0);
  const currentBackoff = useRef<number>(1000); // Start with 1 second
  const refreshAttempts = useRef<number>(0);
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const isMountedRef = useRef<boolean>(true);
  
  // Initialize auth state only once on mount
  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    
    const initializeAuth = async () => {
      try {
        // First set up the auth state listener to handle changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (!isMountedRef.current) return;
          
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
        });
        
        authSubscriptionRef.current = authListener.subscription;
        
        // Then check for an existing session
        if (isMountedRef.current) {
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error fetching session:", error);
            throw error;
          }
          
          if (initialSession && isMountedRef.current) {
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
          } else if (isMountedRef.current) {
            console.log("No active session found");
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setSessionInitialized(true);
        }
      }
    };
    
    initializeAuth();
    
    return () => {
      isMountedRef.current = false;
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe();
        authSubscriptionRef.current = null;
      }
    };
  }, []);
  
  // Function to refresh the session with fixed return type and throttling
  const refreshSession = async (): Promise<{ session: Session | null, error: any }> => {
    try {
      const now = Date.now();
      
      // Check if we're trying to refresh too frequently
      if (now - lastRefreshAttempt.current < REFRESH_THROTTLE_MS) {
        console.log(`Refresh throttled. Next refresh available in ${Math.ceil((lastRefreshAttempt.current + REFRESH_THROTTLE_MS - now) / 1000)} seconds`);
        // Return the current session without refreshing
        return { session, error: null };
      }
      
      // If too many consecutive refresh attempts, apply exponential backoff
      if (refreshAttempts.current > 2) {
        const backoffMs = Math.min(currentBackoff.current * REFRESH_BACKOFF_FACTOR, REFRESH_BACKOFF_MAX);
        currentBackoff.current = backoffMs;
        
        console.log(`Backoff applied. Waiting ${backoffMs/1000} seconds before next refresh attempt`);
        
        // Just return the current session for now
        if (refreshAttempts.current > 5) {
          console.warn("Too many refresh attempts. Consider logging out and in again.");
          return { session, error: new Error("Too many refresh attempts") };
        }
      }
      
      // Update the last attempt timestamp and increment attempts counter
      lastRefreshAttempt.current = now;
      refreshAttempts.current += 1;
      
      setIsLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Failed to refresh session:", error);
        
        // Only show an error toast on actual auth errors, not rate limiting
        if (error.status !== 429) {
          toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        } else {
          console.warn("Rate limit hit on session refresh. Backing off...");
        }
        
        return { session: null, error };
      }
      
      // Successful refresh - reset backoff and attempts
      currentBackoff.current = 1000;
      refreshAttempts.current = 0;
      
      if (data.session && isMountedRef.current) {
        setSession(data.session);
        setUser(data.session.user);
        setIsAuthenticated(true);
        console.log("Session refreshed, new expiry:", 
          data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : "unknown");
      } else if (isMountedRef.current) {
        setIsAuthenticated(false);
        setSession(null);
        setUser(null);
        console.log("No session returned after refresh attempt");
      }
      
      return { session: data.session, error: null };
    } catch (error) {
      console.error("Failed to refresh session:", error);
      
      // Only show toast on non-network errors
      if (!(error instanceof TypeError)) {
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      }
      
      return { session: null, error };
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };
  
  return { 
    isAdmin, 
    isAuthenticated, 
    isLoading,
    sessionInitialized,
    userId, 
    userRole,
    session, // Return session separately from user
    user,
    refreshSession
  };
}
