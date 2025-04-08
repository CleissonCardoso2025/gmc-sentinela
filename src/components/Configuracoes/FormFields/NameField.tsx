
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readOnly?: boolean;
}

const NameField: React.FC<NameFieldProps> = ({ value, onChange, error, readOnly = false }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="nome">Nome</Label>
      <Input
        id="nome"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nome completo"
        readOnly={readOnly}
        className={readOnly ? "bg-gray-100" : ""}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default NameField;
