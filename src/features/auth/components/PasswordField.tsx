
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { LoginFormValues } from "../schemas/loginSchema";

interface PasswordFieldProps {
  form: UseFormReturn<LoginFormValues>;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ 
  form, 
  showPassword, 
  togglePasswordVisibility,
  disabled 
}) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-300">Senha</FormLabel>
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
                onClick={togglePasswordVisibility}
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
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};
