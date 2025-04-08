import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  AlertTriangle, 
  Settings,
  Shield,
  GavelIcon,
  Menu,
  Home
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <Home className="h-5 w-5" />, text: 'Dashboard', path: '/' },
    { icon: <Car className="h-5 w-5" />, text: 'Viaturas', path: '/viaturas' },
    { icon: <AlertTriangle className="h-5 w-5" />, text: 'Ocorrências', path: '/ocorrencias' },
    { icon: <GavelIcon className="h-5 w-5" />, text: 'Corregedoria', path: '/corregedoria' },
    { icon: <Shield className="h-5 w-5" />, text: 'Inspetoria Geral', path: '/inspetoria' },
    { icon: <Settings className="h-5 w-5" />, text: 'Configurações', path: '/configuracoes' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-16 left-0 right-0 bg-gcm-600 shadow-md z-30 animate-fade-in h-16 flex items-center px-4 justify-between">
      <div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar">
        {menuItems.slice(0, 4).map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center justify-center text-white hover:bg-gcm-700 border-none",
              isActive(item.path) ? "bg-gcm-700" : "bg-opacity-0"
            )}
            asChild
          >
            <Link to={item.path} className="whitespace-nowrap">
              <span className="flex items-center">
                {item.icon}
                <span className="ml-1 text-xs font-medium">{item.text}</span>
              </span>
            </Link>
          </Button>
        ))}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-gcm-700 ml-auto"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-gcm-600 text-white border-l border-gcm-700 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h2 className="text-xl font-bold">Menu</h2>
            </div>
            <ul className="flex-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full flex items-center justify-start text-white hover:bg-gcm-700 border-none rounded-none h-14 px-4 transition-all duration-300",
                      isActive(item.path) ? "bg-gcm-700" : "bg-opacity-0"
                    )}
                    asChild
                  >
                    <Link to={item.path}>
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.text}</span>
                      </span>
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
