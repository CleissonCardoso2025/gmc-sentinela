
import React, { ReactNode } from 'react';
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/Dashboard/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header notifications={3} />
      {isMobile && <Navbar />}
      <div className="flex flex-1 pt-16">
        {!isMobile && (
          <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        )}
        <div className={`flex-1 transition-all duration-300 ${!isMobile && !sidebarCollapsed ? 'ml-64' : !isMobile && sidebarCollapsed ? 'ml-20' : ''} ${isMobile ? 'pt-16' : ''}`}>
          <main className="flex-grow pt-8 pb-12 sm:pb-16 px-4 sm:px-6">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
