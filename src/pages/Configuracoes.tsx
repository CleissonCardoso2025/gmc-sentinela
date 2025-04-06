
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/layouts/Dashboard";

const ConfiguracoesPage: React.FC = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');
  const { toast } = useToast();

  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('googleMapsApiKey');
    if (savedApiKey) {
      setGoogleMapsApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    // Save API key to localStorage
    localStorage.setItem('googleMapsApiKey', googleMapsApiKey);
    
    // Show success toast
    toast({
      title: "Configuração salva",
      description: "A chave da API do Google Maps foi salva com sucesso.",
    });
  };

  return (
    <Dashboard>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Integrações</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="google-maps-api-key">Chave da API do Google Maps</Label>
              <div className="flex gap-2">
                <Input
                  id="google-maps-api-key"
                  type="text"
                  value={googleMapsApiKey}
                  onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                  placeholder="Insira sua chave da API do Google Maps"
                  className="flex-1"
                />
                <Button onClick={handleSaveApiKey}>Salvar</Button>
              </div>
              <p className="text-sm text-gray-500">
                Essa chave é necessária para o funcionamento dos mapas. 
                Você pode obtê-la no <a href="https://console.cloud.google.com/google/maps-apis/overview" 
                className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  Console do Google Cloud Platform
                </a>.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Dashboard>
  );
};

export default ConfiguracoesPage;
