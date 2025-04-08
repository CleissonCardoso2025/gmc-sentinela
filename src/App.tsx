
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import OccurrenceDetails from "./pages/OccurrenceDetails";
import Viaturas from "./pages/Viaturas";
import Inspetoria from "./pages/Inspetoria";
import Ocorrencias from "./pages/Ocorrencias";
import Corregedoria from "./pages/Corregedoria";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [userProfile, setUserProfile] = useState<string>("Inspetor"); // Default profile

  // Get user profile from localStorage on app load
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(storedProfile);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/index" element={
              <ProtectedRoute userProfile={userProfile}>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute userProfile={userProfile}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute userProfile={userProfile}>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/viaturas" element={
              <ProtectedRoute userProfile={userProfile}>
                <Viaturas />
              </ProtectedRoute>
            } />
            <Route path="/inspetoria" element={
              <ProtectedRoute userProfile={userProfile}>
                <Inspetoria />
              </ProtectedRoute>
            } />
            <Route path="/ocorrencias" element={
              <ProtectedRoute userProfile={userProfile}>
                <Ocorrencias />
              </ProtectedRoute>
            } />
            <Route path="/ocorrencias/:id" element={
              <ProtectedRoute userProfile={userProfile}>
                <OccurrenceDetails />
              </ProtectedRoute>
            } />
            <Route path="/corregedoria" element={
              <ProtectedRoute userProfile={userProfile}>
                <Corregedoria />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute userProfile={userProfile}>
                <Configuracoes />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
