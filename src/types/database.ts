
// Database types for the application

export interface User {
  id: string;
  nome: string;
  email: string;
  matricula?: string;
  data_nascimento?: string;
  perfil: 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente';
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Guarnicao {
  id: string;
  nome: string;
  supervisor: string;
  created_at?: string;
  updated_at?: string;
}

export interface MembroGuarnicao {
  id: string;
  guarnicao_id: string;
  nome: string;
  funcao: string;
  created_at?: string;
  updated_at?: string;
}

export interface Rota {
  id: string;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

export interface Viatura {
  id: string;
  codigo: string;
  modelo: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleDay {
  day: string;
  shift: string;
  status: string;
  [key: string]: string; // Add index signature to make it compatible with Json type
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

export interface Ocorrencia {
  id: string;
  numero: string;
  data: string;
  local: string;
  tipo: string;
  status: string;
  descricao: string;
  created_at?: string;
  updated_at?: string;
}

// Interface types used in components
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
