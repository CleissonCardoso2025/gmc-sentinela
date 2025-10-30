/**
 * Serviço de Configuração de Ambiente
 * 
 * Este serviço gerencia as chaves de API e configurações sensíveis
 * através de variáveis de ambiente, garantindo segurança no deployment.
 * 
 * IMPORTANTE: Todas as chaves devem ser configuradas no Dokploy
 * através da seção "Environment Variables" do projeto.
 */

// ============================================
// GOOGLE MAPS API
// ============================================

/**
 * Obtém a chave da API do Google Maps
 * @returns A chave da API ou null se não configurada
 */
export const getGoogleMapsApiKey = (): string | null => {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!key || key.trim() === '') {
    console.warn('⚠️ Google Maps API Key não configurada. Configure VITE_GOOGLE_MAPS_API_KEY no Dokploy.');
    return null;
  }
  
  return key;
};

/**
 * Verifica se a chave do Google Maps está configurada
 * @returns true se a chave está configurada
 */
export const hasGoogleMapsKey = (): boolean => {
  return getGoogleMapsApiKey() !== null;
};

// ============================================
// OPENAI API
// ============================================

/**
 * Obtém a chave da API OpenAI
 * @returns A chave da API ou null se não configurada
 */
export const getOpenAIApiKey = (): string | null => {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!key || key.trim() === '') {
    console.warn('⚠️ OpenAI API Key não configurada. Configure VITE_OPENAI_API_KEY no Dokploy.');
    return null;
  }
  
  return key;
};

/**
 * Verifica se a chave da OpenAI está configurada
 * @returns true se a chave está configurada
 */
export const hasOpenAIKey = (): boolean => {
  return getOpenAIApiKey() !== null;
};

// ============================================
// EMAIL CONFIGURATION
// ============================================

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  fromName: string;
  enabled: boolean;
}

/**
 * Obtém a configuração de email das variáveis de ambiente
 * @returns Configuração de email ou null se não configurada
 */
export const getEmailConfig = (): EmailConfig | null => {
  const host = import.meta.env.VITE_EMAIL_HOST;
  const port = import.meta.env.VITE_EMAIL_PORT;
  const user = import.meta.env.VITE_EMAIL_USER;
  const password = import.meta.env.VITE_EMAIL_PASSWORD;
  const from = import.meta.env.VITE_EMAIL_FROM;
  const fromName = import.meta.env.VITE_EMAIL_FROM_NAME;

  // Verifica se as configurações mínimas estão presentes
  if (!host || !user || !password) {
    console.warn('⚠️ Configuração de email incompleta. Configure as variáveis VITE_EMAIL_* no Dokploy.');
    return null;
  }

  return {
    host,
    port: parseInt(port || '587', 10),
    user,
    password,
    from: from || user,
    fromName: fromName || 'GMC Sentinela',
    enabled: true
  };
};

/**
 * Verifica se o email está configurado
 * @returns true se o email está configurado
 */
export const hasEmailConfig = (): boolean => {
  return getEmailConfig() !== null;
};

// ============================================
// STATUS DE CONFIGURAÇÃO
// ============================================

export interface ConfigStatus {
  googleMaps: {
    configured: boolean;
    message: string;
  };
  openai: {
    configured: boolean;
    message: string;
  };
  email: {
    configured: boolean;
    message: string;
  };
}

/**
 * Obtém o status de todas as configurações
 * @returns Status de configuração de todas as integrações
 */
export const getConfigStatus = (): ConfigStatus => {
  const googleMapsConfigured = hasGoogleMapsKey();
  const openaiConfigured = hasOpenAIKey();
  const emailConfigured = hasEmailConfig();

  return {
    googleMaps: {
      configured: googleMapsConfigured,
      message: googleMapsConfigured 
        ? '✅ Configurada' 
        : '⚠️ Não configurada - Configure VITE_GOOGLE_MAPS_API_KEY no Dokploy'
    },
    openai: {
      configured: openaiConfigured,
      message: openaiConfigured 
        ? '✅ Configurada' 
        : '⚠️ Não configurada - Configure VITE_OPENAI_API_KEY no Dokploy'
    },
    email: {
      configured: emailConfigured,
      message: emailConfigured 
        ? '✅ Configurado' 
        : '⚠️ Não configurado - Configure as variáveis VITE_EMAIL_* no Dokploy'
    }
  };
};

// ============================================
// VALIDAÇÃO DE AMBIENTE
// ============================================

/**
 * Valida se todas as configurações obrigatórias estão presentes
 * @returns true se todas as configurações obrigatórias estão presentes
 */
export const validateRequiredConfig = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Configurações obrigatórias faltando! Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Dokploy.');
    return false;
  }

  return true;
};

/**
 * Exibe um relatório de configuração no console
 */
export const logConfigReport = (): void => {
  console.log('📋 Relatório de Configuração GMC Sentinela');
  console.log('==========================================');
  
  const status = getConfigStatus();
  
  console.log('🗺️  Google Maps:', status.googleMaps.message);
  console.log('🤖 OpenAI:', status.openai.message);
  console.log('📧 Email:', status.email.message);
  
  console.log('==========================================');
  
  if (!validateRequiredConfig()) {
    console.error('❌ ERRO: Configurações obrigatórias faltando!');
  } else {
    console.log('✅ Configurações obrigatórias OK');
  }
};
