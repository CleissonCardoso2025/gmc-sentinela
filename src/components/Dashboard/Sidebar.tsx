
import React from 'react';
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
  Settings
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  active = false,
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
        <span>{label}</span>
      </Link>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="h-screen py-4 flex flex-col border-r">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold px-4 py-1">GCM Admin</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          <SidebarItem
            icon={<Home className="h-5 w-5" />}
            label="Início"
            to="/"
            active={pathname === '/'}
          />
          <SidebarItem
            icon={<CarFront className="h-5 w-5" />}
            label="Viaturas"
            to="/viaturas"
            active={pathname === '/viaturas'}
          />
          <SidebarItem
            icon={<Shield className="h-5 w-5" />}
            label="Inspetoria"
            to="/inspetoria"
            active={pathname === '/inspetoria'}
          />
          <SidebarItem
            icon={<Users className="h-5 w-5" />}
            label="Recursos Humanos"
            to="/rh"
            active={pathname === '/rh'}
          />
          <SidebarItem
            icon={<FileText className="h-5 w-5" />}
            label="Ocorrências"
            to="/ocorrencias"
            active={pathname === '/ocorrencias'}
          />
          <SidebarItem
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Corregedoria"
            to="/corregedoria"
            active={pathname === '/corregedoria'}
          />
          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            label="Configurações"
            to="/configuracoes"
            active={pathname === '/configuracoes'}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
