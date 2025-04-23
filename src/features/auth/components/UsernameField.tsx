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

export const UsernameField: React.FC<UsernameFieldProps> = ({
  name,
  control,
  disabled,
}) => {
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
          placeholder="Digite seu usuário"
          disabled={disabled}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      {error && <FormMessage className="text-red-400">{error.message}</FormMessage>}
    </div>
  );
};
