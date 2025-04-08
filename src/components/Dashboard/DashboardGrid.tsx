
import React from 'react';
import { PatrolRouteCard } from './PatrolRouteCard';
import { WorkScheduleCard } from './WorkScheduleCard';
import { RecentOccurrences } from './RecentOccurrences';

interface PatrolLocation {
  id: number;
  name: string;
  time: string;
  status: string;
}

interface PatrolRouteData {
  name: string;
  locations: PatrolLocation[];
  startTime: string;
  endTime: string;
  date: string;
}

interface WorkScheduleDay {
  id: number;
  date: string;
  dayOfWeek: string;
  shift: string;
  startTime: string;
  endTime: string;
  role: string;
}

interface DashboardGridProps {
  patrolRouteData: PatrolRouteData;
  workScheduleData: WorkScheduleDay[];
  userName: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ 
  patrolRouteData, 
  workScheduleData,
  userName
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <PatrolRouteCard patrolRouteData={patrolRouteData} />
        <RecentOccurrences />
      </div>
      
      <div className="md:col-span-1 space-y-6">
        <WorkScheduleCard workScheduleData={workScheduleData} userName={userName} />
      </div>
    </div>
  );
};
