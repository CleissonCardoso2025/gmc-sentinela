
import { supabase } from '@/integrations/supabase/client';
import { User, UserFormData } from '@/types/database';

export const createUser = async (data: UserFormData) => {
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    user_metadata: {
      role: data.perfil,
      nome: data.nome,
      matricula: data.matricula,
      data_nascimento: data.data_nascimento,
      status: data.status,
    }
  });

  if (error) throw error;
  return newUser;
};

export const updateUser = async (data: User) => {
  const { data: updatedUser, error } = await supabase.auth.admin.updateUserById(data.id, {
    user_metadata: {
      role: data.perfil,
      nome: data.nome,
      matricula: data.matricula,
      data_nascimento: data.data_nascimento,
      status: data.status,
    }
  });

  if (error) throw error;
  return updatedUser;
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
  return true;
};

export const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
  const { data: updatedUser, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      status: !currentStatus
    }
  });

  if (error) throw error;
  return updatedUser;
};

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('nome', { ascending: true });
  
  if (error) throw error;
  return data || [];
};
