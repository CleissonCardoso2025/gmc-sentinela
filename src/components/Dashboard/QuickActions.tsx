
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, UserCog, Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Nova Ocorrência",
      description: "Registrar uma nova ocorrência no sistema",
      icon: <Plus className="h-5 w-5 text-white" />,
      bgColor: "bg-green-600",
      hoverBgColor: "hover:bg-green-700",
      path: "/ocorrencias?tab=nova",
    },
    {
      title: "Consultar Ocorrências",
      description: "Buscar e filtrar ocorrências registradas",
      icon: <Search className="h-5 w-5 text-white" />,
      bgColor: "bg-blue-600",
      hoverBgColor: "hover:bg-blue-700",
      path: "/ocorrencias?tab=lista",
    },
    {
      title: "Meus Dados",
      description: "Visualizar e editar informações de perfil",
      icon: <UserCog className="h-5 w-5 text-white" />,
      bgColor: "bg-purple-600",
      hoverBgColor: "hover:bg-purple-700",
      path: "/perfil",
    },
  ];

  return (
    <Card className="shadow-md animate-fade-up" style={{ animationDelay: '200ms' }}>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gcm-700">
          <FileText className="h-5 w-5 mr-2 text-gcm-600" />
          Ações Rápidas
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link 
              key={index} 
              to={action.path}
              className={cn(
                "rounded-lg p-4 text-white transition-all duration-300",
                "transform hover:scale-105 hover:shadow-lg",
                action.bgColor,
                action.hoverBgColor,
                "animate-fade-up"
              )}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-3">
                  <div className="rounded-full bg-white/20 p-2 mr-3">
                    {action.icon}
                  </div>
                  <h3 className="font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
