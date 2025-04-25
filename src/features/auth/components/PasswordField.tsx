
import React from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  showPassword: boolean;
  toggleVisibility: () => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = (props) => {
  // Check for required props
  if (!props.onChange || props.value === undefined) {
    const errorMessage = "PasswordField: 'value' and 'onChange' props are required";
    console.error(errorMessage);
    return (
      <div className="space-y-2">
        <FormLabel className="text-gray-300">Senha</FormLabel>
        <div className="relative">
          <div className="text-red-500 p-2 border border-red-500 rounded bg-red-500/10">
            Error: Campo de senha não pôde ser renderizado
          </div>
        </div>
      </div>
    );
  }
  
  // Safe to destructure after validation
  const { value, onChange, onBlur, error, showPassword, toggleVisibility, disabled } = props;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">Senha</FormLabel>
      <div className="relative">
        <Input 
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          type={showPassword ? "text" : "password"} 
          className="pl-10 pr-10 bg-gray-900/60 border-gray-700 text-white" 
          placeholder="Digite sua senha"
          disabled={disabled}
        />
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <button 
          type="button" 
          onClick={toggleVisibility}
          className="absolute right-3 top-3 text-gray-400"
          tabIndex={-1}
        >
          {showPassword ? 
            <EyeOff className="h-4 w-4" /> : 
            <Eye className="h-4 w-4" />
          }
        </button>
      </div>
      {error && <FormMessage className="text-red-400">{error}</FormMessage>}
    </div>
  );
};
