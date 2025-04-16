import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUserForm } from '@/hooks/use-user-form';

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

const UserForm = ({ initialData, onSubmit, onCancel }: UserFormProps) => {
  const { form, isSubmitting, handleSubmit, handleCancel } = useUserForm({
    initialData,
    onSubmit,
    onCancel
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              defaultValue={initialData?.nome || ''}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={initialData?.email || ''}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="matricula" className="text-sm font-medium">Matrícula</label>
            <input
              id="matricula"
              name="matricula"
              type="text"
              defaultValue={initialData?.matricula || ''}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="data_nascimento" className="text-sm font-medium">Data de Nascimento</label>
            <input
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              defaultValue={initialData?.data_nascimento || ''}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="perfil" className="text-sm font-medium">Perfil</label>
            <select
              id="perfil"
              name="perfil"
              defaultValue={initialData?.perfil || 'Agente'}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Inspetor">Inspetor</option>
              <option value="Subinspetor">Subinspetor</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Corregedor">Corregedor</option>
              <option value="Agente">Agente</option>
              <option value="Motorista">Motorista</option>
              <option value="Monitor">Monitor</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="status"
              name="status"
              type="checkbox"
              defaultChecked={initialData?.status !== false}
              className="h-4 w-4"
            />
            <label htmlFor="status" className="text-sm font-medium">Ativo</label>
          </div>
          
          {!initialData && (
            <>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-2 border rounded"
                  required={!initialData}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full p-2 border rounded"
                  required={!initialData}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;

export const useUserForm = ({ initialData, onSubmit, onCancel }: UserFormProps) => {
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
