
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface StatusFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  readOnly?: boolean;
}

const StatusField: React.FC<StatusFieldProps> = ({ 
  checked, 
  onChange, 
  readOnly = false 
}) => {
  if (readOnly) return null;
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="status"
        checked={checked}
        onCheckedChange={onChange}
        disabled={readOnly}
      />
      <Label htmlFor="status">Usuário ativo</Label>
    </div>
  );
};

export default StatusField;
