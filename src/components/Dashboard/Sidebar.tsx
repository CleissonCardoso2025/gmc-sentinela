import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Car, AlertTriangle, Settings, Shield, UserCog, ChevronLeft, ChevronRight, GavelIcon, Home, Command, FileText } from "lucide-react";
import { useAuthorization } from '@/hooks/use-authorization';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  path: string;
  roles?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userProfile = localStorage.getItem('userProfile') || '';
  const isInspetor = userProfile === 'Inspetor';
  const { hasAccessToPage, pageAccessSettings } = useAuthorization(userProfile);
  
  // Log to see what page access settings are available
  console.log("Sidebar pageAccessSettings:", pageAccessSettings);
  
  // Verificar os perfis de usuário
  const isAgente = userProfile === 'Agente';
  const isCorregedor = userProfile === 'Corregedor';
  
  // Menu com restrições baseadas no perfil
  const menuItems = [
    // Dashboard - visível para todos exceto Agentes e Corregedores
    ...(!isAgente && !isCorregedor ? [{ path: '/index', icon: <Home className="h-5 w-5" />, label: 'Dashboard' }] : []),
    
    // Ocorrências - visível para todos
    { path: '/ocorrencias', icon: <FileText className="h-5 w-5" />, label: 'Ocorrências' },
    
    // Perfil - visível para todos
    { path: '/perfil', icon: <UserCog className="h-5 w-5" />, label: 'Perfil' },
    
    // Corregedoria - visível para Inspetores e Corregedores
    ...(isInspetor || isCorregedor ? [{ path: '/corregedoria', icon: <GavelIcon className="h-5 w-5" />, label: 'Corregedoria' }] : []),
    
    // Itens visíveis para todos exceto Agentes e Corregedores
    ...(!isAgente && !isCorregedor ? [
      { path: '/viaturas', icon: <Car className="h-5 w-5" />, label: 'Viaturas' },
      { path: '/configuracoes', icon: <Settings className="h-5 w-5" />, label: 'Configurações' }
    ] : []),
    
    // Inspetoria - visível apenas para Inspetores
    ...(isInspetor ? [{ path: '/inspetoria', icon: <Shield className="h-5 w-5" />, label: 'Inspetoria' }] : [])
  ];
  
  const isActive = (path: string) => {
    if (path === '/index' && (location.pathname === '/index' || location.pathname === '/')) return true;
    return location.pathname.startsWith(path);
  };
  
  const handleNavigate = (path: string) => {
    console.log("Navegando para:", path);
    navigate(path);
  };

  return (
    <aside className={cn("fixed h-full bg-gcm-600 transition-all duration-300 ease-in-out z-40", collapsed ? "w-20" : "w-64")}>
      <div className="h-16 bg-zinc-950">
        {/* Spacer for the header */}
      </div>
      
      <div className="relative h-[calc(100%-4rem)]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -right-3 top-3 bg-white shadow-md rounded-full h-6 w-6 p-0 flex items-center justify-center z-50" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 
            <ChevronRight className="h-3 w-3 text-gcm-600" /> : 
            <ChevronLeft className="h-3 w-3 text-gcm-600" />
          }
        </Button>
        
        <div className="p-4 overflow-y-auto h-full bg-zinc-950">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                className={cn(
                  "flex items-center justify-start text-white hover:bg-gcm-700 border-none transition-all duration-300", 
                  collapsed ? "px-3" : "px-4", 
                  isActive(item.path) ? "bg-gcm-700" : "bg-opacity-0"
                )}
                onClick={() => handleNavigate(item.path)}
              >
                <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                  {item.icon}
                  {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
                </span>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
