
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

  console.log("LoginForm: Rendering with form:", !!form, "isLoading:", isLoading);

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
            render={({ field }) => {
              console.log("LoginForm: Rendering username field with:", !!field);
              return (
                <UsernameField 
                  field={field}
                  disabled={isLoading}
                />
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              console.log("LoginForm: Rendering password field with:", !!field);
              return (
                <PasswordField
                  field={field}
                  showPassword={showPassword}
                  toggleVisibility={togglePasswordVisibility}
                  disabled={isLoading}
                />
              );
            }}
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
