
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { VehicleProvider } from "./contexts/VehicleContext";

// Import all page components
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Viaturas from "./pages/Viaturas";
import Inspetoria from "./pages/Inspetoria";
import Ocorrencias from "./pages/Ocorrencias";
import OccurrenceDetails from "./pages/OccurrenceDetails";
import Corregedoria from "./pages/Corregedoria";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.code === 'PGRST301') {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  const [userProfile, setUserProfile] = useState<string>("Agente");

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(storedProfile);
    }
  }, []);

  console.log("App component rendering, userProfile:", userProfile);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
                <VehicleProvider>
                  <Viaturas />
                </VehicleProvider>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
