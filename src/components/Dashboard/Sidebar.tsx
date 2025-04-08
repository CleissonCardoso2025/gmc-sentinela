import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Car, AlertTriangle, Settings, Shield, UserCog, ChevronLeft, ChevronRight, GavelIcon, Home } from "lucide-react";
interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed
}) => {
  const location = useLocation();
  const menuItems = [{
    icon: <Home className="h-5 w-5" />,
    text: 'Dashboard',
    path: '/'
  }, {
    icon: <Car className="h-5 w-5" />,
    text: 'Viaturas',
    path: '/viaturas'
  }, {
    icon: <AlertTriangle className="h-5 w-5" />,
    text: 'Ocorrências',
    path: '/ocorrencias'
  }, {
    icon: <GavelIcon className="h-5 w-5" />,
    text: 'Corregedoria',
    path: '/corregedoria'
  }, {
    icon: <Shield className="h-5 w-5" />,
    text: 'Inspetoria Geral',
    path: '/inspetoria'
  }, {
    icon: <Settings className="h-5 w-5" />,
    text: 'Configurações',
    path: '/configuracoes'
  }];
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  return <aside className={cn("fixed h-full bg-gcm-600 transition-all duration-300 ease-in-out z-40", collapsed ? "w-20" : "w-64")}>
      <div className="h-16 bg-zinc-950">
        {/* Spacer for the header */}
      </div>
      
      <div className="relative h-[calc(100%-4rem)]">
        <Button variant="ghost" size="icon" className="absolute -right-3 top-3 bg-white shadow-md rounded-full h-6 w-6 p-0 flex items-center justify-center z-50" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-3 w-3 text-gcm-600" /> : <ChevronLeft className="h-3 w-3 text-gcm-600" />}
        </Button>
        
        <div className="p-4 overflow-y-auto h-full bg-zinc-950">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => <Button key={index} variant="ghost" className={cn("flex items-center justify-start text-white hover:bg-gcm-700 border-none transition-all duration-300", collapsed ? "px-3" : "px-4", isActive(item.path) ? "bg-gcm-700" : "bg-opacity-0")} asChild>
                <Link to={item.path}>
                  <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                    {item.icon}
                    {!collapsed && <span className="ml-3 font-medium">{item.text}</span>}
                  </span>
                </Link>
              </Button>)}
          </nav>
        </div>
      </div>
    </aside>;
};
export default Sidebar;