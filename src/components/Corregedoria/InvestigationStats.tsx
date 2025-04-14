
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useInvestigationStats } from '@/hooks/use-investigation-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, CheckCircle, Archive, AlertTriangle } from 'lucide-react';

export const InvestigationStats: React.FC = () => {
  const { stats, isLoading } = useInvestigationStats();

  const statItems = [
    {
      title: "Total de Sindicâncias",
      value: isLoading ? null : stats.totalCount,
      icon: <ClipboardList className="h-5 w-5 text-blue-600" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Em Andamento",
      value: isLoading ? null : stats.openCount,
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      bgColor: "bg-amber-100",
      textColor: "text-amber-600"
    },
    {
      title: "Concluídas",
      value: isLoading ? null : stats.closedCount,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Arquivadas",
      value: isLoading ? null : stats.archivedCount,
      icon: <Archive className="h-5 w-5 text-gray-600" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card 
          key={index}
          className={cn(
            "p-4 overflow-hidden relative group transition-all duration-300 hover:shadow-md",
            "animate-fade-up"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{item.title}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className={cn("text-2xl font-bold", item.textColor)}>
                  {item.value}
                </p>
              )}
            </div>
            <div className={cn("rounded-full p-3", item.bgColor)}>
              {item.icon}
            </div>
          </div>
          <div className={cn(
            "absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ease-out",
            item.textColor.replace('text', 'bg')
          )}></div>
        </Card>
      ))}
    </div>
  );
};
