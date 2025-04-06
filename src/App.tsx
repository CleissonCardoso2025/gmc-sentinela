
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Viaturas from "./pages/Viaturas";
import Inspetoria from "./pages/Inspetoria";
import RecursosHumanos from "./pages/RecursosHumanos";
import Ocorrencias from "./pages/Ocorrencias";
import Corregedoria from "./pages/Corregedoria";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/viaturas" element={<Viaturas />} />
          <Route path="/inspetoria" element={<Inspetoria />} />
          <Route path="/rh" element={<RecursosHumanos />} />
          <Route path="/ocorrencias" element={<Ocorrencias />} />
          <Route path="/corregedoria" element={<Corregedoria />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
