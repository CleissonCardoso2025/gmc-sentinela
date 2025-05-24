
import React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";

interface PasswordFieldProps {
  name: string;
  showPassword: boolean;
  toggleVisibility: () => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name = "password",
  showPassword,
  toggleVisibility,
  disabled = false
}) => {
  // Tentativa segura de obter o contexto do formulário
  const formContext = useFormContext();
  
  // Debug logging para verificar o contexto
  console.log("PasswordField context:", {
    hasContext: !!formContext,
    hasControl: !!formContext?.control,
    hasRegister: !!formContext?.register,
    hasFormState: !!formContext?.formState
  });

  // Safety checks para required functions
  if (!toggleVisibility) {
    console.error("PasswordField: toggleVisibility prop is missing");
    return null;
  }

  // Fallback seguro - se não há contexto, retorna um input simples
  if (!formContext) {
    console.warn("PasswordField: No form context found, rendering simple input");
    return (
      <div className="space-y-2">
        <Label className="text-gray-300">Senha</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10 bg-gray-900/60 border-gray-700 text-white"
            placeholder="Digite sua senha"
            disabled={disabled}
          />
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <button 
            type="button" 
            onClick={toggleVisibility}
            className="absolute right-3 top-3 text-gray-400"
            tabIndex={-1}
          >
            {showPassword ? 
              <EyeOff className="h-4 w-4" /> : 
              <Eye className="h-4 w-4" />
            }
          </button>
        </div>
        <p className="text-sm text-red-500">Erro: Contexto do formulário não encontrado</p>
      </div>
    );
  }

  const { formState } = formContext;
  const error = formState?.errors?.[name]?.message;
  
  return (
    <FormItem>
      <Label className="text-gray-300">Senha</Label>
      <FormControl>
        <div className="relative">
          <Input
            {...formContext.register(name)}
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10 bg-gray-900/60 border-gray-700 text-white"
            placeholder="Digite sua senha"
            disabled={disabled}
          />
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <button 
            type="button" 
            onClick={() => {
              console.log("Password visibility toggle clicked");
              toggleVisibility();
            }}
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
      <FormMessage />
    </FormItem>
  );
};
