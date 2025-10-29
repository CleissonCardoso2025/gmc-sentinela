# 🗄️ CRIAR TABELA system_api_keys

## 🎯 PROBLEMA

**Erro**: `relation "system_api_keys" does not exist`

**Causa**: A tabela não existe no banco de dados.

---

## ✅ SOLUÇÃO (3 minutos)

### **Passo 1: Acessar Supabase Dashboard**

1. Abra: https://supabase.com/dashboard
2. Faça login
3. Selecione o projeto: **gmc-Ribeiradopombal**

### **Passo 2: SQL Editor**

1. Menu lateral → **SQL Editor**
2. Clique em **New Query**

### **Passo 3: Criar a Tabela**

Copie e cole TODO o conteúdo do arquivo: **`create_system_api_keys_table.sql`**

Ou copie este SQL:

```sql
-- Criar a tabela
CREATE TABLE IF NOT EXISTS system_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key_name TEXT NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE system_api_keys IS 'Armazena chaves de API criptografadas';
COMMENT ON COLUMN system_api_keys.key_name IS 'Nome da chave (ex: google_maps, openai)';
COMMENT ON COLUMN system_api_keys.key_value IS 'Valor da chave criptografado em Base64';

-- Habilitar RLS
ALTER TABLE system_api_keys ENABLE ROW LEVEL SECURITY;

-- Criar política permissiva
CREATE POLICY "Usuários autenticados podem gerenciar chaves"
ON system_api_keys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_system_api_keys_key_name ON system_api_keys(key_name);
```

4. Clique em **Run** (Executar)
5. Aguarde: "Success. No rows returned"

### **Passo 4: Verificar**

Execute esta query para verificar:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'system_api_keys'
ORDER BY ordinal_position;
```

**Resultado esperado**:
```
id          | uuid                     | NO
key_name    | text                     | NO
key_value   | text                     | NO
created_at  | timestamp with time zone | YES
updated_at  | timestamp with time zone | YES
```

### **Passo 5: Testar na Aplicação**

1. Volte para: http://localhost:8080
2. **Configurações > Integrações com APIs > Google Maps**
3. Digite uma chave de teste: `AIzaSyTest123456789`
4. Clique em **Salvar Chave**
5. ✅ Deve funcionar agora!

---

## 📊 ESTRUTURA DA TABELA

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único (gerado automaticamente) |
| `key_name` | TEXT | Nome da chave (ex: `google_maps`, `openai`) |
| `key_value` | TEXT | Valor criptografado em Base64 |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data da última atualização |

**Constraints**:
- ✅ `key_name` é UNIQUE (não permite duplicatas)
- ✅ `key_name` e `key_value` são NOT NULL (obrigatórios)

---

## 🔐 SEGURANÇA (RLS)

**Política criada**:
```sql
"Usuários autenticados podem gerenciar chaves"
- FOR ALL (SELECT, INSERT, UPDATE, DELETE)
- TO authenticated (apenas usuários logados)
- USING (true) (sem restrições de leitura)
- WITH CHECK (true) (sem restrições de escrita)
```

**Isso significa**:
- ✅ Usuários autenticados podem fazer tudo
- ❌ Usuários não autenticados são bloqueados
- ✅ RLS está habilitado

---

## 🎯 EXEMPLO DE USO

Após criar a tabela, você pode:

### Inserir uma chave:
```sql
INSERT INTO system_api_keys (key_name, key_value)
VALUES ('google_maps', 'QUl6YVN5VGVzdDEyMzQ1Njc4OQ==');
```

### Consultar chaves:
```sql
SELECT key_name, created_at FROM system_api_keys;
```

### Atualizar uma chave:
```sql
UPDATE system_api_keys 
SET key_value = 'Tm92YUNoYXZl', updated_at = NOW()
WHERE key_name = 'google_maps';
```

---

## 🆘 SE DER ERRO

### Erro: "permission denied for schema public"
**Solução**: Você precisa estar logado como proprietário do banco.

### Erro: "uuid_generate_v4() does not exist"
**Solução**: Execute antes:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Erro: "relation already exists"
**Solução**: A tabela já existe! Pule para o Passo 4 (Verificar).

---

## ✅ CHECKLIST

- [ ] 1. Acessei o Supabase Dashboard
- [ ] 2. Abri o SQL Editor
- [ ] 3. Copiei o script create_system_api_keys_table.sql
- [ ] 4. Colei no editor
- [ ] 5. Executei (Run)
- [ ] 6. Vi "Success"
- [ ] 7. Verifiquei a estrutura da tabela
- [ ] 8. Testei na aplicação
- [ ] 9. Salvei a chave com sucesso ✅

---

**Tempo estimado**: 3 minutos  
**Dificuldade**: ⭐ Muito Fácil  
**Última atualização**: 29/10/2025 17:15

**Execute o script e teste!** 🚀🗄️
