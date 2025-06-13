// Declaração de tipos para módulos Deno
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export interface Request extends globalThis.Request {}
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export interface SupabaseClientOptions {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
    global?: {
      headers?: Record<string, string>;
    };
  }

  export interface User {
    id: string;
    app_metadata: Record<string, any>;
    user_metadata: Record<string, any>;
    aud: string;
    email?: string;
  }

  export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    user: User;
  }

  export interface AuthResponse {
    data: {
      user: User | null;
      session: Session | null;
    };
    error: Error | null;
  }

  export interface SupabaseClient {
    auth: {
      getUser(jwt?: string): Promise<AuthResponse>;
      getSession(): Promise<AuthResponse>;
    };
    from(table: string): {
      select(columns?: string): any;
      insert(values: any): any;
      update(values: any): any;
      delete(): any;
      eq(column: string, value: any): any;
      single(): any;
    };
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions
  ): SupabaseClient;
}

// Declaração do namespace Deno global
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
  }
  
  export const env: Env;
}
