
import React, { useState } from 'react';
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import Footer from "@/components/Dashboard/Footer";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Add a default notification count
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header notifications={notifications} />
      <div className="flex flex-grow">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main 
          className={`flex-grow transition-all duration-300 ease-in-out pt-16 pb-16 ${
            sidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
