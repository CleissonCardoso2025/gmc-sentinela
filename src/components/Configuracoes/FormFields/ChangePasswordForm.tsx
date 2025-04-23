
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import PasswordField from './PasswordField';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {
      current?: string;
      new?: string;
      confirm?: string;
    } = {};
    let isValid = true;

    if (!currentPassword) {
      newErrors.current = 'A senha atual é obrigatória';
      isValid = false;
    }

    if (!newPassword) {
      newErrors.new = 'A nova senha é obrigatória';
      isValid = false;
    } else if (newPassword.length < 6) {
      newErrors.new = 'A nova senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirm = 'Confirme sua nova senha';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirm = 'As senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Primeiro, verifica se a senha atual está correta
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: localStorage.getItem('userEmail') || '',
        password: currentPassword,
      });

      if (signInError) {
        setErrors({ current: 'Senha atual incorreta' });
        throw new Error('Senha atual incorreta');
      }

      // Depois, atualiza para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // Limpar os campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      toast({
        title: 'Senha alterada com sucesso',
        description: 'Sua senha foi atualizada.',
      });
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);

      toast({
        title: 'Erro ao alterar senha',
        description: error.message || 'Ocorreu um erro ao tentar alterar sua senha.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordField
        label="Senha atual"
        value={currentPassword}
        onChange={setCurrentPassword}
        error={errors.current}
        placeholder="Digite sua senha atual"
      />

      <PasswordField
        label="Nova senha"
        value={newPassword}
        onChange={setNewPassword}
        error={errors.new}
        placeholder="Digite sua nova senha"
      />

      <PasswordField
        label="Confirmar nova senha"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirm}
        placeholder="Confirme sua nova senha"
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Processando...</span>
          </div>
        ) : (
          'Alterar senha'
        )}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
