
import React from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  value, 
  onChange, 
  onBlur, 
  error,
  disabled 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limpar espaços e caracteres especiais no final do email durante a digitação
    const newValue = e.target.value.trim();
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">Usuário</FormLabel>
      <div className="relative">
        <Input 
          value={value || ''} 
          className="pl-10 bg-gray-900/60 border-gray-700 text-white" 
          placeholder="Digite seu usuário"
          disabled={disabled}
          onBlur={onBlur}
          onChange={handleInputChange}
        />
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
      {error && <FormMessage className="text-red-400">{error}</FormMessage>}
    </div>
  );
};
