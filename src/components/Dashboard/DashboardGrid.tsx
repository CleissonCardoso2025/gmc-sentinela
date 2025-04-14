
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PatrolRouteCard } from './PatrolRouteCard';
import { WorkScheduleCard } from './WorkScheduleCard';
import RecentOccurrences from './RecentOccurrences';
import VehicleList from './VehicleList';

interface PatrolRouteLocation {
  id: number;
  name: string;
  time: string;
  status: string;
}

interface PatrolRouteData {
  name: string;
  locations: PatrolRouteLocation[];
  startTime: string;
  endTime: string;
  date: string;
}

interface WorkScheduleItem {
  id: number;
  date: string;
  dayOfWeek: string;
  shift: string;
  startTime: string;
  endTime: string;
  role: string;
}

interface DashboardGridProps {
  patrolRouteData: PatrolRouteData | null;
  workScheduleData: WorkScheduleItem[] | null;
  userName: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  patrolRouteData,
  workScheduleData,
  userName
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {!patrolRouteData ? (
          <Card className="p-5">
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ) : (
          <PatrolRouteCard patrolRouteData={patrolRouteData} />
        )}
        
        <RecentOccurrences />
      </div>
      
      <div className="space-y-6">
        {!workScheduleData ? (
          <Card className="p-5">
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </Card>
        ) : (
          <WorkScheduleCard workScheduleData={workScheduleData} userName={userName} />
        )}
        
        <VehicleList vehicles={[]} />
      </div>
    </div>
  );
};
