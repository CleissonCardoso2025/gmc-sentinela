
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Users, 
  AlertTriangle, 
  Settings,
  Wrench,
  Shield,
  UserCog,
  ChevronLeft,
  ChevronRight,
  GavelIcon
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const menuItems = [
    { icon: <Car className="h-5 w-5" />, text: 'Viaturas' },
    { icon: <Wrench className="h-5 w-5" />, text: 'Manutenção' },
    { icon: <Users className="h-5 w-5" />, text: 'Efetivo' },
    { icon: <AlertTriangle className="h-5 w-5" />, text: 'Ocorrências' },
    { icon: <GavelIcon className="h-5 w-5" />, text: 'Corregedoria' },
    { icon: <UserCog className="h-5 w-5" />, text: 'Recursos Humanos' },
    { icon: <Shield className="h-5 w-5" />, text: 'Inspetoria Geral' },
    { icon: <Settings className="h-5 w-5" />, text: 'Configurações' },
  ];

  return (
    <aside className={cn(
      "fixed h-full bg-gcm-600 transition-all duration-300 ease-in-out z-40",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="h-16">
        {/* Spacer for the header */}
      </div>
      
      <div className="relative h-[calc(100%-4rem)]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-3 bg-white shadow-md rounded-full h-6 w-6 p-0 flex items-center justify-center z-50"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-gcm-600" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-gcm-600" />
          )}
        </Button>
        
        <div className="p-4 overflow-y-auto h-full">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "flex items-center justify-start text-white bg-opacity-0 hover:bg-gcm-700 border-none transition-all duration-300",
                  collapsed ? "px-3" : "px-4"
                )}
              >
                <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                  {item.icon}
                  {!collapsed && <span className="ml-3 font-medium">{item.text}</span>}
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
