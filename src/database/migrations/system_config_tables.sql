-- Criação da tabela para armazenar chaves de API
CREATE TABLE IF NOT EXISTS system_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name VARCHAR(50) NOT NULL UNIQUE,
  key_value TEXT NOT NULL, -- Valor criptografado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários para documentação
COMMENT ON TABLE system_api_keys IS 'Armazena chaves de API criptografadas para serviços externos';
COMMENT ON COLUMN system_api_keys.key_name IS 'Nome/identificador da chave (ex: google_maps, openai)';
COMMENT ON COLUMN system_api_keys.key_value IS 'Valor da chave criptografado';

-- Criação da tabela para configurações de webhooks
CREATE TABLE IF NOT EXISTS system_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event VARCHAR(50) NOT NULL UNIQUE,
  url TEXT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários para documentação
COMMENT ON TABLE system_webhooks IS 'Configurações de webhooks para notificações de eventos do sistema';
COMMENT ON COLUMN system_webhooks.event IS 'Identificador do evento (ex: new_occurrence, alert_created)';
COMMENT ON COLUMN system_webhooks.url IS 'URL do endpoint do webhook (ex: n8n, Zapier)';
COMMENT ON COLUMN system_webhooks.enabled IS 'Se o webhook está ativo para este evento';

-- Criação da tabela para log de notificações enviadas
CREATE TABLE IF NOT EXISTS webhook_notification_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event VARCHAR(50) NOT NULL,
  webhook_id UUID REFERENCES system_webhooks(id),
  status BOOLEAN NOT NULL, -- true = sucesso, false = falha
  status_code INTEGER,
  response_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários para documentação
COMMENT ON TABLE webhook_notification_log IS 'Registro de notificações enviadas via webhook';
COMMENT ON COLUMN webhook_notification_log.event IS 'Evento que gerou a notificação';
COMMENT ON COLUMN webhook_notification_log.webhook_id IS 'Referência ao webhook configurado';
COMMENT ON COLUMN webhook_notification_log.status IS 'Se o envio foi bem-sucedido';
COMMENT ON COLUMN webhook_notification_log.status_code IS 'Código de status HTTP da resposta';
COMMENT ON COLUMN webhook_notification_log.response_message IS 'Mensagem de resposta ou erro';

-- Políticas de segurança RLS (Row Level Security)
-- Apenas administradores podem acessar essas tabelas

-- Habilitar RLS para todas as tabelas
ALTER TABLE system_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_notification_log ENABLE ROW LEVEL SECURITY;

-- Criar políticas para system_api_keys
CREATE POLICY admin_api_keys ON system_api_keys
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'perfil' = 'Administrador');

-- Criar políticas para system_webhooks
CREATE POLICY admin_webhooks ON system_webhooks
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'perfil' = 'Administrador');

-- Criar políticas para webhook_notification_log
CREATE POLICY admin_webhook_logs ON webhook_notification_log
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'perfil' = 'Administrador');

-- Criar políticas de leitura para usuários autenticados (apenas para log)
CREATE POLICY read_webhook_logs ON webhook_notification_log
  FOR SELECT
  TO authenticated
  USING (true);
