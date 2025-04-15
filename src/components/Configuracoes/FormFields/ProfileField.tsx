
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileFieldProps {
  value: string;
  onChange: (value: 'Inspetor' | 'Subinspetor' | 'Supervisor' | 'Corregedor' | 'Agente' | 'Motorista' | 'Monitor') => void;
  readOnly?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ 
  value, 
  onChange, 
  readOnly = false 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="perfil">Perfil</Label>
      <Select
        value={value}
        onValueChange={onChange as (value: string) => void}
        disabled={readOnly}
      >
        <SelectTrigger id="perfil" className={readOnly ? "bg-gray-100" : ""}>
          <SelectValue placeholder="Selecione um perfil" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Inspetor">Inspetor</SelectItem>
          <SelectItem value="Subinspetor">Subinspetor</SelectItem>
          <SelectItem value="Supervisor">Supervisor</SelectItem>
          <SelectItem value="Corregedor">Corregedor</SelectItem>
          <SelectItem value="Agente">Agente</SelectItem>
          <SelectItem value="Motorista">Motorista</SelectItem>
          <SelectItem value="Monitor">Monitor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfileField;
