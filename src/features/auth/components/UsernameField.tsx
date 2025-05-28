
import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ControllerRenderProps } from "react-hook-form";

interface UsernameFieldProps {
  field: ControllerRenderProps<any, any>;
  disabled?: boolean;
  error?: string;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  field,
  disabled = false,
  error
}) => {
  console.log("UsernameField: Rendering with field:", !!field, "disabled:", disabled);
  
  // Verificação robusta do field
  if (!field || typeof field !== 'object') {
    console.error("UsernameField: field prop is invalid", { field, fieldType: typeof field });
    return (
      <div className="space-y-2">
        <Label className="text-gray-300">Usuário</Label>
        <div className="text-red-500 text-sm p-2 bg-red-100 rounded">
          Erro: Campo de usuário não foi inicializado corretamente
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Usuário</Label>
      <div className="relative">
        <Input
          name={field.name || "username"}
          value={field.value || ""}
          onChange={field.onChange || (() => {})}
          onBlur={field.onBlur || (() => {})}
          className="pl-10 bg-gray-900/60 border-gray-700 text-white"
          placeholder="Digite seu email"
          disabled={disabled}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
