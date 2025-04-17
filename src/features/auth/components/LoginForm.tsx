
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UsernameField } from "./UsernameField";
import { PasswordField } from "./PasswordField";
import { useLoginForm } from "../hooks/useLoginForm";
import { Loader2 } from "lucide-react";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import { useState } from "react";

export const LoginForm: React.FC = () => {
  const { form, isLoading, isCheckingSession, showPassword, togglePasswordVisibility, onSubmit } = useLoginForm();
  const { toast } = useToast();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  if (isCheckingSession) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-300">Verificando sessão...</p>
      </div>
    );
  }
  
  // Prevenir o envio do formulário via Enter se os campos não estiverem preenchidos
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!form.getValues('username') || !form.getValues('password'))) {
      e.preventDefault();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
        <UsernameField form={form} disabled={isLoading} />
        
        <PasswordField 
          form={form} 
          showPassword={showPassword} 
          togglePasswordVisibility={togglePasswordVisibility}
          disabled={isLoading}
        />
        
        <div className="text-right">
          <a 
            href="#" 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              setForgotPasswordOpen(true);
            }}
          >
            Esqueceu a senha?
          </a>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Autenticando...</span>
            </div>
          ) : "Entrar"}
        </Button>
      </form>
      
      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </Form>
  );
};
