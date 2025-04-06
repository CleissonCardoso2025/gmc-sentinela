
import React, { useState } from 'react';
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import Footer from "@/components/Dashboard/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [notifications, setNotifications] = React.useState(3);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header notifications={notifications} />
      <div className="flex flex-1 pt-16">
        {!isMobile && (
          <Sidebar />
        )}
        <div className={`flex-1 transition-all duration-300 ${!isMobile && !sidebarCollapsed ? 'ml-64' : !isMobile && sidebarCollapsed ? 'ml-20' : ''}`}>
          <main className="flex-grow pt-8 pb-12 sm:pb-16 px-4 sm:px-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
