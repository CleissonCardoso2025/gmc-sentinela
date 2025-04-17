
import { supabase } from "@/integrations/supabase/client";

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'urgente' | 'ordem' | 'diligencia' | 'procedimento' | 'administrativo';
  created_at: string;  // Changed from createdAt
  author: string;
  status: 'ativo' | 'resolvido';
  read: boolean;
  target: string;
  target_detail?: string;
  schedule_date?: string;
  recurring: boolean;
  recurrence_pattern?: string;
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
    author: author,
    status: 'ativo',
    read: false,
    target: alertData.target,
    target_detail: alertData.targetDetail || null,
    schedule_date: alertData.scheduleType === 'agendado' ? alertData.scheduleDate : now,
    recurring: alertData.recurring,
    recurrence_pattern: alertData.recurring ? alertData.recurrencePattern : null
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
    .order('created_at', { ascending: false });
    
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
