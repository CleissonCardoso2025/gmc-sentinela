
import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { initInstallPrompt, triggerInstallPrompt, hasBeenPrompted } from "@/utils/pwa-install";

export const InstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    // Skip banner if it was already shown before
    if (hasBeenPrompted()) {
      return;
    }

    // Initialize the install prompt listener
    const cleanup = initInstallPrompt(setShowBanner);
    
    // Cleanup on component unmount
    return cleanup;
  }, []);

  const handleInstallClick = async () => {
    const outcome = await triggerInstallPrompt();
    console.log(`Installation ${outcome}`);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    // Mark as prompted in localStorage
    localStorage.setItem('pwaPromptShown', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-up animate-once">
      <Card className="bg-[#1A1F2C] border border-[#6E59A5] shadow-lg mx-auto max-w-md">
        <div className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0 bg-[#7E69AB] rounded-full p-2">
            <Download className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-grow">
            <h3 className="font-bold text-white">Instalar o Sentinela</h3>
            <p className="text-sm text-gray-300">
              Adicione à tela inicial para acesso rápido e modo offline
            </p>
          </div>
          
          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="text-gray-300 hover:text-white"
            >
              Depois
            </Button>
            <Button 
              onClick={handleInstallClick}
              className="bg-[#9b87f5] hover:bg-[#6E59A5] text-white"
              size="sm"
            >
              Instalar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstallBanner;
