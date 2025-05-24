
import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";

interface UsernameFieldProps {
  name: string;
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  name = "username",
  disabled = false
}) => {
  // Tentativa segura de obter o contexto do formulário
  const formContext = useFormContext();
  
  // Debug logging para verificar o contexto
  console.log("UsernameField context:", {
    hasContext: !!formContext,
    hasControl: !!formContext?.control,
    hasRegister: !!formContext?.register,
    hasFormState: !!formContext?.formState
  });

  // Fallback seguro - se não há contexto, retorna um input simples
  if (!formContext) {
    console.warn("UsernameField: No form context found, rendering simple input");
    return (
      <div className="space-y-2">
        <Label className="text-gray-300">Usuário</Label>
        <div className="relative">
          <Input
            className="pl-10 bg-gray-900/60 border-gray-700 text-white"
            placeholder="Digite seu email"
            disabled={disabled}
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
        <p className="text-sm text-red-500">Erro: Contexto do formulário não encontrado</p>
      </div>
    );
  }

  const { control, formState } = formContext;
  const error = formState?.errors?.[name]?.message;

  return (
    <FormItem>
      <Label className="text-gray-300">Usuário</Label>
      <FormControl>
        <div className="relative">
          <Input
            {...formContext.register(name)}
            className="pl-10 bg-gray-900/60 border-gray-700 text-white"
            placeholder="Digite seu email"
            disabled={disabled}
          />
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
