
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

export const UsernameField: React.FC<UsernameFieldProps> = (props) => {
  // Validate control before destructuring
  if (!props.control) {
    const errorMessage = `UsernameField: 'control' prop is required for field "${props.name || 'unknown'}"`;
    console.error(errorMessage);
    return (
      <div className="space-y-2">
        <FormLabel className="text-gray-300">Usuário</FormLabel>
        <div className="relative">
          <div className="text-red-500 p-2 border border-red-500 rounded bg-red-500/10">
            Error: Campo de usuário não pôde ser renderizado
          </div>
        </div>
      </div>
    );
  }

  // Safe to destructure after validation
  const { name, control, disabled } = props;

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
