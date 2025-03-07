
import React from 'react';
import Header from "@/components/Dashboard/Header";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/Dashboard/Footer";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  // Remove sidebar state since we're switching to navbar
  const [notifications, setNotifications] = React.useState(3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header notifications={notifications} />
      <Navbar />
      <main className="flex-grow pt-32 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
