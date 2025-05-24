
import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  error?: string;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  value, 
  onChange, 
  onBlur, 
  disabled,
  error
}) => {
  // Debug logging to check props
  console.log("UsernameField props:", { value, onChange: !!onChange, disabled, error });

  // Safety check for onChange function
  if (!onChange) {
    console.error("UsernameField: onChange prop is missing");
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">Usuário</Label>
      <div className="relative">
        <Input
          value={value || ""}
          onChange={(e) => {
            console.log("UsernameField onChange:", e.target.value);
            onChange(e.target.value);
          }}
          onBlur={onBlur}
          className="pl-10 bg-gray-900/60 border-gray-700 text-white"
          placeholder="Digite seu email"
          disabled={disabled}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};
