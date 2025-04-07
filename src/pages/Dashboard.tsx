
import React from 'react';
import DashboardLayout from '@/layouts/Dashboard';
import { WelcomeHeader } from '@/components/Dashboard/WelcomeHeader';
import { QuickStats } from '@/components/Dashboard/QuickStats';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { AlertBoard } from '@/components/Dashboard/AlertBoard';
import { RecentOccurrences } from '@/components/Dashboard/RecentOccurrences';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        <WelcomeHeader userName="Carlos Silva" role="Guarda Civil Municipal" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <QuickStats />
            <QuickActions />
            <RecentOccurrences />
          </div>
          
          <div className="md:col-span-1">
            <AlertBoard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
