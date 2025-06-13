// Follow this setup guide to integrate the Deno runtime and use Edge Functions:
// https://docs.supabase.com/docs/guides/functions/getting-started

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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
        JSON.stringify({ error: 'Acesso negado. Apenas administradores podem testar configurações de email.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Buscando configurações de email
    const { data: emailConfig, error: emailConfigError } = await supabaseClient
      .from('system_email_config')
      .select('*')
      .single()

    if (emailConfigError || !emailConfig) {
      return new Response(
        JSON.stringify({ error: 'Configurações de email não encontradas' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Descriptografando a senha
    let password = emailConfig.password;
    try {
      // Aqui você implementaria a descriptografia real
      // Por enquanto, estamos usando a senha como está (já que é base64 no systemConfigService)
      const buffer = Buffer.from(emailConfig.password, 'base64');
      password = buffer.toString();
    } catch (error) {
      console.error('Erro ao descriptografar senha:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao descriptografar senha' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Configurando o cliente SMTP
    const client = new SmtpClient();

    try {
      await client.connectTLS({
        hostname: emailConfig.host,
        port: parseInt(emailConfig.port),
        username: emailConfig.username,
        password: password,
      });

      // Enviando email de teste
      await client.send({
        from: emailConfig.from_email || emailConfig.username,
        to: user.email,
        subject: "Teste de Configuração de Email - GMC Sentinela",
        content: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #333;">Teste de Configuração de Email</h2>
                <p>Olá ${user.email},</p>
                <p>Este é um email de teste enviado pelo sistema GMC Sentinela para verificar se as configurações de email estão funcionando corretamente.</p>
                <p>Se você está recebendo este email, significa que a configuração foi bem-sucedida!</p>
                <p style="margin-top: 30px;">Atenciosamente,<br>Equipe GMC Sentinela</p>
              </div>
            </body>
          </html>
        `,
        html: true,
      });

      await client.close();

      // Registrando o teste bem-sucedido
      await supabaseClient
        .from('system_email_log')
        .insert({
          type: 'test',
          recipient: user.email,
          subject: 'Teste de Configuração de Email',
          status: true,
          created_at: new Date().toISOString()
        });

      return new Response(
        JSON.stringify({ success: true, message: 'Email de teste enviado com sucesso' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      
      // Registrando o erro
      await supabaseClient
        .from('system_email_log')
        .insert({
          type: 'test',
          recipient: user.email,
          subject: 'Teste de Configuração de Email',
          status: false,
          error_message: error.message || 'Erro desconhecido',
          created_at: new Date().toISOString()
        });
      
      return new Response(
        JSON.stringify({ success: false, error: error.message || 'Erro ao enviar email de teste' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
