
import { z } from "zod";

// Define form schema with validation
export const loginFormSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
