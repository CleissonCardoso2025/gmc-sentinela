
import React from "react";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { UsernameField } from "./UsernameField";
import { PasswordField } from "./PasswordField";
import { Loader2 } from "lucide-react";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

export const LoginForm = () => {
  const { form, isLoading, showPassword, togglePasswordVisibility, onSubmit } = useLoginForm();
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);

  // Debug logging para o estado do formulário
  console.log("LoginForm render:", {
    formExists: !!form,
    isLoading,
    showPassword,
    formMethods: form ? {
      control: !!form.control,
      register: !!form.register,
      formState: !!form.formState,
      handleSubmit: !!form.handleSubmit
    } : null
  });

  // Safety check para o objeto form
  if (!form) {
    console.error("LoginForm: form object is undefined");
    return <div className="text-red-500">Erro: Formulário não inicializado</div>;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <UsernameField 
                name="username"
                disabled={isLoading}
              />
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <PasswordField
                name="password"
                showPassword={showPassword}
                toggleVisibility={togglePasswordVisibility}
                disabled={isLoading}
              />
            )}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm text-blue-400 hover:text-blue-300"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Esqueceu a senha?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Entrando...</span>
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Form>

      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </>
  );
};
