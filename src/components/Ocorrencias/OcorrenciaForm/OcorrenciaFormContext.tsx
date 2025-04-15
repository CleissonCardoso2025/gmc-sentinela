import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useGeolocation } from '@/hooks/use-geolocation';
import { MapMarker } from '@/types/maps';
import { useAgentsData } from '@/hooks/use-agents-data';

// ...types unchanged

// (mantemos todos os tipos e interfaces iguais, como no seu original)

const OcorrenciaContext = createContext<OcorrenciaContextType | undefined>(undefined);

export const useOcorrenciaForm = () => {
  const context = useContext(OcorrenciaContext);
  if (!context) {
    throw new Error('useOcorrenciaForm must be used within OcorrenciaFormProvider');
  }
  return context;
};

export const OcorrenciaFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ...todos os useStates e useRefs
  const [numero, setNumero] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BO-${year}${month}${day}-${randomDigits}`;
  });
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('Aberta');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(() => new Date().toTimeString().split(' ')[0].substring(0, 5));
  // ...continuação dos estados

  const { toast } = useToast();
  const { location, loading: locationLoading, error: locationError, refreshPosition } = useGeolocation();
  const { agents: agentsList, isLoading: agentsLoading, error: agentsError } = useAgentsData();

  React.useEffect(() => {
    if (agentsList && agentsList.length > 0) {
      setAgents(agentsList.map(agent => ({
        id: agent.id,
        name: agent.nome,
        role: agent.patente || '',
        nome: agent.nome,
        patente: agent.patente
      })));
    }
  }, [agentsList]);

  const handleGetCurrentLocation = async () => {
    try {
      toast({
        title: "Buscando localização",
        description: "Obtendo sua localização atual...",
      });

      refreshPosition();

      if (location.latitude && location.longitude) {
        setPosition({
          id: 'current-location',
          position: [location.latitude, location.longitude],
          title: 'Localização Atual',
          lat: location.latitude,
          lng: location.longitude,
          address: 'Obtendo endereço...'
        });

        try {
          const { data, error } = await supabase.functions.invoke('geocode', {
            body: {
              address: `${location.latitude},${location.longitude}`,
              reverse: true
            }
          });

          if (error) {
            console.error('Error getting address:', error);
            toast({
              title: "Erro ao obter endereço",
              description: "Suas coordenadas foram salvas, mas não foi possível obter o endereço completo.",
              variant: "destructive"
            });
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            return;
          }

          if (data && data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;
            setLocal(address);
            toast({
              title: "Localização obtida",
              description: "Endereço encontrado com sucesso."
            });
          } else {
            setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
            toast({
              title: "Localização obtida",
              description: "Endereço não identificado, apenas coordenadas.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
          setLocal(`Coordenadas: ${location.latitude}, ${location.longitude}`);
          toast({
            title: "Localização obtida",
            description: "Endereço não identificado, apenas coordenadas.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
        variant: "destructive"
      });
    }
  };

  // ...restante do código original permanece igual

  return (
    <OcorrenciaContext.Provider value={value}>
      {children}
    </OcorrenciaContext.Provider>
  );
};
