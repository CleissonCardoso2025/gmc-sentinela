# 🔑 Configuração de APIs - GMC Sentinela

## 📌 Visão Geral

O GMC Sentinela utiliza variáveis de ambiente para gerenciar chaves de API e configurações sensíveis. Esta abordagem garante:

- ✅ **Segurança**: Chaves nunca são commitadas no Git
- ✅ **Flexibilidade**: Fácil configuração em diferentes ambientes
- ✅ **Simplicidade**: Sem necessidade de banco de dados para chaves
- ✅ **Conformidade**: Alinhado com as melhores práticas de segurança

## 🔄 Mudanças Importantes

### ⚠️ Migração do Sistema Anterior

Se você estava usando o sistema anterior de configuração (com banco de dados), note que:

1. **As chaves não são mais salvas no banco de dados**
2. **A interface de configuração agora é apenas informativa**
3. **Todas as chaves devem ser configuradas via variáveis de ambiente**

### Por que mudamos?

- **Segurança aprimorada**: Chaves não ficam expostas no banco de dados
- **Melhor para deployment**: Padrão da indústria para aplicações em nuvem
- **Facilita CI/CD**: Integração mais simples com pipelines de deployment
- **Dokploy-friendly**: Alinhado com as práticas do Dokploy

## 🛠️ Configuração Local (Desenvolvimento)

### 1. Criar arquivo .env

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

### 2. Preencher as variáveis

Edite o arquivo `.env` e adicione suas chaves:

```env
# Supabase - OBRIGATÓRIO
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# Google Maps - OPCIONAL
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps

# OpenAI - OPCIONAL
VITE_OPENAI_API_KEY=sua_chave_openai

# Email - OPCIONAL
VITE_EMAIL_HOST=smtp.gmail.com
VITE_EMAIL_PORT=587
VITE_EMAIL_USER=seu_email@gmail.com
VITE_EMAIL_PASSWORD=sua_senha
VITE_EMAIL_FROM=noreply@seudominio.com
VITE_EMAIL_FROM_NAME=GMC Sentinela
```

### 3. Reiniciar o servidor

```bash
npm run dev
```

## ☁️ Configuração em Produção (Dokploy)

### Passo a Passo

1. **Acesse o painel do Dokploy**
2. **Navegue até seu projeto GMC Sentinela**
3. **Vá em "Environment Variables"**
4. **Adicione cada variável individualmente**
5. **Salve e faça redeploy**

### Exemplo de Configuração

```
Key: VITE_GOOGLE_MAPS_API_KEY
Value: AIzaSyB...
```

**Importante**: Após adicionar ou modificar variáveis, sempre faça um **redeploy** da aplicação.

## 📊 Verificar Status das Configurações

### Via Interface

1. Faça login na aplicação
2. Vá em **Configurações** > **Integrações com APIs**
3. Verifique o status de cada integração:
   - ✅ **Verde**: Configurada corretamente
   - ⚠️ **Amarelo**: Não configurada (funcionalidade desabilitada)

### Via Console do Navegador

Abra o console (F12) e execute:

```javascript
import { logConfigReport } from './src/services/envConfigService';
logConfigReport();
```

Você verá um relatório completo do status de todas as configurações.

## 🔐 Obtendo as Chaves de API

### Google Maps API

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie um novo projeto ou selecione um existente
3. Ative a **Maps JavaScript API**
4. Crie uma credencial do tipo **API Key**
5. **Importante**: Configure restrições de domínio para segurança

**APIs necessárias**:
- Maps JavaScript API
- Geocoding API
- Places API (opcional)

### OpenAI API

1. Acesse: https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave (ela só será mostrada uma vez!)
5. Adicione créditos à sua conta se necessário

**Modelos recomendados**:
- GPT-4 (melhor qualidade)
- GPT-3.5-turbo (mais econômico)

### Email SMTP

#### Gmail

1. Ative a verificação em duas etapas
2. Gere uma "Senha de app": https://myaccount.google.com/apppasswords
3. Use a senha gerada (não sua senha principal)

**Configurações**:
```env
VITE_EMAIL_HOST=smtp.gmail.com
VITE_EMAIL_PORT=587
VITE_EMAIL_USER=seu_email@gmail.com
VITE_EMAIL_PASSWORD=senha_de_app_gerada
```

#### Outros provedores

- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **SendGrid**: smtp.sendgrid.net:587
- **Mailgun**: smtp.mailgun.org:587

## 🚨 Segurança

### ✅ Boas Práticas

1. **Nunca commite o arquivo .env**
   - Já está no `.gitignore`
   - Verifique antes de cada commit

2. **Use .env.example como referência**
   - Mantenha atualizado
   - Não coloque valores reais

3. **Rotacione chaves regularmente**
   - Especialmente se suspeitar de vazamento
   - Após remover membros da equipe

4. **Restrinja permissões das chaves**
   - Google Maps: Restrinja por domínio
   - OpenAI: Use limites de uso
   - Email: Use senhas de app, não senhas principais

### ❌ O que NÃO fazer

- ❌ Commitar arquivo `.env` no Git
- ❌ Compartilhar chaves por email/chat
- ❌ Usar a mesma chave em dev e prod
- ❌ Deixar chaves sem restrições
- ❌ Hardcodar chaves no código

## 🔍 Troubleshooting

### Problema: "Chave não está sendo reconhecida"

**Soluções**:
1. Verifique se o nome da variável está correto (incluindo `VITE_`)
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache: `npm run build` e reinicie
4. Verifique se não há espaços extras no valor

### Problema: "Google Maps não carrega"

**Soluções**:
1. Verifique se a API está ativada no Google Cloud Console
2. Confirme que o domínio está nas restrições
3. Verifique se há créditos disponíveis
4. Teste a chave diretamente: https://developers.google.com/maps/documentation/javascript/get-api-key

### Problema: "OpenAI retorna erro 401"

**Soluções**:
1. Verifique se a chave está correta
2. Confirme que há créditos na conta
3. Verifique se a chave não foi revogada
4. Teste a chave com curl:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $VITE_OPENAI_API_KEY"
```

### Problema: "Email não envia"

**Soluções**:
1. Verifique todas as variáveis de email
2. Use senha de app (não senha principal)
3. Confirme que a porta está correta
4. Verifique se o provedor permite SMTP
5. Teste com telnet:
```bash
telnet smtp.gmail.com 587
```

## 📚 Arquivos Relacionados

- `.env.example` - Template de configuração
- `DOKPLOY_DEPLOYMENT.md` - Guia de deployment
- `src/services/envConfigService.ts` - Serviço de configuração
- `src/components/Configuracoes/ApiIntegrations.tsx` - Interface de status

## 🔄 Migração de Dados Antigos

Se você tinha chaves salvas no banco de dados anteriormente:

1. **Exporte as chaves do banco** (se ainda tiver acesso)
2. **Adicione-as ao .env local** para desenvolvimento
3. **Configure no Dokploy** para produção
4. **Opcional**: Limpe a tabela `system_api_keys` do banco

```sql
-- CUIDADO: Isso remove todas as chaves do banco
-- DELETE FROM system_api_keys;
```

## 📞 Suporte

Dúvidas sobre configuração?

1. Consulte este guia completamente
2. Verifique o `DOKPLOY_DEPLOYMENT.md`
3. Revise os logs do console
4. Entre em contato com o suporte técnico

---

**Última atualização**: Outubro 2024
**Versão**: 2.0 (Sistema baseado em variáveis de ambiente)
