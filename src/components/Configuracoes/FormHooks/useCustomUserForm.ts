
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';

interface UseCustomUserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export const useCustomUserForm = ({ initialData, onSubmit, onCancel }: UseCustomUserFormProps) => {
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
      };

      // If editing, include the ID
      if (isEditing && initialData?.id) {
        data.id = initialData.id;
      }

      // Create new user
      if (!isEditing) {
        const { error } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          user_metadata: {
            role: data.perfil,
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
      setValue: () => {}, // Placeholder for form library
      formState: { errors: {} },
    },
    isSubmitting,
    isEditing,
    handleSubmit,
    handleCancel,
  };
};
