
import React, { useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  error,
  label,
  placeholder = "Digite sua senha",
  readOnly = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
          />
        </FormControl>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};

export default PasswordField;
