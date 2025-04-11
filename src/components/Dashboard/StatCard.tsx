
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  className?: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  className,
  isLoading = false
}) => {
  return (
    <Card className={cn(
      "p-5 border border-gray-200 hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className={cn("text-2xl font-bold mt-1", color)}>{value}</p>
          )}
        </div>
        <div className="bg-gray-100 rounded-full p-3">{icon}</div>
      </div>
    </Card>
  );
};

export default StatCard;
