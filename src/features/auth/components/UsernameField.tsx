
import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface UsernameFieldProps {
  field: ControllerRenderProps<any, any>;
  disabled?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ 
  field,
  disabled = false
}) => {
  return (
    <FormItem>
      <Label className="text-gray-300">Usuário</Label>
      <FormControl>
        <div className="relative">
          <Input
            {...field}
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
