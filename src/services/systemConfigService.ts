import { supabase } from '@/integrations/supabase/client';
import { WebhookConfig, ApiKeyConfig } from '@/types/system-config';

// Funções simplificadas de criptografia (temporárias até resolver o import)
function encrypt(text: string): string {
  // Implementação básica para fins de demonstração
  const buffer = Buffer.from(text);
  return buffer.toString('base64');
}

function decrypt(encryptedText: string): string {
  // Implementação básica para fins de demonstração
  try {
    const buffer = Buffer.from(encryptedText, 'base64');
    return buffer.toString();
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return '';
  }
}

// Interfaces movidas para @/types/system-config.ts

// Função para obter todas as configurações de webhooks
export const getWebhookConfigs = async (): Promise<WebhookConfig[]> => {
  try {
    // Usando supabase sem tipagem forte para acessar tabelas não reconhecidas pelo TypeScript
    const { data, error } = await (supabase as any)
      .from('system_webhooks')
      .select('*')
      .order('event', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar configurações de webhook:', error);
    return []; // Retorna array vazio em caso de erro para evitar quebrar a UI
  }
};

// Função para obter uma chave de API específica
export const getApiKey = async (keyName: string): Promise<string | null> => {
  try {
    // Usando supabase sem tipagem forte para acessar tabelas não reconhecidas pelo TypeScript
    const { data, error } = await (supabase as any)
      .from('system_api_keys')
      .select('key_value')
      .eq('key_name', keyName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Chave não encontrada
        return null;
      }
      console.error(`Erro ao buscar chave de API ${keyName}:`, error);
      return null; // Retorna null em caso de erro para evitar quebrar a UI
    }

    // Descriptografa a chave antes de retornar
    return data?.key_value ? decrypt(data.key_value) : null;
  } catch (error) {
    console.error(`Erro ao buscar chave de API ${keyName}:`, error);
    return null; // Retorna null em caso de erro para evitar quebrar a UI
  }
};

// Função para salvar uma chave de API (nova ou atualizar existente)
export const saveApiKey = async (keyName: string, keyValue: string): Promise<boolean> => {
  try {
    // Criptografa a chave antes de salvar
    const encryptedKey = encrypt(keyValue);

    // Verifica se a chave já existe
    const { data, error: selectError } = await (supabase as any)
      .from('system_api_keys')
      .select('id')
      .eq('key_name', keyName)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error(`Erro ao verificar chave existente ${keyName}:`, selectError);
      return false;
    }

    if (data?.id) {
      // Atualiza a chave existente
      const { error } = await (supabase as any)
        .from('system_api_keys')
        .update({ 
          key_value: encryptedKey,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) {
        console.error(`Erro ao atualizar chave de API ${keyName}:`, error);
        return false;
      }
    } else {
      // Insere uma nova chave
      const { error } = await (supabase as any)
        .from('system_api_keys')
        .insert({
          key_name: keyName,
          key_value: encryptedKey,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error(`Erro ao inserir chave de API ${keyName}:`, error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao salvar chave de API ${keyName}:`, error);
    return false;
  }
};

// Função para salvar configuração de webhook
export const saveWebhookConfig = async (webhook: WebhookConfig): Promise<boolean> => {
  try {
    // Verifica se o webhook já existe para este evento
    const { data, error: selectError } = await (supabase as any)
      .from('system_webhooks')
      .select('id')
      .eq('event', webhook.event)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error(`Erro ao verificar webhook existente ${webhook.event}:`, selectError);
      return false;
    }

    if (data?.id) {
      // Atualiza o webhook existente
      const { error } = await (supabase as any)
        .from('system_webhooks')
        .update({ 
          url: webhook.url,
          enabled: webhook.enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) {
        console.error(`Erro ao atualizar webhook ${webhook.event}:`, error);
        return false;
      }
    } else {
      // Insere um novo webhook
      const { error } = await (supabase as any)
        .from('system_webhooks')
        .insert({
          event: webhook.event,
          url: webhook.url,
          enabled: webhook.enabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error(`Erro ao inserir webhook ${webhook.event}:`, error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao salvar configuração de webhook para evento ${webhook.event}:`, error);
    return false;
  }
};

// Função para enviar uma notificação via webhook
export const sendWebhookNotification = async (
  event: string, 
  payload: any
): Promise<boolean> => {
  try {
    // Busca a configuração do webhook para este evento
    const { data, error } = await (supabase as any)
      .from('system_webhooks')
      .select('url, enabled, id')
      .eq('event', event)
      .single();

    if (error) {
      console.error(`Erro ao buscar configuração de webhook para ${event}:`, error);
      return false;
    }

    // Se o webhook não estiver habilitado ou não houver URL, não envia
    if (!data || !data.enabled || !data.url) {
      return false;
    }

    // Envia a notificação para o webhook
    let statusCode: number | null = null;
    let responseMessage: string | null = null;
    let success = false;
    
    try {
      const response = await fetch(data.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-GCM-Webhook-Event': event,
        },
        body: JSON.stringify({
          event,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      });
      
      statusCode = response.status;
      responseMessage = response.statusText;
      success = response.ok;
    } catch (fetchError: any) {
      statusCode = 0;
      responseMessage = fetchError.message || 'Erro de conexão';
      success = false;
    }
    
    // Registra o log da notificação
    try {
      await (supabase as any)
        .from('webhook_notification_log')
        .insert({
          event,
          webhook_id: data.id,
          status: success,
          status_code: statusCode,
          response_message: responseMessage,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Erro ao registrar log de notificação:', logError);
      // Não falha se o log falhar
    }

    return success;
  } catch (error) {
    console.error(`Erro ao enviar notificação webhook para evento ${event}:`, error);
    return false;
  }
};

// Função para testar um webhook
export const testWebhook = async (event: string, url: string): Promise<boolean> => {
  try {
    if (!url.startsWith('https://')) {
      console.error('URL de webhook deve usar HTTPS por segurança');
      return false;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-GCM-Webhook-Event': event,
        'X-GCM-Webhook-Test': 'true',
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        test: true,
        message: `Teste de webhook para o evento: ${event}`,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error(`Erro ao testar webhook para evento ${event}:`, error);
    return false;
  }
};
