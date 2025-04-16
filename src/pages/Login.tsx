import React, { useEffect, useState, useRef } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginBackground } from "@/features/auth/components/LoginBackground";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const sessionCheckCompletedRef = useRef(false);
  const authSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const isMountedRef = useRef(true);
  
  // Check for existing session and redirect if found
  useEffect(() => {
    isMountedRef.current = true;
    
    const checkAndRedirect = async () => {
      try {
        // Skip if we've already completed a session check on this component instance
        if (sessionCheckCompletedRef.current) return;
        
        setIsCheckingSession(true);
        
        // First set up the auth state listener to handle changes
        const { data } = await supabase.auth.onAuthStateChange((event, session) => {
          // Skip updates if component is unmounted
          if (!isMountedRef.current) return;
          
          console.log("Auth state changed on login page:", event);
          
          // Make sure we handle SIGNED_OUT event properly (clear redirect logic)
          if (event === 'SIGNED_OUT') {
            console.log("User signed out, staying on login page");
            setIsCheckingSession(false);
            return;
          }
          
          // Don't proceed with redirect logic inside the listener itself
          // to avoid potential race conditions
          if (session && event !== 'INITIAL_SESSION') {
            // Defer the redirect logic slightly to avoid React state update conflicts
            setTimeout(() => {
              if (!isMountedRef.current) return;
              
              // Get user profile from user_metadata
              const userProfile = session.user.user_metadata?.role || "Agente";
              
              // Store the user profile in localStorage for compatibility with existing code
              localStorage.setItem("isAuthenticated", "true");
              localStorage.setItem("userProfile", userProfile);
              localStorage.setItem("userName", session.user.email || "");
              localStorage.setItem("userId", session.user.id);
              localStorage.setItem("userEmail", session.user.email || "");
              
              // Redirect based on user profile
              if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
                navigate("/index", { replace: true });
              } else {
                navigate("/dashboard", { replace: true });
              }
            }, 100);
          }
        });
        
        // Store the subscription for cleanup
        authSubscriptionRef.current = data.subscription;
        
        // Get existing session - this should happen just once
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        // Mark the session check as completed to avoid duplicate checks
        sessionCheckCompletedRef.current = true;
        
        if (error) {
          console.error("Error checking session:", error);
          throw error;
        }
        
        // If no session or the user just signed out (check URL), stay on login page
        const justSignedOut = location.state?.signedOut === true;
        
        if (!sessionData.session || justSignedOut) {
          console.log("No session found or user just signed out, staying on login page");
          setIsCheckingSession(false);
          return;
        }
        
        if (isMountedRef.current && sessionData.session) {
          console.log("Existing session found, redirecting...");
          console.log("Session expires at:", 
            sessionData.session.expires_at ? new Date(sessionData.session.expires_at * 1000).toISOString() : "unknown");
          
          // Get user profile from user_metadata
          const userProfile = sessionData.session.user.user_metadata?.role || "Agente";
          
          // Store the user profile in localStorage for compatibility with existing code
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userProfile", userProfile);
          localStorage.setItem("userName", sessionData.session.user.email || "");
          localStorage.setItem("userId", sessionData.session.user.id);
          localStorage.setItem("userEmail", sessionData.session.user.email || "");
          
          // Redirect based on user profile
          setTimeout(() => {
            if (!isMountedRef.current) return;
            
            if (userProfile === "Inspetor" || userProfile === "Subinspetor") {
              navigate("/index", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }, 100);
        } else {
          setIsCheckingSession(false);
        }
      } catch (error) {
        console.error("Session checking failed:", error);
        if (isMountedRef.current) {
          setIsCheckingSession(false);
        }
      }
    };
    
    checkAndRedirect();
    
    return () => {
      isMountedRef.current = false;
      
      // Use the stored subscription for cleanup
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.unsubscribe();
        authSubscriptionRef.current = null;
      }
    };
  }, [navigate, location]);
  
  // Show loading indicator while checking session
  if (isCheckingSession) {
    return (
      <LoginBackground>
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/lovable-uploads/83b69061-6005-432b-8d81-e2ab0d07dc10.png" 
            alt="Sentinela" 
            className="w-[240px] mb-8" 
          />
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-white">Verificando sessão...</p>
          </div>
        </div>
      </LoginBackground>
    );
  }

  return (
    <LoginBackground>
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img 
          src="/lovable-uploads/83b69061-6005-432b-8d81-e2ab0d07dc10.png" 
          alt="Sentinela" 
          className="w-[240px]" 
        />
      </div>
      
      {/* Login Form */}
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Acesso ao Sistema</h1>
        <LoginForm />
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Sentinela. Todos os direitos reservados.
      </div>
    </LoginBackground>
  );
};

export default Login;
