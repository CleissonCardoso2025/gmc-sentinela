
import { AbstractBaseService } from '../api/baseService';
import { UserService } from './types';
import { User, UserFormData } from '@/components/Configuracoes/UserManagement';
import { supabase } from '@/integrations/supabase/client';

export class ApiUserService extends AbstractBaseService implements UserService {
  constructor() {
    super('user');
  }

  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      return data.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        status: user.status,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil,
        status: data.status,
      };
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  async createUser(userData: UserFormData): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          nome: userData.nome,
          email: userData.email,
          perfil: userData.perfil,
          status: userData.status,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil,
        status: data.status,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(userData: UserFormData): Promise<User> {
    if (!userData.id) {
      throw new Error('User ID is required for update');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          nome: userData.nome,
          email: userData.email,
          perfil: userData.perfil,
          status: userData.status,
        })
        .eq('id', userData.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil,
        status: data.status,
      };
    } catch (error) {
      console.error(`Error updating user with ID ${userData.id}:`, error);
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  }

  async toggleUserStatus(userId: number): Promise<User> {
    try {
      // First fetch the current user to get the current status
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Toggle the status
      const { data, error } = await supabase
        .from('users')
        .update({ status: !user.status })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil,
        status: data.status,
      };
    } catch (error) {
      console.error(`Error toggling status for user with ID ${userId}:`, error);
      throw error;
    }
  }
}
