
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { LoginFormValues } from "../schemas/loginSchema";
import { ControllerRenderProps } from "react-hook-form";

// Update the props to accept direct field props instead of requiring a form object
interface UsernameFieldProps extends Omit<ControllerRenderProps, 'ref'> {
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  value, 
  onChange, 
  onBlur, 
  disabled 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limpar espaços e caracteres especiais no final do email durante a digitação
    const value = e.target.value.trim();
    onChange(value);
  };

  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">Usuário</FormLabel>
      <div className="relative">
        <Input 
          value={value} 
          className="pl-10 bg-gray-900/60 border-gray-700 text-white" 
          placeholder="Digite seu usuário"
          disabled={disabled}
          onBlur={(e) => {
            // Garantir que o valor está limpo ao perder o foco
            onChange(e.target.value.trim());
            onBlur();
          }}
          onChange={(e) => {
            onChange(e);
            handleInputChange(e);
          }}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      <FormMessage className="text-red-400" />
    </div>
  );
};
