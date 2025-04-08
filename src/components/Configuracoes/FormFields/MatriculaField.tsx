
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MatriculaFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isChecking?: boolean;
  readOnly?: boolean;
}

const MatriculaField: React.FC<MatriculaFieldProps> = ({ 
  value, 
  onChange, 
  error, 
  isChecking = false,
  readOnly = false 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="matricula">Matrícula</Label>
      <Input
        id="matricula"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Número de matrícula"
        readOnly={readOnly}
        className={readOnly ? "bg-gray-100" : ""}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isChecking && (
        <p className="text-sm text-blue-500">Verificando matrícula...</p>
      )}
    </div>
  );
};

export default MatriculaField;
