
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatDateInput } from '@/utils/date-formatter';

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readOnly?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ 
  value, 
  onChange, 
  error,
  readOnly = false 
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="data_nascimento">Data de Nascimento</Label>
      <Input
        id="data_nascimento"
        value={value}
        onChange={handleDateChange}
        placeholder="DD/MM/AAAA"
        maxLength={10}
        readOnly={readOnly}
        className={readOnly ? "bg-gray-100" : ""}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DateField;
