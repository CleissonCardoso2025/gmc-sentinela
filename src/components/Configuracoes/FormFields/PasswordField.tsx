
import React, { useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';

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

  // Use a standard div structure instead of FormItem when used outside of a Form context
  return (
    <div className="space-y-2">
      <Label htmlFor={`password-${label}`}>{label}</Label>
      <div className="relative">
        <Input
          id={`password-${label}`}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-100" : ""}
        />
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
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};

export default PasswordField;
