
import React from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

interface PasswordFieldProps extends Omit<ControllerRenderProps, 'ref'> {
  showPassword: boolean;
  toggleVisibility: () => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ 
  value, 
  onChange, 
  onBlur, 
  showPassword, 
  toggleVisibility,
  disabled 
}) => {
  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">Senha</FormLabel>
      <div className="relative">
        <Input 
          value={value}
          onChange={onChange}
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
      <FormMessage className="text-red-400" />
    </div>
  );
};
