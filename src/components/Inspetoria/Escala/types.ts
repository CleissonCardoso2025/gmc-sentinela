
export interface ScheduleDay {
  day: string;
  shift: string;
  status: string;
  [key: string]: string; // Add index signature to make it compatible with Json type
}

export interface EscalaItem {
  id: string; // Changed from 'number' to 'string' to match the UUID from Supabase
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
