
import React from 'react';
import { FileText, Calendar, Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOccurrenceStats } from '@/hooks/use-occurrence-stats';
import { Skeleton } from '@/components/ui/skeleton';

export const QuickStats: React.FC = () => {
  const { stats, isLoading } = useOccurrenceStats();

  const statItems = [
    {
      title: "Ocorrências hoje",
      value: isLoading ? null : stats.todayCount,
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Ocorrências no mês",
      value: isLoading ? null : stats.monthCount,
      icon: <Calendar className="h-5 w-5 text-green-600" />,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Ocorrências recentes",
      value: isLoading ? null : stats.recentCount,
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
