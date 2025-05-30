
import React from "react";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { UsernameField } from "./UsernameField";
import { PasswordField } from "./PasswordField";
import { Loader2 } from "lucide-react";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

export const LoginForm = () => {
  const { form, isFormReady, isLoading, showPassword, togglePasswordVisibility, onSubmit } = useLoginForm();
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);

  console.log("LoginForm: Rendering with form ready:", isFormReady, "isLoading:", isLoading);

  // Show loading state until form is completely ready
  if (!isFormReady || !form) {
    console.log("LoginForm: Form not ready, showing loading state");
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-lg">Inicializando formulário...</span>
        </div>
      </div>
    );
  }

  console.log("LoginForm: Form is ready, rendering login form");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => {
              console.log("LoginForm: Rendering username field with field:", !!field);
              return (
                <UsernameField 
                  field={field}
                  disabled={isLoading}
                  error={fieldState?.error?.message}
                />
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => {
              console.log("LoginForm: Rendering password field with field:", !!field);
              return (
                <PasswordField
                  field={field}
                  showPassword={showPassword}
                  toggleVisibility={togglePasswordVisibility}
                  disabled={isLoading}
                  error={fieldState?.error?.message}
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
