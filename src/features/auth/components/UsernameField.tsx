
import React from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useController, Control } from "react-hook-form";
import { LoginFormValues } from "../schemas/loginSchema";

interface UsernameFieldProps {
  control: Control<LoginFormValues>;
  name: "username";
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  control,
  name,
  disabled 
}) => {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limpar espaços e caracteres especiais no final do email durante a digitação
    const newValue = e.target.value.trim();
    field.onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">Usuário</FormLabel>
      <div className="relative">
        <Input 
          {...field}
          value={field.value || ''} 
          className="pl-10 bg-gray-900/60 border-gray-700 text-white" 
          placeholder="Digite seu usuário"
          disabled={disabled}
          onChange={handleInputChange}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      {error && <FormMessage className="text-red-400">{error.message}</FormMessage>}
    </div>
  );
};
