
import React from 'react';
import { UserFormData } from './UserManagement/types';
import { toast } from "sonner";
import { useUserForm } from '@/hooks/use-user-form';

// Import form field components
import NameField from './FormFields/NameField';
import EmailField from './FormFields/EmailField';
import MatriculaField from './FormFields/MatriculaField';
import DateField from './FormFields/DateField';
import ProfileField from './FormFields/ProfileField';
import StatusField from './FormFields/StatusField';
import FormActions from './FormFields/FormActions';

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  initialData, 
  onSubmit,
  onCancel,
  readOnly = false
}) => {
  const {
    form,
    isSubmitting,
    handleSubmit,
    handleCancel,
    isEditing
  } = useUserForm({ initialData, onSubmit, onCancel });

  // Handle form submission with validation
  const onFormSubmit = handleSubmit;

  const handleProfileChange = (value: 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente') => {
    form.setValue('perfil', value);
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-4">
      <NameField 
        value={form.watch('nome')}
        onChange={(value) => form.setValue('nome', value)}
        error={form.formState.errors.nome?.message}
        readOnly={readOnly}
      />

      <EmailField 
        value={form.watch('email')}
        onChange={(value) => form.setValue('email', value)}
        error={form.formState.errors.email?.message}
        isChecking={false}
        readOnly={readOnly}
      />

      <MatriculaField 
        value={form.watch('matricula')}
        onChange={(value) => form.setValue('matricula', value)}
        error={form.formState.errors.matricula?.message}
        isChecking={false}
        readOnly={readOnly}
      />

      <DateField 
        value={form.watch('data_nascimento')}
        onChange={(value) => form.setValue('data_nascimento', value)}
        error={form.formState.errors.data_nascimento?.message}
        readOnly={readOnly}
      />

      <ProfileField 
        value={form.watch('perfil')}
        onChange={handleProfileChange}
        readOnly={readOnly}
      />

      <StatusField 
        checked={form.watch('status')}
        onChange={(checked) => form.setValue('status', checked)}
        readOnly={readOnly}
      />

      <FormActions 
        onCancel={handleCancel}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        readOnly={readOnly}
      />
    </form>
  );
};

export default UserForm;
