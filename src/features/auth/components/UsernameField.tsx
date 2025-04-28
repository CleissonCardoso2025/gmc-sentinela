
import React from "react";
import { useController, Control } from "react-hook-form";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface UsernameFieldProps {
  name: string;
  control: Control<any>;
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ name, control, disabled }) => {
  // Verificar se o controle existe antes de usar
  if (!control) {
    console.error(`UsernameField: 'control' prop is required for field "${name || 'unknown'}"`);
    return (
      <div className="space-y-2">
        <FormLabel className="text-gray-300">Usuário</FormLabel>
        <div className="relative">
          <Input
            className="pl-10 bg-gray-900/60 border-gray-700 text-white"
            placeholder="Digite seu usuário"
            disabled={true}
            value=""
            onChange={() => {}}
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
    );
  }

  try {
    const {
      field,
      fieldState: { error },
    } = useController({
      name,
      control,
      defaultValue: "",
    });

    return (
      <div className="space-y-2">
        <FormLabel className="text-gray-300">Usuário</FormLabel>
        <div className="relative">
          <Input
            {...field}
            className="pl-10 bg-gray-900/60 border-gray-700 text-white"
            placeholder="Digite seu email"
            disabled={disabled}
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
        {error && <FormMessage className="text-red-400">{error.message}</FormMessage>}
      </div>
    );
  } catch (err) {
    console.error("Error in UsernameField:", err);
    return (
      <div className="space-y-2">
        <FormLabel className="text-gray-300">Usuário</FormLabel>
        <div className="relative">
          <Input
            className="pl-10 bg-gray-900/60 border-gray-700 text-white"
            placeholder="Digite seu email"
            disabled={disabled}
            value=""
            onChange={() => {}}
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
    );
  }
};
