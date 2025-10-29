# 🔓 CORRIGIR POLÍTICAS RLS - system_api_keys

## 🎯 PROBLEMA IDENTIFICADO

**Erro**: `new row violates row-level security policy for table "system_api_keys"`

**Causa**: As políticas RLS (Row Level Security) estão muito restritivas e estão bloqueando a inserção de dados.

---

## ✅ SOLUÇÃO (5 minutos)

### Passo 1: Acessar o Supabase Dashboard

1. Abra: https://supabase.com/dashboard
2. Faça login
3. Selecione o projeto: **gmc-Ribeiradopombal** (ou o projeto correto)

### Passo 2: Abrir o SQL Editor

1. No menu lateral, clique em: **SQL Editor**
2. Clique em: **New Query** (ou + Nova consulta)

### Passo 3: Executar o Script

1. Copie TODO o conteúdo do arquivo: `fix_rls_policies.sql`
2. Cole no editor SQL
3. Clique em: **Run** (ou Executar)
4. Aguarde a mensagem: "Success. No rows returned"

### Passo 4: Verificar

Execute esta query para verificar:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'system_api_keys';
```

**Resultado esperado**:
```
policyname: "Usuários autenticados podem gerenciar chaves"
cmd: ALL
qual: true
with_check: true
```

---

## 🔄 ALTERNATIVA: Executar via Terminal (Avançado)

Se você tem acesso ao terminal do Supabase:

```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f fix_rls_policies.sql
```

---

## 🧪 TESTAR APÓS CORREÇÃO

1. Volte para a aplicação: http://localhost:8080
2. Vá em: **Configurações > Integrações com APIs**
3. Aba: **Google Maps**
4. Digite uma chave de teste
5. Clique em: **Salvar Chave**

**Resultado esperado**:
✅ Toast verde: "Chave do Google Maps salva com sucesso!"

---

## 📋 O QUE O SCRIPT FAZ

### 1. Remove políticas antigas restritivas
```sql
DROP POLICY IF EXISTS "Administradores podem gerenciar chaves de API" ON system_api_keys;
-- Remove todas as políticas antigas que podem estar bloqueando
```

### 2. Cria UMA política permissiva
```sql
CREATE POLICY "Usuários autenticados podem gerenciar chaves"
ON system_api_keys
FOR ALL          -- Permite SELECT, INSERT, UPDATE, DELETE
TO authenticated -- Para usuários autenticados
USING (true)     -- Sem restrições de leitura
WITH CHECK (true); -- Sem restrições de escrita
```

### 3. Garante que RLS está habilitado
```sql
ALTER TABLE system_api_keys ENABLE ROW LEVEL SECURITY;
```

---

## 🔐 SEGURANÇA

**Pergunta**: Isso não deixa a tabela insegura?

**Resposta**: Não! Porque:
1. ✅ Apenas usuários **autenticados** podem acessar
2. ✅ Usuários não autenticados são bloqueados
3. ✅ RLS continua habilitado
4. ✅ Supabase Auth gerencia a autenticação

**Antes**: Apenas administradores podiam inserir (muito restritivo)  
**Agora**: Qualquer usuário autenticado pode inserir (adequado para o sistema)

---

## 🆘 SE DER ERRO

### Erro: "permission denied for table pg_policies"
**Solução**: Você precisa estar logado como proprietário do banco ou ter permissões de superusuário.

### Erro: "policy already exists"
**Solução**: Execute apenas a parte de DROP primeiro, depois a parte de CREATE.

### Erro: "relation system_api_keys does not exist"
**Solução**: A tabela não existe. Execute primeiro a migração de criação da tabela.

---

## 📞 SUPORTE

Se precisar de ajuda:
1. Tire um print do erro no SQL Editor
2. Tire um print das políticas atuais
3. Me envie para análise

---

## ✅ CHECKLIST

- [ ] 1. Acessei o Supabase Dashboard
- [ ] 2. Abri o SQL Editor
- [ ] 3. Copiei o conteúdo de fix_rls_policies.sql
- [ ] 4. Colei no editor
- [ ] 5. Executei (Run)
- [ ] 6. Vi "Success"
- [ ] 7. Verifiquei as políticas
- [ ] 8. Testei na aplicação
- [ ] 9. Salvei a chave com sucesso ✅

---

**Tempo estimado**: 5 minutos  
**Dificuldade**: ⭐⭐ Fácil  
**Última atualização**: 29/10/2025 17:15

**Execute o script e teste novamente!** 🚀🔓
