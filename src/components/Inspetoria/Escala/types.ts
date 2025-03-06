
export interface ScheduleDay {
  day: string;
  shift: string;
  status: string;
}

export interface EscalaItem {
  id: number;
  guarnicao: string;
  supervisor: string;
  rota: string;
  viatura: string;
  periodo: string;
  agent: string;
  role: string;
  schedule: ScheduleDay[];
}

export interface GuarnicaoOption {
  id: string;
  nome: string;
}

export interface SupervisorOption {
  id: string;
  nome: string;
}

export interface RotaOption {
  id: string;
  nome: string;
}
