-- Habilitar a extensão uuid-ossp se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criação da tabela para registrar atualizações de variáveis de ambiente
CREATE TABLE IF NOT EXISTS system_env_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) NOT NULL,
  updated_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários para documentação
COMMENT ON TABLE system_env_updates IS 'Registra atualizações de variáveis de ambiente';
COMMENT ON COLUMN system_env_updates.key IS 'Nome da variável de ambiente atualizada';
COMMENT ON COLUMN system_env_updates.updated_by IS 'ID do usuário que atualizou a variável';

-- Configurar políticas de segurança (RLS)
ALTER TABLE system_env_updates ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas administradores acessarem os registros
CREATE POLICY admin_env_updates ON system_env_updates
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
