
import { EscalaItem, GuarnicaoOption, RotaOption } from './types';

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
      { day: "Segunda", shift: "24h", status: "presente" },
      { day: "Terça", shift: "Folga", status: "folga" },
      { day: "Quarta", shift: "Folga", status: "folga" },
      { day: "Quinta", shift: "Folga", status: "folga" },
      { day: "Sexta", shift: "24h", status: "presente" },
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
      { day: "Segunda", shift: "Folga", status: "folga" },
      { day: "Terça", shift: "24h", status: "presente" },
      { day: "Quarta", shift: "Folga", status: "folga" },
      { day: "Quinta", shift: "Folga", status: "folga" },
      { day: "Sexta", shift: "Folga", status: "folga" },
      { day: "Sábado", shift: "24h", status: "presente" },
      { day: "Domingo", shift: "Folga", status: "folga" },
    ]
  },
  {
    id: 3,
    guarnicao: "Guarnição Bravo",
    supervisor: "Sgt. Marcos Oliveira",
    rota: "Rota Leste",
    viatura: "GCM-5678 (Hilux)",
    periodo: "01/07/2024 - 30/07/2024",
    agent: "Sgt. Marcos Oliveira",
    role: "Supervisor",
    schedule: [
      { day: "Segunda", shift: "Folga", status: "folga" },
      { day: "Terça", shift: "Folga", status: "folga" },
      { day: "Quarta", shift: "24h", status: "presente" },
      { day: "Quinta", shift: "Folga", status: "folga" },
      { day: "Sexta", shift: "Folga", status: "folga" },
      { day: "Sábado", shift: "Folga", status: "folga" },
      { day: "Domingo", shift: "24h", status: "presente" },
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
      { day: "Quarta", shift: "Folga", status: "folga" },
      { day: "Quinta", shift: "24h", status: "licença" },
      { day: "Sexta", shift: "Folga", status: "folga" },
      { day: "Sábado", shift: "Folga", status: "folga" },
      { day: "Domingo", shift: "Folga", status: "folga" },
    ]
  },
];

// Mock data for filters
export const guarnicoes: GuarnicaoOption[] = [
  { id: "1", nome: "Guarnição Alpha", supervisor: "Sgt. Roberto Silva" },
  { id: "2", nome: "Guarnição Bravo", supervisor: "Sgt. Marcos Oliveira" },
  { id: "3", nome: "Guarnição Charlie", supervisor: "Sgt. Pedro Costa" }
];

export const rotas: RotaOption[] = [
  { id: "1", nome: "Rota Centro-Norte" },
  { id: "2", nome: "Rota Leste" },
  { id: "3", nome: "Rota Escolar" }
];
