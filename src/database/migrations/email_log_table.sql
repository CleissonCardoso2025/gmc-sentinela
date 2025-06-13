-- Habilitar a extensão uuid-ossp se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criação da tabela para armazenar logs de emails enviados
CREATE TABLE IF NOT EXISTS system_email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- 'test', 'notification', 'alert', etc.
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários para documentação
COMMENT ON TABLE system_email_log IS 'Registra tentativas de envio de email pelo sistema';
COMMENT ON COLUMN system_email_log.type IS 'Tipo de email enviado (teste, notificação, alerta, etc)';
COMMENT ON COLUMN system_email_log.recipient IS 'Destinatário do email';
COMMENT ON COLUMN system_email_log.subject IS 'Assunto do email';
COMMENT ON COLUMN system_email_log.status IS 'Se o email foi enviado com sucesso';
COMMENT ON COLUMN system_email_log.error_message IS 'Mensagem de erro em caso de falha';

-- Configurar políticas de segurança (RLS)
ALTER TABLE system_email_log ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas administradores acessarem os logs de email
CREATE POLICY admin_email_log ON system_email_log
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
