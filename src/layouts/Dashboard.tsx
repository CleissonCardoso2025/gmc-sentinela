
import React, { ReactNode, useState } from 'react';
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/Dashboard/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import AccessControlDialog from "@/components/Configuracoes/AccessControlDialog";
import { useAuthorization } from "@/hooks/use-authorization";
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const isMobile = useIsMobile();
  
  // Get the user profile from localStorage
  const userProfile = localStorage.getItem('userProfile') || 'Inspetor';
  const { pageAccessSettings, updatePageAccess, isLoading: isLoadingAccess } = useAuthorization(userProfile);

  const handleOpenAccessControl = () => {
    // Only allow Inspetores to access the control panel
    if (userProfile !== 'Inspetor') {
      toast.error('Apenas Inspetores podem gerenciar permissões de acesso');
      return;
    }
    setShowAccessDialog(true);
  };

  const handleSavePageAccess = async (pages: typeof pageAccessSettings): Promise<void> => {
    try {
      const success = updatePageAccess(pages);
      if (success) {
        setShowAccessDialog(false);
        toast.success('Permissões de acesso atualizadas com sucesso');
      } else {
        toast.error('Erro ao atualizar permissões de acesso');
      }
    } catch (error) {
      console.error('Error saving page access:', error);
      toast.error('Erro ao salvar permissões de acesso');
    }
    return Promise.resolve();
  };

  // Only show the access control button for Inspetores
  const showAccessButton = userProfile === 'Inspetor';

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
            {showAccessButton && (
              <div className="flex justify-end mb-4">
                <Button onClick={handleOpenAccessControl} variant="outline" className="gap-1">
                  <Shield className="h-4 w-4" />
                  Controle de Acesso
                </Button>
              </div>
            )}
            {children}
          </main>
          <Footer />
        </div>
      </div>
      
      {/* Access Control Dialog */}
      <AccessControlDialog
        isOpen={showAccessDialog}
        onOpenChange={setShowAccessDialog}
        pageAccessSettings={pageAccessSettings}
        isLoading={isLoadingAccess}
        onSave={handleSavePageAccess}
      />
    </div>
  );
};

export default DashboardLayout;
