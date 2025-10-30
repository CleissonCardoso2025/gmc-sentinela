# 📋 Changelog - Sistema de Configuração de APIs

## 🎯 Resumo das Mudanças

O sistema de configuração de APIs foi completamente refatorado para usar **variáveis de ambiente** em vez de armazenamento no banco de dados. Esta mudança melhora significativamente a segurança e facilita o deployment no Dokploy.

---

## ✨ O que mudou?

### Antes (Sistema Antigo)
- ❌ Chaves armazenadas no banco de dados (tabela `system_api_keys`)
- ❌ Criptografia básica com Base64
- ❌ Interface para salvar chaves via formulário
- ❌ Complexidade desnecessária
- ❌ Risco de exposição de chaves

### Agora (Sistema Novo)
- ✅ Chaves em variáveis de ambiente (`.env` e Dokploy)
- ✅ Sem armazenamento no banco de dados
- ✅ Interface apenas exibe status das configurações
- ✅ Simplicidade e segurança
- ✅ Alinhado com melhores práticas

---

## 📁 Arquivos Criados

### 1. `src/services/envConfigService.ts`
**Novo serviço** para gerenciar configurações via variáveis de ambiente.

**Principais funções**:
- `getGoogleMapsApiKey()` - Obtém chave do Google Maps
- `getOpenAIApiKey()` - Obtém chave da OpenAI
- `getEmailConfig()` - Obtém configuração de email
- `getConfigStatus()` - Retorna status de todas as configurações
- `validateRequiredConfig()` - Valida configurações obrigatórias
- `logConfigReport()` - Exibe relatório no console

### 2. `.env.example`
**Atualizado** com instruções detalhadas para Dokploy.

**Inclui**:
- Todas as variáveis necessárias
- Comentários explicativos
- Links para obter chaves
- Instruções de uso

### 3. `DOKPLOY_DEPLOYMENT.md`
**Guia completo** de deployment no Dokploy.

**Conteúdo**:
- Passo a passo de configuração
- Variáveis obrigatórias e opcionais
- Troubleshooting
- Verificação pós-deploy

### 4. `CONFIGURACAO_API.md`
**Documentação detalhada** sobre configuração de APIs.

**Conteúdo**:
- Como obter cada chave de API
- Configuração local e em produção
- Boas práticas de segurança
- Migração do sistema antigo

### 5. `.gitignore`
**Atualizado** para permitir `.env.example` mas bloquear `.env`.

---

## 🔄 Arquivos Modificados

### 1. `src/services/googleMapsService.ts`
**Simplificado** para usar apenas variáveis de ambiente.

**Mudanças**:
- Removida lógica de salvamento no banco
- Função `saveGoogleMapsKey()` agora apenas avisa sobre o novo sistema
- `loadGoogleMapsKey()` lê do `envConfigService`
- `hasGoogleMapsKey()` verifica variável de ambiente

### 2. `src/components/Configuracoes/ApiIntegrations.tsx`
**Reescrito completamente** para exibir apenas status.

**Mudanças**:
- Removidos formulários de entrada
- Adicionados cards de status (✅ configurado / ⚠️ não configurado)
- Instruções de como configurar no Dokploy
- Links diretos para obter chaves
- Interface mais limpa e informativa

### 3. `src/services/systemConfigService.ts`
**Mantido** para compatibilidade com webhooks e email (se ainda usado).

**Status**: Pode ser removido futuramente se não for mais necessário.

---

## 🗑️ O que pode ser removido?

### Tabelas do Banco de Dados (Opcional)

Se você não precisa mais das chaves antigas:

```sql
-- CUIDADO: Backup antes de executar!
DROP TABLE IF EXISTS system_api_keys;
DROP TABLE IF EXISTS system_env_updates;
DROP TABLE IF EXISTS webhook_notification_log;
```

### Arquivos/Funções Obsoletos

- `src/utils/crypto.ts` - Não é mais necessário
- `src/services/systemConfigService.ts` - Funções de API keys obsoletas
- Edge Function `update-env` - Não é mais usada

**Nota**: Mantenha por enquanto para evitar quebrar código existente.

---

## 🚀 Como Migrar

### Para Desenvolvimento Local

1. **Copie o arquivo de exemplo**:
   ```bash
   cp .env.example .env
   ```

2. **Preencha suas chaves**:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
   VITE_OPENAI_API_KEY=sua_chave_aqui
   ```

3. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

### Para Produção (Dokploy)

1. **Acesse o painel do Dokploy**
2. **Vá em Environment Variables**
3. **Adicione cada variável**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `VITE_OPENAI_API_KEY`
   - etc.
4. **Salve e faça redeploy**

### Exportar Chaves Antigas (Se Necessário)

Se você tinha chaves no banco de dados:

```sql
-- Exportar chaves existentes
SELECT key_name, key_value FROM system_api_keys;
```

**Importante**: As chaves estão em Base64, use `atob()` para descriptografar.

---

## ✅ Benefícios da Nova Abordagem

### Segurança
- ✅ Chaves não ficam expostas no banco de dados
- ✅ Sem risco de SQL injection para obter chaves
- ✅ Variáveis de ambiente são o padrão da indústria
- ✅ Fácil rotação de chaves

### Simplicidade
- ✅ Menos código para manter
- ✅ Sem necessidade de criptografia customizada
- ✅ Interface mais simples e clara
- ✅ Menos pontos de falha

### Deployment
- ✅ Alinhado com práticas do Dokploy
- ✅ Fácil configuração em diferentes ambientes
- ✅ Suporte nativo em plataformas de cloud
- ✅ Melhor para CI/CD

### Manutenção
- ✅ Código mais limpo
- ✅ Menos dependências
- ✅ Mais fácil de debugar
- ✅ Documentação clara

---

## 📊 Comparação de Código

### Antes (Complexo)
```typescript
// Criptografar
const encrypted = encrypt(apiKey);

// Salvar no banco
await supabase
  .from('system_api_keys')
  .upsert({ key_name: 'google_maps', key_value: encrypted });

// Carregar do banco
const { data } = await supabase
  .from('system_api_keys')
  .select('key_value')
  .eq('key_name', 'google_maps')
  .single();

// Descriptografar
const decrypted = decrypt(data.key_value);
```

### Agora (Simples)
```typescript
// Obter chave
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

**Redução**: ~50 linhas → 1 linha! 🎉

---

## 🔍 Verificação

### Checklist de Migração

- [ ] Arquivo `.env` criado localmente
- [ ] Variáveis configuradas no Dokploy
- [ ] Aplicação reiniciada/redeployada
- [ ] Status verificado na interface
- [ ] Funcionalidades testadas
- [ ] Chaves antigas removidas do banco (opcional)

### Teste de Funcionamento

1. **Acesse a aplicação**
2. **Vá em Configurações > Integrações**
3. **Verifique os status**:
   - Google Maps: ✅ ou ⚠️
   - OpenAI: ✅ ou ⚠️
   - Email: ✅ ou ⚠️

---

## 📞 Suporte

### Problemas Comuns

**"Chave não está sendo reconhecida"**
- Verifique o nome da variável (deve começar com `VITE_`)
- Reinicie o servidor
- Limpe o cache do navegador

**"Interface mostra não configurado mas a chave está no .env"**
- Certifique-se de que o arquivo `.env` está na raiz do projeto
- Verifique se não há espaços extras no valor
- Reinicie completamente o servidor

**"Funciona local mas não no Dokploy"**
- Verifique se as variáveis estão no Dokploy
- Faça um redeploy após adicionar variáveis
- Verifique os logs de build

### Onde Buscar Ajuda

1. `CONFIGURACAO_API.md` - Guia completo de configuração
2. `DOKPLOY_DEPLOYMENT.md` - Guia de deployment
3. Console do navegador (F12) - Erros e avisos
4. Logs do Dokploy - Erros de build

---

## 📅 Histórico

### Versão 2.0 - Outubro 2024
- ✨ Sistema baseado em variáveis de ambiente
- 🔐 Segurança aprimorada
- 📚 Documentação completa
- 🚀 Otimizado para Dokploy

### Versão 1.0 - Anterior
- Sistema baseado em banco de dados
- Criptografia Base64
- Interface de formulários

---

**Migração recomendada**: ✅ Sim, o quanto antes
**Impacto**: 🟢 Baixo (código compatível mantido)
**Benefícios**: 🟢 Alto (segurança e simplicidade)

---

*Última atualização: Outubro 2024*
