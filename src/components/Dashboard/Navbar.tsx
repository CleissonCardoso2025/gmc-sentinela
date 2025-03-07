
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Users, 
  AlertTriangle, 
  Settings,
  Shield,
  UserCog,
  GavelIcon,
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { icon: <Car className="h-5 w-5" />, text: 'Viaturas', path: '/viaturas' },
    { icon: <AlertTriangle className="h-5 w-5" />, text: 'Ocorrências', path: '/ocorrencias' },
    { icon: <GavelIcon className="h-5 w-5" />, text: 'Corregedoria', path: '/corregedoria' },
    { icon: <UserCog className="h-5 w-5" />, text: 'Recursos Humanos', path: '/rh' },
    { icon: <Shield className="h-5 w-5" />, text: 'Inspetoria Geral', path: '/inspetoria' },
    { icon: <Settings className="h-5 w-5" />, text: 'Configurações', path: '/configuracoes' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-16 left-0 right-0 bg-gcm-600 shadow-md z-30 animate-fade-in">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center">
        <ul className="flex">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center justify-center text-white hover:bg-gcm-700 border-none rounded-none h-16 px-6 transition-all duration-300",
                  isActive(item.path) ? "bg-gcm-700 border-b-2 border-white" : "bg-opacity-0"
                )}
                asChild
              >
                <Link to={item.path}>
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{item.text}</span>
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-end p-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-gcm-700"
            >
              <Menu className="h-6 w-6" />
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
      </div>
    </nav>
  );
};

export default Navbar;
