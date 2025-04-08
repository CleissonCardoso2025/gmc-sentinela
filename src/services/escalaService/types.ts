
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption } from '@/components/Inspetoria/Escala/types';

export interface EscalaService {
  getEscalaItems(): Promise<EscalaItem[]>;
  getGuarnicoes(): Promise<GuarnicaoOption[]>;
  getRotas(): Promise<RotaOption[]>;
  getViaturas(): Promise<ViaturaOption[]>;
  updateEscalaItem(item: EscalaItem): Promise<EscalaItem>;
  createEscalaItem(item: Omit<EscalaItem, 'id'>): Promise<EscalaItem>;
  deleteEscalaItem(id: number): Promise<boolean>;
}
