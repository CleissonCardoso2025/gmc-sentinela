
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail } from "lucide-react";
import { isValidEmail } from "@/lib/utils";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setEmailError("");
    
    // Validate email
    if (!email.trim()) {
      setEmailError("O email é obrigatório");
      return;
    }
    
    if (!isValidEmail(email.trim())) {
      setEmailError("Email inválido");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Obter a URL completa para garantir o redirecionamento correto
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      
      console.log("Enviando solicitação de redefinição para:", email.trim());
      console.log("URL de redirecionamento:", redirectTo);
      
      // Call Supabase to send password reset email with explicit redirectTo
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectTo,
      });
      
      if (error) {
        console.error("Erro detalhado da API:", error);
        throw error;
      }
      
      // Show success
      toast({
        title: "Email enviado com sucesso",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
      
      setIsSubmitted(true);
      
    } catch (error: any) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      
      // Show error message to user
      toast({
        title: "Erro ao solicitar recuperação de senha",
        description: error.message || "Verifique seu email e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset form state on close
    if (!isLoading) {
      onOpenChange(false);
      
      // Delay the reset to avoid animation issues
      setTimeout(() => {
        setEmail("");
        setEmailError("");
        setIsSubmitted(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Recuperação de Senha</DialogTitle>
          <DialogDescription className="text-gray-400">
            {!isSubmitted 
              ? "Digite seu email para receber um link de recuperação de senha." 
              : "Verifique seu email para concluir a recuperação da senha."}
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  className="pl-10 bg-gray-800/60 border-gray-700 text-white"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Enviando...</span>
                </div>
              ) : "Enviar link de recuperação"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-800 rounded-md p-4 text-blue-300">
              <p className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Email de recuperação enviado para <strong>{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </span>
              </p>
            </div>
            
            <Button 
              type="button" 
              onClick={handleClose}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
