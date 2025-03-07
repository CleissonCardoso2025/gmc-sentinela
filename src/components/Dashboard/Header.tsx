import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
interface HeaderProps {
  notifications: number;
}
const Header: React.FC<HeaderProps> = ({
  notifications
}) => {
  return <header className="bg-gcm-600 fixed w-full h-16 z-50 px-6 flex items-center justify-between shadow-md animate-fade-in">
      <div className="flex items-center">
        <Link to="/">
          <img alt="Logo GCM" className="h-10 mr-4 rounded-sm" src="/lovable-uploads/d563df95-6038-43c8-80a6-882d66215f63.png" />
        </Link>
        <h1 className="text-white text-xl font-semibold hidden sm:block">GCM Sentinela</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Input placeholder="Pesquisar..." className="w-64 bg-gcm-700/70 border-none text-white placeholder:text-white/60 focus:ring-gcm-400 focus:ring-opacity-50 pr-10 transition-all duration-300" />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
        </div>
        
        <Button variant="ghost" size="icon" className="relative bg-gcm-700/70 hover:bg-gcm-700 text-white rounded-full h-10 w-10 transition-all duration-300">
          <Bell className="h-5 w-5" />
          {notifications > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
              {notifications}
            </span>}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="bg-gcm-700/70 hover:bg-gcm-700 text-white flex items-center space-x-2 pl-2 pr-3 transition-all duration-300">
              <div className="h-7 w-7 rounded-full bg-white/30 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:inline">Usuário</span>
              <ChevronDown className="h-4 w-4 text-white/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 animate-fade-up" align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
};
export default Header;