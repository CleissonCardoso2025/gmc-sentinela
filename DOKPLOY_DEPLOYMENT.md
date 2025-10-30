# 🚀 Guia de Deployment no Dokploy

Este guia explica como fazer o deploy do GMC Sentinela no Dokploy com todas as configurações necessárias.

## 📋 Pré-requisitos

- Conta no Dokploy
- Projeto Supabase configurado
- Chaves de API (Google Maps, OpenAI) - opcional

## 🔧 Configuração das Variáveis de Ambiente

### Variáveis Obrigatórias

Estas variáveis são essenciais para o funcionamento da aplicação:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Edge Functions
VITE_EDGE_FUNCTION_URL=https://seu-projeto.supabase.co/functions/v1

# Ambiente
NODE_ENV=production
```

### Variáveis Opcionais

Estas variáveis ativam funcionalidades adicionais:

```env
# Google Maps (para mapas e geolocalização)
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps

# OpenAI (para recursos de IA)
VITE_OPENAI_API_KEY=sua_chave_openai

# Email (para notificações por email)
VITE_EMAIL_HOST=smtp.gmail.com
VITE_EMAIL_PORT=587
VITE_EMAIL_USER=seu_email@gmail.com
VITE_EMAIL_PASSWORD=sua_senha_ou_app_password
VITE_EMAIL_FROM=noreply@seudominio.com
VITE_EMAIL_FROM_NAME=GMC Sentinela
```

## 📝 Passo a Passo no Dokploy

### 1. Criar Novo Projeto

1. Acesse o painel do Dokploy
2. Clique em "New Project"
3. Selecione "Git Repository"
4. Conecte seu repositório do GitHub/GitLab

### 2. Configurar Build

1. **Framework**: Selecione "Vite" ou "Static Site"
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

### 3. Adicionar Variáveis de Ambiente

1. No painel do projeto, vá em "Environment Variables"
2. Clique em "Add Variable"
3. Adicione cada variável listada acima
4. **IMPORTANTE**: Nunca commite o arquivo `.env` com valores reais no Git

#### Exemplo de Adição de Variável:

```
Key: VITE_SUPABASE_URL
Value: https://rdkugzjrvlvcorfsbdaz.supabase.co
```

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Acesse a URL fornecida pelo Dokploy

## 🔐 Segurança

### Boas Práticas

1. **Nunca commite chaves no Git**: O arquivo `.env` está no `.gitignore`
2. **Use variáveis de ambiente**: Todas as chaves sensíveis devem estar no Dokploy
3. **Rotacione chaves regularmente**: Troque suas chaves de API periodicamente
4. **Restrinja permissões**: Configure as chaves com o mínimo de permissões necessárias

### Verificação de Segurança

Antes do deploy, certifique-se de que:

- [ ] Arquivo `.env` não está commitado
- [ ] Todas as chaves estão configuradas no Dokploy
- [ ] Chaves de API têm restrições de domínio (quando possível)
- [ ] Senhas de email usam App Passwords (não senha principal)

## 📊 Verificação Pós-Deploy

Após o deploy, verifique:

1. **Acesso à aplicação**: A URL do Dokploy está acessível
2. **Conexão com Supabase**: Login funciona corretamente
3. **Status das APIs**: Vá em Configurações > Integrações para ver o status
4. **Console do navegador**: Não deve haver erros de configuração

### Verificar Status das Integrações

1. Faça login na aplicação
2. Vá em **Configurações** > **Integrações com APIs**
3. Verifique o status de cada integração:
   - ✅ Verde = Configurada corretamente
   - ⚠️ Amarelo = Não configurada (opcional)

## 🔄 Atualização de Variáveis

Para atualizar uma variável de ambiente:

1. Acesse o painel do Dokploy
2. Vá em "Environment Variables"
3. Edite a variável desejada
4. Clique em "Save"
5. **Importante**: Faça um redeploy para aplicar as mudanças

## 🆘 Troubleshooting

### Erro: "Supabase client not initialized"

**Solução**: Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas corretamente.

### Erro: "Google Maps não carrega"

**Solução**: 
1. Verifique se `VITE_GOOGLE_MAPS_API_KEY` está configurada
2. Confirme que a chave tem permissões para Maps JavaScript API
3. Adicione o domínio do Dokploy nas restrições da chave

### Erro: "OpenAI API error"

**Solução**:
1. Verifique se `VITE_OPENAI_API_KEY` está configurada
2. Confirme que a chave tem créditos disponíveis
3. Verifique se a chave tem permissões para a API necessária

### Erro: "Email não envia"

**Solução**:
1. Verifique todas as variáveis `VITE_EMAIL_*`
2. Use App Password se estiver usando Gmail
3. Confirme que a porta SMTP está correta (geralmente 587 ou 465)

## 📚 Recursos Adicionais

- [Documentação do Dokploy](https://docs.dokploy.com/)
- [Documentação do Supabase](https://supabase.com/docs)
- [Google Maps Platform](https://developers.google.com/maps)
- [OpenAI API](https://platform.openai.com/docs)

## 🔗 Links Úteis

- **Obter chave Google Maps**: https://console.cloud.google.com/apis/credentials
- **Obter chave OpenAI**: https://platform.openai.com/api-keys
- **Configurar Gmail SMTP**: https://support.google.com/accounts/answer/185833

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no painel do Dokploy
2. Consulte o console do navegador (F12)
3. Revise este guia completamente
4. Entre em contato com o suporte técnico

---

**Última atualização**: Outubro 2024
