
import { User } from '@/types/database';

export type UserFormData = {
  id?: string;
  nome: string;
  email: string;
  matricula: string;
  data_nascimento: string;
  perfil: 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente';
  status: boolean;
};
