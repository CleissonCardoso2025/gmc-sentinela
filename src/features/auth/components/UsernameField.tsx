
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { LoginFormValues } from "../schemas/loginSchema";

interface UsernameFieldProps {
  form: UseFormReturn<LoginFormValues>;
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ form, disabled }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limpar espaços e caracteres especiais no final do email durante a digitação
    const value = e.target.value.trim();
    form.setValue("username", value);
  };

  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-300">Usuário</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                {...field} 
                className="pl-10 bg-gray-900/60 border-gray-700 text-white" 
                placeholder="Digite seu usuário"
                disabled={disabled}
                onBlur={(e) => {
                  // Garantir que o valor está limpo ao perder o foco
                  field.onChange(e.target.value.trim());
                  field.onBlur();
                }}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
              />
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};
