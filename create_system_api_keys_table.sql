-- =====================================================
-- CRIAR TABELA system_api_keys DO ZERO
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query > Cole e Execute
-- =====================================================

-- 1. Criar a tabela
CREATE TABLE IF NOT EXISTS system_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name TEXT NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar comentários
COMMENT ON TABLE system_api_keys IS 'Armazena chaves de API criptografadas (Google Maps, OpenAI, etc)';
COMMENT ON COLUMN system_api_keys.key_name IS 'Nome da chave (ex: google_maps, openai)';
COMMENT ON COLUMN system_api_keys.key_value IS 'Valor da chave criptografado em Base64';
COMMENT ON COLUMN system_api_keys.created_at IS 'Data de criação';
COMMENT ON COLUMN system_api_keys.updated_at IS 'Data da última atualização';

-- 3. Habilitar RLS
ALTER TABLE system_api_keys ENABLE ROW LEVEL SECURITY;

-- 4. Criar política PERMISSIVA
CREATE POLICY "Usuários autenticados podem gerenciar chaves"
ON system_api_keys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_system_api_keys_key_name ON system_api_keys(key_name);

-- =====================================================
-- VERIFICAÇÃO (execute após o script acima)
-- =====================================================
-- Copie e execute para verificar:
/*
-- Ver estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'system_api_keys'
ORDER BY ordinal_position;

-- Ver políticas RLS
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'system_api_keys';
*/

-- =====================================================
-- SUCESSO!
-- =====================================================
-- Após executar, você verá:
-- "Success. No rows returned"
-- 
-- Agora volte para a aplicação e teste salvar a chave!
-- =====================================================
