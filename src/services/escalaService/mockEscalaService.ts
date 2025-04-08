
import { AbstractBaseService } from '../api/baseService';
import { EscalaService } from './types';
import { EscalaItem, GuarnicaoOption, RotaOption, ViaturaOption } from '@/components/Inspetoria/Escala/types';
import { escalaData, guarnicoes, rotas, viaturas } from '@/components/Inspetoria/Escala/mockData';

// Create copies of the mock data to avoid direct modification
let mockEscalaData: EscalaItem[] = [...escalaData];
let mockGuarnicoes: GuarnicaoOption[] = [...guarnicoes];
let mockRotas: RotaOption[] = [...rotas];
let mockViaturas: ViaturaOption[] = [...viaturas];

export class MockEscalaService extends AbstractBaseService implements EscalaService {
  constructor() {
    super('escala');
  }

  async getEscalaItems(): Promise<EscalaItem[]> {
    await this.mockDelay();
    return [...mockEscalaData];
  }

  async getGuarnicoes(): Promise<GuarnicaoOption[]> {
    await this.mockDelay();
    return [...mockGuarnicoes];
  }

  async getRotas(): Promise<RotaOption[]> {
    await this.mockDelay();
    return [...mockRotas];
  }

  async getViaturas(): Promise<ViaturaOption[]> {
    await this.mockDelay();
    return [...mockViaturas];
  }

  async updateEscalaItem(item: EscalaItem): Promise<EscalaItem> {
    await this.mockDelay();
    const index = mockEscalaData.findIndex(i => i.id === item.id);
    if (index === -1) {
      throw new Error(`Escala item with ID ${item.id} not found`);
    }
    
    mockEscalaData[index] = { ...item };
    return { ...item };
  }

  async createEscalaItem(item: Omit<EscalaItem, 'id'>): Promise<EscalaItem> {
    await this.mockDelay();
    const newId = Math.max(0, ...mockEscalaData.map(i => i.id)) + 1;
    const newItem = { ...item, id: newId } as EscalaItem;
    
    mockEscalaData = [...mockEscalaData, newItem];
    return { ...newItem };
  }

  async deleteEscalaItem(id: number): Promise<boolean> {
    await this.mockDelay();
    const initialLength = mockEscalaData.length;
    mockEscalaData = mockEscalaData.filter(item => item.id !== id);
    return mockEscalaData.length < initialLength;
  }
}
