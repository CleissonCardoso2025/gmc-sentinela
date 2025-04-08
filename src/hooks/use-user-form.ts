
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types/database';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';

// Form schema for user data
const userFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  perfil: z.enum(['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente']),
  status: z.boolean().default(true),
});

// Type for form data derived from the schema
type UserFormValues = z.infer<typeof userFormSchema>;

interface UseUserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export const useUserForm = ({ initialData, onSubmit, onCancel }: UseUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up form with zod validation
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData || {
      nome: '',
      email: '',
      matricula: '',
      data_nascimento: '',
      perfil: 'Agente',
      status: true,
    },
  });

  // Handle form submission
  const handleSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // Combine form data with existing user ID if editing
      const userData: UserFormData = {
        ...data,
        ...(initialData?.id ? { id: initialData.id } : {}),
      };
      
      await onSubmit(userData);
      form.reset();
    } catch (error) {
      console.error('Error submitting user form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    handleCancel,
    isEditing: !!initialData?.id,
  };
};
