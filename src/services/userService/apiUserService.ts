
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/database";
import { toast } from "sonner";

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao buscar usuários");
      return [];
    }

    return data as User[];
  } catch (error) {
    console.error("Exception fetching users:", error);
    toast.error("Erro ao buscar usuários");
    return [];
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching user by ID:", error);
      toast.error("Erro ao buscar usuário");
      return null;
    }

    return data as User;
  } catch (error) {
    console.error("Exception fetching user by ID:", error);
    toast.error("Erro ao buscar usuário");
    return null;
  }
};

// Create new user
export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      toast.error(`Erro ao criar usuário: ${error.message}`);
      return null;
    }

    toast.success("Usuário criado com sucesso");
    return data as User;
  } catch (error) {
    console.error("Exception creating user:", error);
    toast.error("Erro ao criar usuário");
    return null;
  }
};

// Update user
export const updateUser = async (user: User): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        status: user.status
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
      return null;
    }

    toast.success("Usuário atualizado com sucesso");
    return data as User;
  } catch (error) {
    console.error("Exception updating user:", error);
    toast.error("Erro ao atualizar usuário");
    return null;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting user:", error);
      toast.error(`Erro ao excluir usuário: ${error.message}`);
      return false;
    }

    toast.success("Usuário excluído com sucesso");
    return true;
  } catch (error) {
    console.error("Exception deleting user:", error);
    toast.error("Erro ao excluir usuário");
    return false;
  }
};

// Toggle user status
export const toggleUserStatus = async (id: string, currentStatus: boolean): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ status: !currentStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling user status:", error);
      toast.error(`Erro ao alterar status do usuário: ${error.message}`);
      return null;
    }

    toast.success(`Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
    return data as User;
  } catch (error) {
    console.error("Exception toggling user status:", error);
    toast.error("Erro ao alterar status do usuário");
    return null;
  }
};
