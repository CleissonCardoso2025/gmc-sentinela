# 🔒 Guia de Segurança - GMC Sentinela

## ⚠️ IMPORTANTE: Proteção de Chaves de API

### 🚫 NUNCA Commitar Chaves de API no GitHub!

As chaves de API são **credenciais sensíveis** que dão acesso aos seus serviços. Se expostas publicamente, podem resultar em:
- ❌ Uso indevido dos seus serviços
- ❌ Cobranças inesperadas
- ❌ Comprometimento da segurança
- ❌ Acesso não autorizado aos seus dados

---

## ✅ Proteções Implementadas

### 1. **Arquivo `.gitignore`**
O arquivo `.gitignore` está configurado para **bloquear** todos os arquivos `.env`:

```gitignore
# Environment variables - NUNCA COMMITAR CHAVES DE API!
.env
.env.*
.env.local
.env.development
.env.development.local
.env.test
.env.test.local
.env.production
.env.production.local
*.env
*.env.*
```

### 2. **Armazenamento Seguro**
As chaves de API são armazenadas de forma **criptografada** no banco de dados Supabase:
- ✅ Criptografia Base64 (temporária)
- ✅ Row Level Security (RLS) habilitado
- ✅ Acesso restrito apenas a administradores
- ✅ Logs de auditoria de alterações

### 3. **Arquivo `.env.example`**
Use o arquivo `.env.example` como **modelo** (sem valores reais):
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

---

## 📋 Como Configurar Chaves de API com Segurança

### **Opção 1: Via Interface (Recomendado)**

1. Acesse **Configurações > Integrações com APIs**
2. Selecione a aba **Google Maps** ou **OpenAI**
3. Digite sua chave de API
4. Clique em **Salvar Chave**
5. A chave será criptografada e salva no banco de dados

### **Opção 2: Via Arquivo `.env` (Desenvolvimento Local)**

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas chaves:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...sua_chave_real
   VITE_OPENAI_API_KEY=sk-...sua_chave_real
   ```

3. **NUNCA** commite o arquivo `.env` no git!

---

## 🔍 Verificar se Chaves Foram Expostas

### **Antes de Commitar:**
```bash
# Verificar se há arquivos .env no staging
git status

# Verificar se há arquivos .env já commitados
git ls-files | findstr /i ".env"
```

### **Se Você Commitou uma Chave por Engano:**

1. **REVOGUE a chave imediatamente** no console do serviço (Google Cloud, OpenAI, etc.)
2. **Gere uma nova chave**
3. **Remova a chave do histórico do git**:
   ```bash
   # Remover arquivo do histórico (CUIDADO!)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (CUIDADO!)
   git push origin --force --all
   ```
4. **Configure a nova chave** via interface ou `.env`

---

## 🛡️ Boas Práticas de Segurança

### ✅ **Faça:**
- ✅ Use o arquivo `.env` apenas localmente
- ✅ Mantenha o `.gitignore` atualizado
- ✅ Revogue chaves antigas ao gerar novas
- ✅ Use variáveis de ambiente em produção
- ✅ Limite permissões das chaves de API
- ✅ Monitore uso das APIs regularmente
- ✅ Use HTTPS para todas as requisições
- ✅ Mantenha logs de auditoria

### ❌ **Não Faça:**
- ❌ Commitar arquivos `.env` no git
- ❌ Compartilhar chaves por email/chat
- ❌ Hardcodar chaves no código
- ❌ Usar a mesma chave em múltiplos projetos
- ❌ Deixar chaves antigas ativas
- ❌ Expor chaves em logs ou console
- ❌ Usar chaves de produção em desenvolvimento

---

## 🔐 Estrutura de Segurança do Banco de Dados

### **Tabela `system_api_keys`**
```sql
- id (UUID)
- key_name (text) - Nome da chave (ex: google_maps)
- key_value (text) - Valor criptografado
- created_at (timestamp)
- updated_at (timestamp)
```

### **Políticas RLS:**
- ✅ Apenas usuários autenticados podem acessar
- ✅ Apenas administradores podem modificar
- ✅ Valores sempre criptografados
- ✅ Logs de todas as alterações

---

## 📞 Em Caso de Exposição de Chaves

### **Ação Imediata:**
1. 🚨 **REVOGUE a chave imediatamente**
2. 🔑 **Gere uma nova chave**
3. 🗑️ **Remova do histórico do git**
4. 🔄 **Atualize em todos os ambientes**
5. 📊 **Monitore uso suspeito**
6. 📝 **Documente o incidente**

### **Contatos de Suporte:**
- **Google Maps API**: https://console.cloud.google.com/
- **OpenAI API**: https://platform.openai.com/
- **Supabase**: https://supabase.com/dashboard

---

## 📚 Recursos Adicionais

- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)
- [OpenAI API Security](https://platform.openai.com/docs/guides/safety-best-practices)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

---

**Última atualização:** 29 de Outubro de 2025

**Desenvolvido com 🔒 segurança em mente para a Guarda Municipal.**
