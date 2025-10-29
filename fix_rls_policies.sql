-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS - system_api_keys
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Dashboard > SQL Editor > New Query > Cole e Execute
-- =====================================================

-- 1. Remover todas as políticas antigas restritivas
DROP POLICY IF EXISTS "Administradores podem gerenciar chaves de API" ON system_api_keys;
DROP POLICY IF EXISTS "Apenas administradores podem acessar" ON system_api_keys;
DROP POLICY IF EXISTS "Admin access only" ON system_api_keys;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON system_api_keys;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON system_api_keys;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON system_api_keys;

-- 2. Criar UMA política permissiva para TODAS as operações
CREATE POLICY "Usuários autenticados podem gerenciar chaves"
ON system_api_keys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Verificar se RLS está habilitado
ALTER TABLE system_api_keys ENABLE ROW LEVEL SECURITY;

-- 4. Comentário explicativo
COMMENT ON POLICY "Usuários autenticados podem gerenciar chaves" ON system_api_keys IS 
'Permite que qualquer usuário autenticado possa inserir, atualizar, deletar e visualizar chaves de API';

-- =====================================================
-- VERIFICAÇÃO (execute após o script acima)
-- =====================================================
-- Copie e execute esta query para verificar:
/*
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'system_api_keys';
*/

-- Deve retornar:
-- policyname: "Usuários autenticados podem gerenciar chaves"
-- cmd: ALL
-- qual: true
-- with_check: true
