
import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ControllerRenderProps } from "react-hook-form";
import { useFormContext } from "react-hook-form";

interface UsernameFieldProps {
  field: ControllerRenderProps<any, any>;
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

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  field,
  disabled = false
}) => {
  console.log("UsernameField: Rendering with field:", !!field, "disabled:", disabled);
  
  const formContext = useFormContext();
  const fieldError = formContext?.formState?.errors?.username;
  const errorMessage = getErrorMessage(fieldError);
  
  if (!field) {
    console.error("UsernameField: field prop is undefined");
    return (
      <div className="text-red-500 text-sm">
        Erro: Campo de usuário não foi inicializado corretamente
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Usuário</Label>
      <div className="relative">
        <Input
          {...field}
          className="pl-10 bg-gray-900/60 border-gray-700 text-white"
          placeholder="Digite seu email"
          disabled={disabled}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
