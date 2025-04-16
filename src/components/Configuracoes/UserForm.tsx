
import React from 'react';
import { UserFormData } from '@/components/Configuracoes/UserManagement/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCustomUserForm } from '@/components/Configuracoes/FormHooks/useCustomUserForm';

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

const UserForm = ({ initialData, onSubmit, onCancel }: UserFormProps) => {
  const { isSubmitting, handleSubmit, handleCancel } = useCustomUserForm({
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
