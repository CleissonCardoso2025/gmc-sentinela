
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, className }) => {
  return (
    <Card className={cn(
      "p-5 transition-all duration-300 ease-in-out hover:shadow-lg overflow-hidden relative group",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className={cn("text-2xl font-bold", color)}>{value}</h3>
        </div>
        <div className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out",
          `bg-${color.split('-')[1]}-100`,
          "group-hover:scale-110"
        )}>
          {icon}
        </div>
      </div>
      
      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ease-out",
        color.replace('text', 'bg')
      )}></div>
    </Card>
  );
};

export default StatCard;
