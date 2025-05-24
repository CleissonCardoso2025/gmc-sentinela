
import React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  showPassword: boolean;
  toggleVisibility: () => void;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = (props) => {
  const { value, onChange, onBlur, error, showPassword, toggleVisibility, disabled } = props;
  
  // Debug logging to check props
  console.log("PasswordField props:", { 
    value: !!value, 
    onChange: !!onChange, 
    showPassword, 
    disabled, 
    error 
  });

  // Safety checks for required functions
  if (!onChange) {
    console.error("PasswordField: onChange prop is missing");
    return null;
  }

  if (!toggleVisibility) {
    console.error("PasswordField: toggleVisibility prop is missing");
    return null;
  }
  
  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Senha</Label>
      <div className="relative">
        <Input 
          value={value || ""}
          onChange={(e) => {
            console.log("PasswordField onChange:", e.target.value ? "***" : "empty");
            onChange(e.target.value);
          }}
          onBlur={onBlur}
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
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};
