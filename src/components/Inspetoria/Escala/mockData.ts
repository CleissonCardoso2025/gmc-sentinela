
import { EscalaItem, GuarnicaoOption, SupervisorOption, RotaOption } from './types';

// Mock data for the schedule
export const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export const escalaData: EscalaItem[] = [
  {
    id: 1,
    guarnicao: "Guarnição Alpha",
    supervisor: "Sgt. Roberto Silva",
    rota: "Rota Centro-Norte",
    viatura: "GCM-1234 (Spin)",
    periodo: "01/07/2024 - 30/07/2024",
    agent: "Sgt. Roberto Silva",
    role: "Supervisor",
    schedule: [
      { day: "Segunda", shift: "Diurno", status: "presente" },
      { day: "Terça", shift: "Diurno", status: "presente" },
      { day: "Quarta", shift: "Folga", status: "folga" },
      { day: "Quinta", shift: "Diurno", status: "presente" },
      { day: "Sexta", shift: "Diurno", status: "presente" },
      { day: "Sábado", shift: "Folga", status: "folga" },
      { day: "Domingo", shift: "Folga", status: "folga" },
    ]
  },
  {
    id: 2,
    guarnicao: "Guarnição Alpha",
    supervisor: "Sgt. Roberto Silva",
    rota: "Rota Centro-Norte",
    viatura: "GCM-1234 (Spin)",
    periodo: "01/07/2024 - 30/07/2024",
    agent: "Agente Carlos Pereira",
    role: "Agente",
    schedule: [
      { day: "Segunda", shift: "Diurno", status: "presente" },
      { day: "Terça", shift: "Diurno", status: "presente" },
      { day: "Quarta", shift: "Diurno", status: "presente" },
      { day: "Quinta", shift: "Folga", status: "folga" },
      { day: "Sexta", shift: "Folga", status: "folga" },
      { day: "Sábado", shift: "Noturno", status: "presente" },
      { day: "Domingo", shift: "Noturno", status: "presente" },
    ]
  },
  {
    id: 3,
    guarnicao: "Guarnição Bravo",
    supervisor: "Sgt. Marcos Oliveira",
    rota: "Rota Leste",
    viatura: "GCM-5678 (Hilux)",
    periodo: "01/07/2024 - 30/07/2024",
    agent: "Agente Ana Melo",
    role: "Agente",
    schedule: [
      { day: "Segunda", shift: "Noturno", status: "presente" },
      { day: "Terça", shift: "Noturno", status: "presente" },
      { day: "Quarta", shift: "Folga", status: "folga" },
      { day: "Quinta", shift: "Folga", status: "folga" },
      { day: "Sexta", shift: "Noturno", status: "presente" },
      { day: "Sábado", shift: "Noturno", status: "presente" },
      { day: "Domingo", shift: "Noturno", status: "presente" },
    ]
  },
  {
    id: 4,
    guarnicao: "Guarnição Bravo",
    supervisor: "Sgt. Marcos Oliveira",
    rota: "Rota Leste",
    viatura: "GCM-5678 (Hilux)",
    periodo: "01/07/2024 - 30/07/2024",
    agent: "Agente Paulo Santos",
    role: "Agente",
    schedule: [
      { day: "Segunda", shift: "Folga", status: "folga" },
      { day: "Terça", shift: "Folga", status: "folga" },
      { day: "Quarta", shift: "Diurno", status: "licença" },
      { day: "Quinta", shift: "Diurno", status: "licença" },
      { day: "Sexta", shift: "Diurno", status: "licença" },
      { day: "Sábado", shift: "Diurno", status: "presente" },
      { day: "Domingo", shift: "Diurno", status: "presente" },
    ]
  },
];

// Mock data for filters
export const guarnicoes: GuarnicaoOption[] = [
  { id: "1", nome: "Guarnição Alpha" },
  { id: "2", nome: "Guarnição Bravo" },
  { id: "3", nome: "Guarnição Charlie" }
];

export const supervisores: SupervisorOption[] = [
  { id: "1", nome: "Sgt. Roberto Silva" },
  { id: "2", nome: "Sgt. Marcos Oliveira" },
  { id: "3", nome: "Sgt. Pedro Costa" }
];

export const rotas: RotaOption[] = [
  { id: "1", nome: "Rota Centro-Norte" },
  { id: "2", nome: "Rota Leste" },
  { id: "3", nome: "Rota Escolar" }
];
