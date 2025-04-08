
import { User, UserFormData } from '@/components/Configuracoes/UserManagement';

export interface UserService {
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  createUser(userData: UserFormData): Promise<User>;
  updateUser(userData: UserFormData): Promise<User>;
  deleteUser(userId: number): Promise<boolean>;
  toggleUserStatus(userId: number): Promise<User>;
}
