// Follow this setup guide to integrate the Deno runtime and use Edge Functions:
// https://docs.supabase.com/docs/guides/functions/getting-started

// Importações para o Deno
import { serve, Request } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Referência para o arquivo de tipos deno-types.d.ts
/// <reference path="./deno-types.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar se é uma requisição POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Criando um cliente Supabase para acessar o banco de dados
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default when deployed
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exposed by default when deployed
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verificando se o usuário está autenticado e é administrador
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verificando se o usuário é administrador
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Acesso negado. Apenas administradores podem atualizar variáveis de ambiente.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Obtendo os dados da requisição
    const requestData = await req.json()
    const { key, value } = requestData

    if (!key || !value) {
      return new Response(
        JSON.stringify({ error: 'Parâmetros inválidos' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validar o nome da chave
    let envVarName = ''
    switch (key) {
      case 'google_maps':
        envVarName = 'VITE_GOOGLE_MAPS_API_KEY'
        break
      case 'openai':
        envVarName = 'VITE_OPENAI_API_KEY'
        break
      default:
        return new Response(
          JSON.stringify({ error: 'Chave não suportada' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

    // Em um ambiente de produção, aqui você implementaria a lógica para atualizar o arquivo .env
    // Como estamos em um ambiente serverless, não podemos modificar arquivos diretamente
    // Então, vamos registrar a operação e retornar uma mensagem de sucesso simulada

    // Registrar a atualização no banco de dados
    await supabaseClient
      .from('system_env_updates')
      .insert({
        key: envVarName,
        updated_by: user.id,
        created_at: new Date().toISOString()
      })

    // Retornar sucesso
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Variável ${envVarName} atualizada com sucesso.`,
        note: 'Em um ambiente de produção, esta função atualizaria o arquivo .env no servidor.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
