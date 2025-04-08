
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isChecking?: boolean;
  readOnly?: boolean;
}

const EmailField: React.FC<EmailFieldProps> = ({ 
  value, 
  onChange, 
  error, 
  isChecking = false,
  readOnly = false 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="email@example.com"
        readOnly={readOnly}
        className={readOnly ? "bg-gray-100" : ""}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isChecking && (
        <p className="text-sm text-blue-500">Verificando email...</p>
      )}
    </div>
  );
};

export default EmailField;
