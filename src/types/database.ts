
// Modify the existing User interface
export interface User {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  data_nascimento?: string;
  perfil: 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente' | 'Motorista' | 'Monitor';
  status: boolean;
  created_at?: string;
  updated_at?: string;
}
