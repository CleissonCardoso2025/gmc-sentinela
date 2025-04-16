// Modify the existing User interface
export interface User {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  data_nascimento?: string;
  perfil: string; // Changed from enum to string to allow dynamic roles
  status: boolean;
  created_at?: string;
  updated_at?: string;
  user_metadata?: {
    nome?: string;
    matricula?: string;
    data_nascimento?: string;
    role?: string;
    status?: boolean;
  };
}

export interface UserFormData {
  id?: string;
  nome: string;
  email: string;
  matricula: string;
  data_nascimento: string;
  perfil: string; // Changed from enum to string
  status: boolean;
  password?: string;
  confirmPassword?: string;
}

// Add missing types for Corregedoria
export interface Investigacao {
  id: string;
  numero: string;
  dataAbertura: string;
  investigado: string;
  motivo: string;
  status: string;
  etapaAtual: string;
  relatoInicial?: string;
  created_at?: string;
  updated_at?: string;
}

// Add missing types for Escala
export interface ScheduleDay {
  day: string;
  date: string;
  active: boolean;
}

export interface EscalaItem {
  id: string;
  guarnicao: string;
  supervisor: string;
  rota: string;
  viatura: string;
  periodo: string;
  agent: string;
  role: string;
  schedule: ScheduleDay[];
  created_at?: string;
  updated_at?: string;
}

export interface GuarnicaoOption {
  id: string;
  nome: string;
  supervisor: string;
}

export interface RotaOption {
  id: string;
  nome: string;
}

export interface ViaturaOption {
  id: string;
  codigo: string;
  modelo: string;
}
