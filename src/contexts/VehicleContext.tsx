
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin-auth';

export interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  tipo: string;
  status: string;
  quilometragem: number;
  ultimaManutencao: string;
  proximaManutencao: string;
  observacoes: string;
}

export interface Maintenance {
  id: number;
  veiculoId: number;
  data: string;
  tipo: string;
  quilometragem: number;
  custo: number;
  status: string;
  observacoes: string;
  descricao: string;
  previsaoTermino?: string;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  maintenances: Maintenance[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string | null;
  saveDisabled: boolean;
  fetchVehicles: () => Promise<void>;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: string | null) => void;
  handleSaveVehicle: (vehicle: Vehicle) => Promise<void>;
  handleSaveMaintenance: (maintenance: Maintenance) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};

interface VehicleProviderProps {
  children: ReactNode;
}

export const VehicleProvider: React.FC<VehicleProviderProps> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    isLoading: authLoading, 
    userId, 
    userRole, 
    session,
    refreshSession 
  } = useAdminAuth();

  useEffect(() => {
    if (!authLoading) {
      fetchVehicles();
    }
  }, [authLoading, isAuthenticated, userId]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    
    try {
      console.log("Buscando veículos...");
      
      // Check if we have a session before making requests to protected endpoints
      if (!isAuthenticated) {
        console.log("User not authenticated. Will fetch public data only.");
      }
      
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*');
        
      if (vehiclesError) {
        console.error("Erro ao buscar veículos:", vehiclesError);
        throw vehiclesError;
      }
      
      console.log("Veículos recuperados:", vehiclesData);
      
      const transformedVehicles = vehiclesData?.map(vehicle => ({
        id: vehicle.id,
        placa: vehicle.placa,
        modelo: vehicle.modelo,
        marca: vehicle.marca,
        ano: vehicle.ano || '',
        tipo: vehicle.tipo || '',
        status: vehicle.status || 'Disponível',
        quilometragem: vehicle.quilometragem || 0,
        ultimaManutencao: vehicle.ultimamanutencao ? new Date(vehicle.ultimamanutencao).toISOString().split('T')[0] : '',
        proximaManutencao: vehicle.proximamanutencao ? new Date(vehicle.proximamanutencao).toISOString().split('T')[0] : '',
        observacoes: vehicle.observacoes || ''
      })) || [];
      
      setVehicles(transformedVehicles);
      
    } catch (error: any) {
      console.error("Error fetching vehicle data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações das viaturas.",
        variant: "destructive"
      });
      
      setVehicles([]);
      setMaintenances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVehicle = async (vehicle: Vehicle) => {
    try {
      console.log("Iniciando processo de salvamento de veículo:", vehicle);
      setSaveDisabled(true);
      
      // First, refresh the session to ensure we have the latest auth state
      // This is useful if the user has been idle for a while
      let currentSession = session;
      
      if (!currentSession) {
        console.log("No active session, attempting to refresh...");
        currentSession = await refreshSession();
      } else if (currentSession.expires_at && currentSession.expires_at * 1000 < Date.now() + 60000) {
        // If session expires in less than a minute, refresh it proactively
        console.log("Session about to expire, refreshing...");
        currentSession = await refreshSession();
      }
      
      if (!currentSession || !currentSession.user) {
        console.log("No valid session after refresh attempt. Cannot save data.");
        toast({
          title: "Não autenticado",
          description: "Sua sessão expirou. Por favor, faça login novamente.",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      console.log("Valid session confirmed, proceeding with save operation", {
        userId: currentSession.user.id,
        userMetadata: currentSession.user.user_metadata,
        role: currentSession.user.user_metadata?.role,
        expiresAt: currentSession.expires_at ? new Date(currentSession.expires_at * 1000).toISOString() : null
      });
      
      // Check if the user has the necessary permissions
      const userRole = currentSession.user.user_metadata?.role;
      if (userRole !== 'admin' && userRole !== 'Inspetor' && userRole !== 'Subinspetor') {
        console.log("User doesn't have permission to save vehicles");
        toast({
          title: "Permissão negada",
          description: "Você não tem permissão para salvar dados de viaturas.",
          variant: "destructive"
        });
        return;
      }
      
      if (!vehicle.id) {
        const vehicleData = {
          placa: vehicle.placa,
          modelo: vehicle.modelo,
          marca: vehicle.marca,
          ano: vehicle.ano,
          tipo: vehicle.tipo,
          status: vehicle.status,
          quilometragem: vehicle.quilometragem,
          ultimamanutencao: vehicle.ultimaManutencao ? new Date(vehicle.ultimaManutencao).toISOString() : null,
          proximamanutencao: vehicle.proximaManutencao ? new Date(vehicle.proximaManutencao).toISOString() : null,
          observacoes: vehicle.observacoes,
          user_id: currentSession.user.id
        };
        
        const { data, error } = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select();
          
        if (error) {
          console.error("Erro ao inserir veículo:", error);
          throw error;
        }
        
        console.log("Veículo inserido com sucesso:", data);
        
        if (data && data.length > 0) {
          const newVehicle: Vehicle = {
            id: data[0].id,
            placa: data[0].placa,
            modelo: data[0].modelo,
            marca: data[0].marca,
            ano: data[0].ano || '',
            tipo: data[0].tipo || '',
            status: data[0].status || 'Disponível',
            quilometragem: data[0].quilometragem || 0,
            ultimaManutencao: data[0].ultimamanutencao ? new Date(data[0].ultimamanutencao).toISOString().split('T')[0] : '',
            proximaManutencao: data[0].proximamanutencao ? new Date(data[0].proximamanutencao).toISOString().split('T')[0] : '',
            observacoes: data[0].observacoes || ''
          };
          
          setVehicles([newVehicle, ...vehicles]);
        }
        
        toast({
          title: "Viatura adicionada",
          description: "Viatura cadastrada com sucesso.",
        });
      } else {
        const vehicleData = {
          placa: vehicle.placa,
          modelo: vehicle.modelo,
          marca: vehicle.marca,
          ano: vehicle.ano,
          tipo: vehicle.tipo,
          status: vehicle.status,
          quilometragem: vehicle.quilometragem,
          ultimamanutencao: vehicle.ultimaManutencao ? new Date(vehicle.ultimaManutencao).toISOString() : null,
          proximamanutencao: vehicle.proximaManutencao ? new Date(vehicle.proximaManutencao).toISOString() : null,
          observacoes: vehicle.observacoes,
          user_id: currentSession.user.id
        };
        
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', vehicle.id);
          
        if (error) {
          console.error("Erro ao atualizar veículo:", error);
          throw error;
        }
        
        console.log("Veículo atualizado com sucesso");
        
        setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
        
        toast({
          title: "Viatura atualizada",
          description: "Dados da viatura atualizados com sucesso.",
        });
      }
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Erro ao salvar viatura",
        description: `Não foi possível salvar os dados da viatura: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSaveDisabled(false);
    }
  };

  const handleSaveMaintenance = async (maintenance: Maintenance) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Permissão negada",
          description: "Você não tem permissão para gerenciar manutenções.",
          variant: "destructive"
        });
        return;
      }
      
      if (!maintenance.id) {
        const newMaintenance = { ...maintenance, id: maintenances.length + 1 };
        setMaintenances([...maintenances, newMaintenance]);
        
        toast({
          title: "Manutenção registrada",
          description: "Registro de manutenção adicionado com sucesso.",
        });
      } else {
        setMaintenances(maintenances.map(m => m.id === maintenance.id ? maintenance : m));
        
        toast({
          title: "Manutenção atualizada",
          description: "Registro de manutenção atualizado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Error saving maintenance:", error);
      toast({
        title: "Erro ao salvar manutenção",
        description: "Não foi possível salvar os dados da manutenção.",
        variant: "destructive"
      });
    }
  };

  const value = {
    vehicles,
    maintenances,
    isLoading,
    searchTerm,
    statusFilter,
    saveDisabled,
    fetchVehicles,
    setSearchTerm,
    setStatusFilter,
    handleSaveVehicle,
    handleSaveMaintenance
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};
