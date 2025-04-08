
import { AbstractBaseService } from '../api/baseService';
import { UserService } from './types';
import { User, UserFormData } from '@/components/Configuracoes/UserManagement';
import { ApiResponse } from '../api/types';

// Initial mock data
let mockUsers: User[] = [
  { id: 1, nome: 'Carlos Silva', email: 'carlos.silva@gcm.gov.br', perfil: 'Inspetor', status: true },
  { id: 2, nome: 'Maria Oliveira', email: 'maria.oliveira@gcm.gov.br', perfil: 'Subinspetor', status: true },
  { id: 3, nome: 'João Santos', email: 'joao.santos@gcm.gov.br', perfil: 'Supervisor', status: true },
  { id: 4, nome: 'Ana Costa', email: 'ana.costa@gcm.gov.br', perfil: 'Corregedor', status: false },
  { id: 5, nome: 'Pedro Lima', email: 'pedro.lima@gcm.gov.br', perfil: 'Agente', status: true },
];

export class MockUserService extends AbstractBaseService implements UserService {
  constructor() {
    super('user');
  }

  async getUsers(): Promise<User[]> {
    await this.mockDelay();
    return [...mockUsers];
  }

  async getUserById(id: number): Promise<User | null> {
    await this.mockDelay();
    const user = mockUsers.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async createUser(userData: UserFormData): Promise<User> {
    await this.mockDelay();
    const newUser = {
      ...userData,
      id: Math.max(0, ...mockUsers.map(u => u.id)) + 1,
    } as User;
    
    mockUsers = [...mockUsers, newUser];
    return { ...newUser };
  }

  async updateUser(userData: UserFormData): Promise<User> {
    await this.mockDelay();
    if (!userData.id) {
      throw new Error('User ID is required for update');
    }
    
    mockUsers = mockUsers.map(user => 
      user.id === userData.id ? { ...userData } as User : user
    );
    
    const updatedUser = mockUsers.find(u => u.id === userData.id);
    if (!updatedUser) {
      throw new Error(`User with ID ${userData.id} not found`);
    }
    
    return { ...updatedUser };
  }

  async deleteUser(userId: number): Promise<boolean> {
    await this.mockDelay();
    const initialLength = mockUsers.length;
    mockUsers = mockUsers.filter(user => user.id !== userId);
    return mockUsers.length < initialLength;
  }

  async toggleUserStatus(userId: number): Promise<User> {
    await this.mockDelay();
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    user.status = !user.status;
    return { ...user };
  }
}
