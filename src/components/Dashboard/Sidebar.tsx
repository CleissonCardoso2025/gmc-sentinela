
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CarFront,
  Shield,
  Users,
  FileText,
  AlertTriangle,
  BarChart4,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  active = false,
  collapsed = false,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start gap-4 px-4',
        active
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent hover:text-accent-foreground'
      )}
      asChild
    >
      <Link to={to}>
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen py-4 flex flex-col border-r bg-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="px-4 mb-4 flex justify-between items-center">
        {!collapsed && <h2 className="text-lg font-bold py-1">GCM Admin</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          <SidebarItem
            icon={<Home className="h-5 w-5" />}
            label="Início"
            to="/"
            active={pathname === '/'}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<CarFront className="h-5 w-5" />}
            label="Viaturas"
            to="/viaturas"
            active={pathname === '/viaturas'}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Shield className="h-5 w-5" />}
            label="Inspetoria"
            to="/inspetoria"
            active={pathname === '/inspetoria'}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="Recursos Humanos"
            to="/rh"
            active={pathname === '/rh'}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<FileText className="h-5 w-5" />}
            label="Ocorrências"
            to="/ocorrencias"
            active={pathname === '/ocorrencias'}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Corregedoria"
            to="/corregedoria"
            active={pathname === '/corregedoria'}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            label="Configurações"
            to="/configuracoes"
            active={pathname === '/configuracoes'}
            collapsed={collapsed}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
