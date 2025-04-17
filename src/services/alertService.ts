
import { supabase } from "@/integrations/supabase/client";

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'urgente' | 'ordem' | 'diligencia' | 'procedimento' | 'administrativo';
  createdAt: string;
  author: string;
  status: 'ativo' | 'resolvido';
  read: boolean;
  target: string;
  targetDetail?: string;
  scheduleDate?: string;
  recurring: boolean;
  recurrencePattern?: string;
}

export interface AlertFormValues {
  title: string;
  description: string;
  type: string;
  target: string;
  targetDetail?: string;
  scheduleType: string;
  scheduleDate: string;
  recurring: boolean;
  recurrencePattern: string;
}

export const createAlert = async (alertData: AlertFormValues, author: string = "Admin") => {
  const now = new Date().toISOString();
  
  const alert = {
    title: alertData.title,
    description: alertData.description,
    type: alertData.type,
    createdAt: now,
    author: author,
    status: 'ativo',
    read: false,
    target: alertData.target,
    targetDetail: alertData.targetDetail || null,
    scheduleDate: alertData.scheduleType === 'agendado' ? alertData.scheduleDate : now,
    recurring: alertData.recurring,
    recurrencePattern: alertData.recurring ? alertData.recurrencePattern : null
  };
  
  const { data, error } = await supabase
    .from('alerts')
    .insert([alert])
    .select();
    
  if (error) throw error;
  return data?.[0];
};

export const getAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('createdAt', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const updateAlertStatus = async (id: string, read: boolean) => {
  const { error } = await supabase
    .from('alerts')
    .update({ read })
    .eq('id', id);
    
  if (error) throw error;
  return true;
};

export const deleteAlert = async (id: string) => {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};
