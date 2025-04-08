
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
