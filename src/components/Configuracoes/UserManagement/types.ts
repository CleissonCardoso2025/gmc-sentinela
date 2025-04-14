
import { User } from '@/types/database';

export type UserFormData = {
  id?: string;
  nome: string;
  email: string;
  matricula: string; // Making this required for the form
  data_nascimento: string; // Making this required for the form
  perfil: 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente';
  status: boolean;
  password?: string;
};
