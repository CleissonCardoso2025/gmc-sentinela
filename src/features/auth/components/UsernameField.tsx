
import React from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  value, 
  onChange, 
  onBlur, 
  disabled 
}) => {
  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">Usuário</FormLabel>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="pl-10 bg-gray-900/60 border-gray-700 text-white"
          placeholder="Digite seu email"
          disabled={disabled}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};
