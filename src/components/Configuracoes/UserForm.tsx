
import React from 'react';
import { UserFormData } from './UserManagement';
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
    formData,
    errors,
    isEmailChecking,
    isMatriculaChecking,
    validateForm,
    handleChange
  } = useUserForm(initialData, readOnly);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && !isEmailChecking && !isMatriculaChecking) {
      onSubmit(formData);
    } else if (isEmailChecking || isMatriculaChecking) {
      toast.warning("Aguarde a verificação de dados...");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <NameField 
        value={formData.nome}
        onChange={(value) => handleChange('nome', value)}
        error={errors.nome}
        readOnly={readOnly}
      />

      <EmailField 
        value={formData.email}
        onChange={(value) => handleChange('email', value)}
        error={errors.email}
        isChecking={isEmailChecking}
        readOnly={readOnly}
      />

      <MatriculaField 
        value={formData.matricula}
        onChange={(value) => handleChange('matricula', value)}
        error={errors.matricula}
        isChecking={isMatriculaChecking}
        readOnly={readOnly}
      />

      <DateField 
        value={formData.data_nascimento}
        onChange={(value) => handleChange('data_nascimento', value)}
        error={errors.data_nascimento}
        readOnly={readOnly}
      />

      <ProfileField 
        value={formData.perfil}
        onChange={(value) => handleChange('perfil', value)}
        readOnly={readOnly}
      />

      <StatusField 
        checked={formData.status}
        onChange={(checked) => handleChange('status', checked)}
        readOnly={readOnly}
      />

      <FormActions 
        onCancel={onCancel}
        isEditing={!!initialData}
        readOnly={readOnly}
      />
    </form>
  );
};

export default UserForm;
