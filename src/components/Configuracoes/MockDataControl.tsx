
import React, { useState, useEffect } from 'react';
import { getServiceConfig, setServiceConfig } from '@/services/api/serviceConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Services we want to configure
const servicesToConfigure = [
  { id: 'user', name: 'Usuários' },
  { id: 'escala', name: 'Escalas' },
  { id: 'auth', name: 'Autenticação' },
  { id: 'permissions', name: 'Permissões' },
  { id: 'ocorrencias', name: 'Ocorrências' },
  { id: 'investigacoes', name: 'Investigações' },
];

const MockDataControl: React.FC = () => {
  const [serviceConfigs, setServiceConfigs] = useState<{[key: string]: boolean}>({});
  
  // Initialize service configs
  useEffect(() => {
    const configs: {[key: string]: boolean} = {};
    servicesToConfigure.forEach(service => {
      // Initialize if not yet configured
      try {
        configs[service.id] = getServiceConfig(service.id).useMocks;
      } catch (error) {
        configs[service.id] = true; // Default to mocks if not configured
        setServiceConfig(service.id, { useMocks: true });
      }
    });
    setServiceConfigs(configs);
  }, []);

  const handleToggleService = (serviceId: string) => {
    const newValue = !serviceConfigs[serviceId];
    setServiceConfig(serviceId, { useMocks: newValue });
    
    setServiceConfigs(prev => ({
      ...prev,
      [serviceId]: newValue
    }));
    
    // In a real app, you would trigger a refresh of the relevant data
    // This might require importing and resetting specific services
    toast.success(`${newValue ? 'Ativado' : 'Desativado'} dados mockados para ${servicesToConfigure.find(s => s.id === serviceId)?.name}`);
  };

  const setAllServices = (useMocks: boolean) => {
    const newConfigs: {[key: string]: boolean} = {};
    
    servicesToConfigure.forEach(service => {
      setServiceConfig(service.id, { useMocks });
      newConfigs[service.id] = useMocks;
    });
    
    setServiceConfigs(newConfigs);
    toast.success(`${useMocks ? 'Ativado' : 'Desativado'} dados mockados para todos os serviços`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle de Dados Mockados</CardTitle>
        <CardDescription>
          Configure quais serviços devem utilizar dados reais ou mockados durante o desenvolvimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setAllServices(true)}
            >
              Ativar Todos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAllServices(false)}
            >
              Desativar Todos
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            {servicesToConfigure.map((service) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{service.name}</span>
                    {serviceConfigs[service.id] ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Mockado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Real
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {serviceConfigs[service.id] 
                      ? "Usando dados mockados para desenvolvimento" 
                      : "Usando dados reais da API"}
                  </p>
                </div>
                <Switch
                  checked={serviceConfigs[service.id] || false}
                  onCheckedChange={() => handleToggleService(service.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockDataControl;
