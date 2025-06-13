-- Habilitar a extensão uuid-ossp se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criação da tabela para armazenar configurações de email
CREATE TABLE IF NOT EXISTS system_email_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL DEFAULT 'smtp',
  host VARCHAR(255) NOT NULL,
  port VARCHAR(10) NOT NULL DEFAULT '587',
  username VARCHAR(255) NOT NULL,
  password TEXT NOT NULL, -- Valor criptografado
  from_email VARCHAR(255),
  from_name VARCHAR(255) DEFAULT 'GMC Sentinela',
  secure BOOLEAN DEFAULT TRUE,
  enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários para documentação
COMMENT ON TABLE system_email_config IS 'Armazena configurações do serviço de email';
COMMENT ON COLUMN system_email_config.provider IS 'Provedor do serviço de email (smtp, sendgrid, etc)';
COMMENT ON COLUMN system_email_config.host IS 'Servidor SMTP';
COMMENT ON COLUMN system_email_config.port IS 'Porta do servidor SMTP';
COMMENT ON COLUMN system_email_config.username IS 'Nome de usuário para autenticação';
COMMENT ON COLUMN system_email_config.password IS 'Senha criptografada';
COMMENT ON COLUMN system_email_config.from_email IS 'Email de origem para envio';
COMMENT ON COLUMN system_email_config.from_name IS 'Nome de exibição para o remetente';
COMMENT ON COLUMN system_email_config.secure IS 'Se deve usar conexão segura (SSL/TLS)';
COMMENT ON COLUMN system_email_config.enabled IS 'Se o serviço de email está ativado';

-- Configurar políticas de segurança (RLS)
ALTER TABLE system_email_config ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas administradores acessarem as configurações de email
CREATE POLICY admin_email_config ON system_email_config
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
