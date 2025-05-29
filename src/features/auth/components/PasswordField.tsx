
import React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ControllerRenderProps } from "react-hook-form";

interface PasswordFieldProps {
  field: ControllerRenderProps<any, any>;
  showPassword: boolean;
  toggleVisibility: () => void;
  disabled?: boolean;
  error?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  showPassword,
  toggleVisibility,
  disabled = false,
  error
}) => {
  console.log("PasswordField: Rendering with field:", !!field, "showPassword:", showPassword, "field details:", {
    hasName: !!field?.name,
    hasValue: field?.value !== undefined,
    hasOnChange: !!field?.onChange,
    hasOnBlur: !!field?.onBlur
  });
  
  // Enhanced safety check with more detailed validation
  if (!field || typeof field !== 'object' || !field.name || typeof field.onChange !== 'function') {
    console.error("PasswordField: field prop is invalid or incomplete", { 
      field, 
      fieldType: typeof field,
      hasName: !!field?.name,
      hasOnChange: typeof field?.onChange === 'function'
    });
    return (
      <div className="space-y-2">
        <Label className="text-gray-300">Senha</Label>
        <div className="text-red-500 text-sm p-2 bg-red-100 rounded">
          Erro: Campo de senha não foi inicializado corretamente
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Senha</Label>
      <div className="relative">
        <Input
          name={field.name}
          value={field.value || ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-10 bg-gray-900/60 border-gray-700 text-white"
          placeholder="Digite sua senha"
          disabled={disabled}
        />
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={toggleVisibility}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
