
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types/database';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';

// Update the zod schema to make perfil a string instead of enum
const userFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  perfil: z.string().min(1, 'Perfil é obrigatório'), // Changed from enum to string
  status: z.boolean().default(true),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').or(z.string().length(0)).optional(),
  confirmPassword: z.string().or(z.string().length(0)).optional(),
}).refine((data) => {
  // If password is provided, confirmPassword must match
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

// Type for form data derived from the schema
type UserFormValues = z.infer<typeof userFormSchema>;

interface UseUserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void> | void;
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
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const handleSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // Combine form data with existing user ID if editing
      const userData: UserFormData = {
        ...(initialData?.id ? { id: initialData.id } : {}),
        nome: data.nome,
        email: data.email,
        matricula: data.matricula,
        data_nascimento: data.data_nascimento,
        perfil: data.perfil,
        status: data.status,
        password: data.password,
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
    handleSubmit: form.handleSubmit(handleSubmit),
    handleCancel,
    isEditing: !!initialData?.id,
  };
};
