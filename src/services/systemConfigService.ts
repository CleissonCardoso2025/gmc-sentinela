import { supabase } from '@/integrations/supabase/client';
import { WebhookConfig, ApiKeyConfig, EmailConfig } from '@/types/system-config';

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
    console.log(`Buscando chave de API ${keyName}...`);
    
    // Primeiro verifica se a chave está no .env
    const envKey = getApiKeyFromEnv(keyName);
    if (envKey) {
      console.log(`Chave ${keyName} encontrada no .env: ${envKey.substring(0, 3)}...`);
      return envKey;
    }
    
    console.log(`Chave ${keyName} não encontrada no .env, buscando no banco de dados...`);

    // Se não estiver no .env, busca no banco de dados
    console.log(`Executando query: SELECT key_value FROM system_api_keys WHERE key_name = '${keyName}'`);
    
    const { data, error } = await (supabase as any)
      .from('system_api_keys')
      .select('key_value')
      .eq('key_name', keyName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`Chave ${keyName} não encontrada no banco de dados`);
        return null;
      }
      console.error(`Erro ao buscar chave de API ${keyName}:`, error);
      console.error('Detalhes do erro:', JSON.stringify(error));
      return null; // Retorna null em caso de erro para evitar quebrar a UI
    }

    if (!data) {
      console.log(`Nenhum dado retornado para chave ${keyName}`);
      return null;
    }
    
    if (!data.key_value) {
      console.log(`Chave ${keyName} encontrada, mas valor está vazio`);
      return null;
    }
    
    console.log(`Chave ${keyName} encontrada no banco de dados, descriptografando...`);
    
    try {
      // Descriptografa a chave antes de retornar
      const decryptedKey = decrypt(data.key_value);
      console.log(`Chave ${keyName} descriptografada com sucesso: ${decryptedKey.substring(0, 3)}...`);
      return decryptedKey;
    } catch (decryptError) {
      console.error(`Erro ao descriptografar chave ${keyName}:`, decryptError);
      return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar chave de API ${keyName}:`, error);
    return null; // Retorna null em caso de erro para evitar quebrar a UI
  }
};

// Função auxiliar para obter chaves de API do arquivo .env
const getApiKeyFromEnv = (keyName: string): string | null => {
  try {
    switch (keyName) {
      case 'openai':
        return import.meta.env.VITE_OPENAI_API_KEY || null;
      case 'google_maps':
        return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || null;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar chave ${keyName} do .env:`, error);
    return null;
  }
};

// Função para verificar se a tabela system_api_keys existe
const ensureApiKeysTableExists = async (): Promise<boolean> => {
  try {
    console.log('Verificando se a tabela system_api_keys existe...');
    
    // Verificar se a tabela existe tentando fazer uma consulta simples
    const { data: tableInfo, error: tableError } = await (supabase as any)
      .from('system_api_keys')
      .select('id')
      .limit(1);
      
    if (tableError) {
      console.error('Erro ao verificar tabela system_api_keys:', tableError);
      console.error('Código do erro:', tableError.code);
      console.error('Mensagem do erro:', tableError.message);
      
      // Se a tabela não existe ou não temos permissão, informar o usuário
      if (tableError.code === 'PGRST204' || tableError.code === '42P01') {
        console.error('A tabela system_api_keys não existe. Verifique se as migrações foram executadas.');
      } else if (tableError.code === '42501') {
        console.error('Você não tem permissão para acessar a tabela system_api_keys.');
      }
      
      return false;
    }
    
    console.log('Tabela system_api_keys verificada com sucesso.');
    return true;
  } catch (error) {
    console.error('Exceção ao verificar tabela system_api_keys:', error);
    return false;
  }
};

// Função para salvar uma chave de API (nova ou atualizar existente)
export const saveApiKey = async (keyName: string, keyValue: string): Promise<boolean> => {
  try {
    console.log(`Iniciando salvamento da chave ${keyName}...`);
    console.log(`Tipo de keyName: ${typeof keyName}, Valor: ${keyName}`);
    console.log(`Tipo de keyValue: ${typeof keyValue}, Tamanho: ${keyValue?.length || 0}`);
    console.log(`Supabase inicializado: ${!!supabase}`);
    console.log(`Ambiente: ${import.meta.env.MODE}`);
    
    // Verificar se a tabela system_api_keys existe e criá-la se necessário
    const tableExists = await ensureApiKeysTableExists();
    if (!tableExists) {
      console.error('Não foi possível garantir que a tabela system_api_keys existe.');
      return false;
    }
    
    if (!keyValue || keyValue.trim() === '') {
      console.error(`Valor da chave ${keyName} está vazio ou inválido`);
      return false;
    }
    
    // Criptografa a chave antes de salvar
    const encryptedKey = encrypt(keyValue);
    console.log(`Chave ${keyName} criptografada com sucesso`);

    // Verifica se a chave já existe
    console.log(`Verificando se a chave ${keyName} já existe...`);
    const { data, error: selectError } = await (supabase as any)
      .from('system_api_keys')
      .select('id')
      .eq('key_name', keyName)
      .single();

    if (selectError) {
      if (selectError.code !== 'PGRST116') {
        console.error(`Erro ao verificar chave existente ${keyName}:`, selectError);
        return false;
      } else {
        console.log(`Chave ${keyName} não encontrada, será criada uma nova`);
      }
    } else {
      console.log(`Chave ${keyName} encontrada com ID ${data?.id}, será atualizada`);
    }

    if (data?.id) {
      // Atualiza a chave existente
      console.log(`Atualizando chave existente ${keyName} com ID ${data.id}...`);
      console.log(`Dados a serem atualizados: key_value=[ENCRYPTED], updated_at=${new Date().toISOString()}`);
      
      try {
        const { data: updateData, error } = await (supabase as any)
          .from('system_api_keys')
          .update({ 
            key_value: encryptedKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id)
          .select();

        if (error) {
          console.error(`Erro ao atualizar chave de API ${keyName}:`, error);
          console.error('Detalhes do erro:', JSON.stringify(error));
          console.error('Código do erro:', error.code);
          console.error('Mensagem do erro:', error.message);
          console.error('Detalhes:', error.details);
          console.error('Dica: Verifique se a tabela system_api_keys existe e tem as colunas corretas');
          return false;
        }
        
        console.log(`Atualização bem-sucedida, dados retornados:`, updateData ? `ID: ${updateData[0]?.id}` : 'Nenhum dado retornado');
      } catch (updateError) {
        console.error(`Exceção ao atualizar chave de API ${keyName}:`, updateError);
        if (updateError instanceof Error) {
          console.error('Mensagem de erro:', updateError.message);
          console.error('Stack trace:', updateError.stack);
        }
        return false;
      }
      console.log(`Chave ${keyName} atualizada com sucesso`);
    } else {
      // Insere uma nova chave
      console.log(`Inserindo nova chave ${keyName}...`);
      console.log(`Dados a serem inseridos: key_name=${keyName}, key_value=[ENCRYPTED], created_at=${new Date().toISOString()}`);
      
      try {
        const { data, error } = await (supabase as any)
          .from('system_api_keys')
          .insert({
            key_name: keyName,
            key_value: encryptedKey,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error(`Erro ao inserir chave de API ${keyName}:`, error);
          console.error('Detalhes do erro:', JSON.stringify(error));
          console.error('Código do erro:', error.code);
          console.error('Mensagem do erro:', error.message);
          console.error('Detalhes:', error.details);
          console.error('Dica: Verifique se a tabela system_api_keys existe e tem as colunas corretas');
          return false;
        }
        
        console.log(`Inserção bem-sucedida, dados retornados:`, data ? `ID: ${data[0]?.id}` : 'Nenhum dado retornado');
      } catch (insertError) {
        console.error(`Exceção ao inserir chave de API ${keyName}:`, insertError);
        if (insertError instanceof Error) {
          console.error('Mensagem de erro:', insertError.message);
          console.error('Stack trace:', insertError.stack);
        }
        return false;
      }
      console.log(`Nova chave ${keyName} inserida com sucesso`);
    }
    
    // Atualiza o arquivo .env em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`Ambiente de desenvolvimento detectado, atualizando arquivo .env para ${keyName}...`);
      try {
        await updateEnvFile(keyName, keyValue);
        console.log(`Arquivo .env atualizado para ${keyName}`);
      } catch (envError) {
        console.warn(`Não foi possível atualizar o arquivo .env: ${envError}`);
        // Continua mesmo se falhar a atualização do .env
      }
    }
    
    console.log(`Chave ${keyName} salva com sucesso!`);
    return true;
  } catch (error) {
    console.error(`Erro ao salvar chave de API ${keyName}:`, error);
    if (error instanceof Error) {
      console.error('Mensagem de erro:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Erro desconhecido:', JSON.stringify(error));
    }
    return false;
  }
};

// Função para atualizar o arquivo .env
const updateEnvFile = async (keyName: string, keyValue: string): Promise<void> => {
  try {
    // Determinar o nome da variável de ambiente
    let envVarName = '';
    switch (keyName) {
      case 'google_maps':
        envVarName = 'VITE_GOOGLE_MAPS_API_KEY';
        break;
      case 'openai':
        envVarName = 'VITE_OPENAI_API_KEY';
        break;
      default:
        return;
    }
    
    console.log(`Atualizando variável de ambiente ${envVarName} em tempo de execução`);
    
    // Atualizar a variável de ambiente em tempo de execução
    // Isso não modifica o arquivo .env, mas permite usar o novo valor
    // até que a página seja recarregada
    (import.meta.env as any)[envVarName] = keyValue;
    
    // Chamar a Edge Function para atualizar o arquivo .env no servidor
    const edgeFunctionUrl = import.meta.env.VITE_EDGE_FUNCTION_URL || 'https://rdkugzjrvlvcorfsbdaz.supabase.co/functions/v1';
    
    console.log(`URL da Edge Function: ${edgeFunctionUrl}`);
    console.log(`Obtendo sessão do usuário para autenticar chamada à Edge Function`);
    
    // Obter o token de acesso de forma assíncrona
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao obter sessão do usuário:', sessionError);
      throw new Error(`Erro ao obter sessão: ${sessionError.message}`);
    }
    
    console.log('Sessão obtida:', sessionData ? 'Sim' : 'Não');
    console.log('Usuário autenticado:', sessionData?.session ? 'Sim' : 'Não');
    
    const accessToken = sessionData?.session?.access_token;
    
    if (!accessToken) {
      console.error('Usuário não autenticado, não é possível atualizar o arquivo .env');
      throw new Error('Usuário não autenticado');
    }
    
    console.log(`Token de acesso obtido (primeiros 10 caracteres): ${accessToken.substring(0, 10)}...`);
    
    console.log(`Chamando Edge Function update-env para atualizar ${keyName}`);
    console.log(`URL completa: ${edgeFunctionUrl}/update-env`);
    console.log(`Enviando dados: { key: ${envVarName}, value: [VALOR OCULTO] }`);
    
    try {
      const response = await fetch(`${edgeFunctionUrl}/update-env`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          key: envVarName,  // Enviar o nome da variável de ambiente, não o keyName
          value: keyValue 
        })
      });
      
      console.log(`Resposta recebida, status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Status: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += `, Erro: ${errorData.error || 'Desconhecido'}`;
          console.error('Detalhes do erro da Edge Function:', errorData);
        } catch (e) {
          errorMessage += `, Resposta: ${errorText.substring(0, 100)}`;
        }
        
        console.error(`Falha na chamada à Edge Function: ${errorMessage}`);
        throw new Error(`Falha ao atualizar arquivo .env: ${errorMessage}`);
      }
      
      // Tentar obter a resposta como JSON
      try {
        const responseData = await response.json();
        console.log('Resposta da Edge Function:', responseData);
      } catch (e) {
        console.log('Resposta da Edge Function não é JSON válido');
      }
    } catch (fetchError) {
      console.error('Erro ao chamar Edge Function:', fetchError);
      if (fetchError instanceof Error) {
        console.error('Mensagem de erro:', fetchError.message);
        console.error('Stack trace:', fetchError.stack);
      }
      throw fetchError;
    }
    
    console.log(`Chave ${keyName} salva no banco de dados e solicitada atualização no arquivo .env.`);
    console.info(`Variável ${envVarName} atualizada.`);
  } catch (error) {
    console.error('Erro ao tentar atualizar arquivo .env:', error);
    // Mostrar mensagem para o usuário atualizar manualmente
    let envVarName = '';
    switch (keyName) {
      case 'google_maps':
        envVarName = 'VITE_GOOGLE_MAPS_API_KEY';
        break;
      case 'openai':
        envVarName = 'VITE_OPENAI_API_KEY';
        break;
    }
    
    // Fornecer instruções detalhadas para atualização manual
    const manualInstructions = `
      Não foi possível atualizar o arquivo .env automaticamente.
      
      INSTRUÇÕES PARA ATUALIZAÇÃO MANUAL:
      1. Abra o arquivo .env na raiz do projeto
      2. Adicione ou atualize a seguinte linha:
         ${envVarName}=${keyValue}
      3. Salve o arquivo e reinicie a aplicação
      
      A chave foi salva com sucesso no banco de dados, mas o arquivo .env
      precisa ser atualizado manualmente para que a aplicação use a nova chave.
    `;
    
    console.warn(manualInstructions);
    
    // Não retornar erro, pois a chave foi salva no banco de dados
    // O usuário pode atualizar o arquivo .env manualmente
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

// Função para obter configuração de email
export const getEmailConfig = async (): Promise<EmailConfig | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('system_email_config')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Configuração não encontrada
        return null;
      }
      console.error('Erro ao buscar configuração de email:', error);
      return null;
    }

    // Descriptografar senha se existir
    if (data && data.password) {
      data.password = '••••••••••••••••'; // Não retornamos a senha real, apenas um placeholder
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar configuração de email:', error);
    return null;
  }
};

// Função para salvar configuração de email
export const saveEmailConfig = async (config: EmailConfig): Promise<boolean> => {
  try {
    // Verificar se já existe configuração
    const { data, error: selectError } = await (supabase as any)
      .from('system_email_config')
      .select('id')
      .single();

    // Criptografar senha se não for placeholder
    const passwordToSave = config.password?.includes('•') 
      ? undefined // Não atualiza se for placeholder
      : encrypt(config.password || '');

    if (data?.id) {
      // Atualizar configuração existente
      const updateData: any = {
        provider: config.provider,
        host: config.host,
        port: config.port,
        username: config.username,
        from_email: config.from_email,
        from_name: config.from_name,
        secure: config.secure,
        enabled: config.enabled,
        updated_at: new Date().toISOString()
      };

      // Só incluir senha se não for placeholder
      if (passwordToSave) {
        updateData.password = passwordToSave;
      }

      const { error } = await (supabase as any)
        .from('system_email_config')
        .update(updateData)
        .eq('id', data.id);

      if (error) {
        console.error('Erro ao atualizar configuração de email:', error);
        return false;
      }
    } else {
      // Inserir nova configuração
      const { error } = await (supabase as any)
        .from('system_email_config')
        .insert({
          provider: config.provider,
          host: config.host,
          port: config.port,
          username: config.username,
          password: passwordToSave,
          from_email: config.from_email,
          from_name: config.from_name,
          secure: config.secure,
          enabled: config.enabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao inserir configuração de email:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar configuração de email:', error);
    return false;
  }
};

// Função para testar configuração de email
export const testEmailConfig = async (): Promise<boolean> => {
  try {
    // Chamar uma função Edge Function ou API para testar o email
    const { data, error } = await (supabase as any).functions.invoke('test-email-config', {
      body: { test: true }
    });

    if (error) {
      console.error('Erro ao testar configuração de email:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('Erro ao testar configuração de email:', error);
    return false;
  }
};
