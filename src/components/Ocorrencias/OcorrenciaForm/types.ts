
export type OcorrenciaStatus = 'Aberta' | 'Encerrada' | 'Encaminhada' | 'Sob Investigação';
export type OcorrenciaTipo = 'Trânsito' | 'Crime' | 'Dano ao patrimônio público' | 'Maria da Penha' | 'Apoio a outra instituição' | 'Outros';
export type VinculoOcorrencia = 'Vítima' | 'Suspeito' | 'Testemunha';
export type EstadoAparente = 'Lúcido' | 'Alterado' | 'Ferido';

export interface Envolvido {
  nome: string;
  apelido?: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  endereco: string;
  telefone: string;
  vinculo: VinculoOcorrencia;
  estadoAparente: EstadoAparente;
}

export interface ProvidenciaTomada {
  id: string;
  label: string;
  checked: boolean;
}

export interface MediaAttachment {
  id: string;
  file: File | null;
  preview: string;
  type: 'image' | 'document' | 'video';
  description: string;
}
