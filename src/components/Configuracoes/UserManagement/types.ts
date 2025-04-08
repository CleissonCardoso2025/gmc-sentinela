
import { User } from '@/types/database';

export type UserFormData = Omit<User, 'id'> & { id?: string };
