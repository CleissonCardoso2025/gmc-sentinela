import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserFormData } from '../pages/UserManagement/types';

interface UseUserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export const useUserForm = ({ initialData, onSubmit, onCancel }: UseUserFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(initialData?.id);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const data: UserFormData = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string,
        matricula: formData.get('matricula') as string,
        data_nascimento: formData.get('data_nascimento') as string,
        perfil: formData.get('perfil') as string,
        status: formData.get('status') === 'on',
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
      };

      // Create new user
      if (!isEditing) {
        const { error } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          user_metadata: {
            role: data.perfil, // <-- isso garante que vai pro raw_user_meta_data.role
            nome: data.nome,
            matricula: data.matricula,
            data_nascimento: data.data_nascimento,
            status: data.status
          }
        });

        if (error) throw error;
      }

      // Continue with your app logic (saving user to public.users, etc.)
      onSubmit(data);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return {
    form: {
      watch: (key: keyof UserFormData) => initialData?.[key] ?? '',
      setValue: () => {}, // Ajuste conforme o seu form library
      formState: { errors: {} },
    },
    isSubmitting,
    isEditing,
    handleSubmit,
    handleCancel,
  };
};
