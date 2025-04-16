
import { User } from '@/types/database';

export type UserFormData = {
  id?: string;
  nome: string;
  email: string;
  matricula: string;
  data_nascimento: string;
  perfil: string; // Changed from enum to string
  status: boolean;
  password?: string;
  confirmPassword?: string;
};
