
import React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface PasswordFieldProps {
  field: ControllerRenderProps<any, any>;
  showPassword: boolean;
  toggleVisibility: () => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  showPassword,
  toggleVisibility,
  disabled = false
}) => {
  return (
    <FormItem>
      <Label className="text-gray-300">Senha</Label>
      <FormControl>
        <div className="relative">
          <Input
            {...field}
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
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
