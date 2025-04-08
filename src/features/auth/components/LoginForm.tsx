
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UsernameField } from "./UsernameField";
import { PasswordField } from "./PasswordField";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm: React.FC = () => {
  const { form, isLoading, showPassword, togglePasswordVisibility, onSubmit } = useLoginForm();
  const { toast } = useToast();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
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
              toast({
                title: "Recuperação de senha",
                description: "Funcionalidade em desenvolvimento",
              });
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
          {isLoading ? "Autenticando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
};
