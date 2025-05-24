
import React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ControllerRenderProps } from "react-hook-form";
import { useFormContext } from "react-hook-form";

interface PasswordFieldProps {
  field: ControllerRenderProps<any, any>;
  showPassword: boolean;
  toggleVisibility: () => void;
  disabled?: boolean;
}

// Helper function to safely extract error message
const getErrorMessage = (error: any): string | null => {
  if (!error) return null;
  
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object' && 'message' in error) {
    return typeof error.message === 'string' ? error.message : String(error.message);
  }
  
  return String(error);
};

export const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  showPassword,
  toggleVisibility,
  disabled = false
}) => {
  console.log("PasswordField: Rendering with field:", !!field, "disabled:", disabled);
  
  const formContext = useFormContext();
  const fieldError = formContext?.formState?.errors?.password;
  const errorMessage = getErrorMessage(fieldError);
  
  if (!field) {
    console.error("PasswordField: field prop is undefined");
    return (
      <div className="text-red-500 text-sm">
        Erro: Campo de senha não foi inicializado corretamente
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Senha</Label>
      <div className="relative">
        <Input
          {...field}
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-10 bg-gray-900/60 border-gray-700 text-white"
          placeholder="Digite sua senha"
          disabled={disabled}
        />
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <button 
          type="button" 
          onClick={toggleVisibility}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
          tabIndex={-1}
        >
          {showPassword ? 
            <EyeOff className="h-4 w-4" /> : 
            <Eye className="h-4 w-4" />
          }
        </button>
      </div>
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
