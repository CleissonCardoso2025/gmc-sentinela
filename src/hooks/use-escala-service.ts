
import { useState, useEffect, useCallback } from 'react';
import { getEscalaService, resetEscalaService } from '@/services/escalaService';
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption } from '@/components/Inspetoria/Escala/types';
import { setServiceConfig } from '@/services/api/serviceConfig';

export function useEscalaService() {
  const [escalaItems, setEscalaItems] = useState<EscalaItem[]>([]);
  const [guarnicoes, setGuarnicoes] = useState<GuarnicaoOption[]>([]);
  const [rotas, setRotas] = useState<RotaOption[]>([]);
  const [viaturas, setViaturas] = useState<ViaturaOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const escalaService = getEscalaService();

  const fetchEscalaData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [items, guarnicoesList, rotasList, viaturasList] = await Promise.all([
        escalaService.getEscalaItems(),
        escalaService.getGuarnicoes(),
        escalaService.getRotas(),
        escalaService.getViaturas()
      ]);
      
      setEscalaItems(items);
      setGuarnicoes(guarnicoesList);
      setRotas(rotasList);
      setViaturas(viaturasList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch escala data');
      console.error('Error fetching escala data:', err);
    } finally {
      setLoading(false);
    }
  }, [escalaService]);

  useEffect(() => {
    fetchEscalaData();
  }, [fetchEscalaData]);

  const updateEscalaItem = async (item: EscalaItem): Promise<EscalaItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedItem = await escalaService.updateEscalaItem(item);
      await fetchEscalaData(); // Refresh the data
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update escala item');
      console.error('Error updating escala item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEscalaItem = async (item: Omit<EscalaItem, 'id'>): Promise<EscalaItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await escalaService.createEscalaItem(item);
      await fetchEscalaData(); // Refresh the data
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create escala item');
      console.error('Error creating escala item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEscalaItem = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await escalaService.deleteEscalaItem(id);
      await fetchEscalaData(); // Refresh the data
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete escala item');
      console.error('Error deleting escala item:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle between mock and real data
  const toggleMockMode = (useMocks: boolean) => {
    setServiceConfig('escala', { useMocks });
    resetEscalaService();
    fetchEscalaData();
  };

  return {
    escalaItems,
    guarnicoes,
    rotas,
    viaturas,
    loading,
    error,
    updateEscalaItem,
    createEscalaItem,
    deleteEscalaItem,
    refreshEscalaData: fetchEscalaData,
    toggleMockMode
  };
}
