
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/Dashboard';
import { WelcomeHeader } from '@/components/Dashboard/WelcomeHeader';
import { QuickStats } from '@/components/Dashboard/QuickStats';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { AlertBoard } from '@/components/Dashboard/AlertBoard';
import { DashboardGrid } from '@/components/Dashboard/DashboardGrid';

const Dashboard = () => {
  const [userName, setUserName] = useState<string>("Carlos Silva");
  const [userRole, setUserRole] = useState<string>("Guarda Civil Municipal");
  
  useEffect(() => {
    // Get user info from localStorage
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");
    
    if (storedUserName) {
      setUserName(storedUserName);
      // Save for other components
      localStorage.setItem("userName", storedUserName);
    }
    
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  // Mock data for patrol route
  const patrolRouteData = {
    name: "Rota Central - Setor 2",
    locations: [
      { id: 1, name: "Praça da República", time: "09:00", status: "Completo" },
      { id: 2, name: "Mercado Municipal", time: "10:30", status: "Completo" },
      { id: 3, name: "Escola Municipal João Silva", time: "12:00", status: "Pendente" },
      { id: 4, name: "Terminal Rodoviário", time: "14:30", status: "Pendente" },
      { id: 5, name: "Parque Central", time: "16:00", status: "Pendente" }
    ],
    startTime: "08:00",
    endTime: "17:00",
    date: "08/04/2025"
  };

  // Mock data for work schedule
  const workScheduleData = [
    { id: 1, date: "08/04/2025", dayOfWeek: "Segunda", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 2, date: "09/04/2025", dayOfWeek: "Terça", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 3, date: "10/04/2025", dayOfWeek: "Quarta", shift: "Folga", startTime: "-", endTime: "-", role: "-" },
    { id: 4, date: "11/04/2025", dayOfWeek: "Quinta", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" },
    { id: 5, date: "12/04/2025", dayOfWeek: "Sexta", shift: "Diurno", startTime: "08:00", endTime: "20:00", role: "Patrulhamento" }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        <WelcomeHeader userName={userName} role={userRole} />
        
        {/* First section - Stats and Quick Actions */}
        <div className="space-y-6">
          <QuickStats />
          <QuickActions />
        </div>
        
        {/* Alert Board - Now horizontal and below first section */}
        <div className="w-full">
          <AlertBoard maxDisplayedAlerts={3} />
        </div>
        
        <DashboardGrid 
          patrolRouteData={patrolRouteData} 
          workScheduleData={workScheduleData}
          userName={userName}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
