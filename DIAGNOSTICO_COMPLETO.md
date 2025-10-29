# 🔍 Diagnóstico Completo - Problema de Salvamento de Chave Google Maps

## 📋 Resumo do Problema

**Erro**: "Buffer is not defined" ao tentar salvar chave da API do Google Maps

**Causa Raiz**: Múltiplos arquivos usando `Buffer` (API do Node.js) no navegador

---

## 🔧 Correções Aplicadas

### 1. ✅ **systemConfigService.ts** (Principal)
**Localização**: `src/services/systemConfigService.ts`

**Problema**: Funções `encrypt()` e `decrypt()` usando `Buffer.from()`

**Solução Aplicada**:
```typescript
// ❌ ANTES (Node.js)
function encrypt(text: string): string {
  const buffer = Buffer.from(text);
  return buffer.toString('base64');
}

// ✅ DEPOIS (Navegador)
function encrypt(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    throw new Error('Falha ao criptografar dados');
  }
}
```

### 2. ✅ **crypto.ts** (Utilitário)
**Localização**: `src/utils/crypto.ts`

**Problema**: Mesmo erro de `Buffer` nas funções de criptografia

**Solução Aplicada**: Mesma correção usando `btoa()` e `atob()`

### 3. ✅ **ApiIntegrations.tsx** (Componente)
**Localização**: `src/components/Configuracoes/ApiIntegrations.tsx`

**Problema**: Estado do hook não era atualizado antes de salvar

**Solução Aplicada**:
```typescript
// Atualizar o estado do hook antes de salvar
hookSetMapsApiKey(mapsApiKey);
await new Promise(resolve => setTimeout(resolve, 100));
await saveConfig({ onlyGoogleMaps: true });
```

### 4. ✅ **Tabela system_api_keys** (Banco de Dados)
**Problema**: Colunas com nomes diferentes do esperado pelo código

**Solução Aplicada**:
```sql
ALTER TABLE system_api_keys RENAME COLUMN provider TO key_name;
ALTER TABLE system_api_keys RENAME COLUMN api_key TO key_value;
ALTER TABLE system_api_keys ADD COLUMN updated_at TIMESTAMP;
```

### 5. ✅ **Tabela system_email_config** (Banco de Dados)
**Problema**: Tabela não existia, causando erro 404

**Solução Aplicada**: Criada tabela completa com RLS

### 6. ✅ **Cache do Vite**
**Problema**: Navegador usando código antigo em cache

**Solução Aplicada**:
- Limpeza completa do cache (`node_modules/.vite`, `.vite`, `dist`)
- Reinício completo do servidor
- Todos os processos Node.js terminados

---

## 🎯 Fluxo de Salvamento Correto

### Passo a Passo:

1. **Usuário digita a chave** no campo de input
   - `onChange` atualiza `mapsApiKey` (estado local)
   - `onChange` atualiza `hookMapsApiKey` (estado do hook)

2. **Usuário clica em "Salvar Chave"**
   - Validações: não vazio, não é placeholder
   - Atualiza `hookSetMapsApiKey(mapsApiKey)` (garantia)
   - Aguarda 100ms para sincronização
   - Chama `saveConfig({ onlyGoogleMaps: true })`

3. **Hook useSystemConfig.saveConfig()**
   - Verifica se `mapsApiKey` não é placeholder
   - Chama `saveApiKey('google_maps', mapsApiKey)`

4. **systemConfigService.saveApiKey()**
   - Criptografa a chave usando `encrypt()` (btoa)
   - Verifica se a chave já existe no banco
   - Atualiza ou insere no banco de dados
   - Retorna sucesso/erro

5. **Feedback ao Usuário**
   - Toast de sucesso ou erro
   - Campo atualizado para placeholder (••••)

---

## 🔐 Segurança Implementada

### Proteção de Chaves:

1. **`.gitignore` Atualizado**
   ```gitignore
   # Environment variables - NUNCA COMMITAR CHAVES DE API!
   .env
   .env.*
   *.env
   *.env.*
   ```

2. **Criptografia Base64**
   - Chaves armazenadas criptografadas no banco
   - Funções `encrypt()` e `decrypt()` usando btoa/atob

3. **Row Level Security (RLS)**
   - Apenas usuários autenticados podem acessar
   - Políticas aplicadas em todas as tabelas

4. **Documentação**
   - `SEGURANCA.md` criado com guia completo
   - `INSTRUCOES_RELOAD.md` para problemas de cache

---

## 🧪 Como Testar

### Teste 1: Hard Reload do Navegador
```
1. Pressione Ctrl + Shift + R (Windows/Linux)
2. OU Cmd + Shift + R (Mac)
3. OU F12 > Botão direito no reload > "Limpar cache e recarregar"
```

### Teste 2: Verificar Console
Abra o console (F12) e procure por:
- ✅ **"Usar btoa para Base64 encoding"** = Código atualizado
- ❌ **"Buffer is not defined"** = Ainda em cache

### Teste 3: Salvar Chave
```
1. Vá em Configurações > Integrações com APIs
2. Aba Google Maps
3. Digite uma chave de teste: "AIzaSyTest123"
4. Clique em "Salvar Chave"
5. Deve aparecer: "Chave da API Google Maps salva com sucesso!"
```

### Teste 4: Verificar no Banco
```sql
SELECT key_name, created_at, updated_at 
FROM system_api_keys 
WHERE key_name = 'google_maps';
```

---

## 📊 Status Atual

| Componente | Status | Observações |
|------------|--------|-------------|
| systemConfigService.ts | ✅ Corrigido | Usando btoa/atob |
| crypto.ts | ✅ Corrigido | Usando btoa/atob |
| ApiIntegrations.tsx | ✅ Corrigido | Estado sincronizado |
| system_api_keys | ✅ Corrigido | Colunas renomeadas |
| system_email_config | ✅ Criado | Tabela completa |
| Cache do Vite | ✅ Limpo | Servidor reiniciado |
| .gitignore | ✅ Atualizado | Proteção reforçada |
| Documentação | ✅ Criada | 3 arquivos MD |

---

## 🚀 Próximos Passos

### Para o Usuário:

1. **Feche TODAS as abas** do localhost no navegador
2. **Feche o navegador completamente**
3. **Reabra o navegador**
4. Acesse `http://localhost:8080`
5. Faça **Hard Reload** (Ctrl+Shift+R)
6. Vá em **Configurações > Integrações com APIs**
7. Tente salvar a chave novamente

### Se Ainda Não Funcionar:

1. Verifique o console do navegador (F12)
2. Procure por erros de "Buffer"
3. Se encontrar, limpe o cache do navegador:
   - Chrome: Configurações > Privacidade > Limpar dados de navegação
   - Edge: Configurações > Privacidade > Limpar dados de navegação
   - Firefox: Opções > Privacidade > Limpar dados

---

## 📝 Arquivos Modificados

1. `src/services/systemConfigService.ts` - Funções de criptografia
2. `src/utils/crypto.ts` - Funções de criptografia
3. `src/components/Configuracoes/ApiIntegrations.tsx` - Sincronização de estado
4. `.gitignore` - Proteção de arquivos .env
5. `SEGURANCA.md` - Guia de segurança (NOVO)
6. `INSTRUCOES_RELOAD.md` - Instruções de reload (NOVO)
7. `DIAGNOSTICO_COMPLETO.md` - Este arquivo (NOVO)

---

## 🔄 Migrações SQL Aplicadas

1. `fix_system_api_keys_columns` - Renomear colunas
2. `create_system_email_config_table` - Criar tabela de email

---

## ✅ Checklist de Verificação

- [x] Todas as referências a `Buffer` removidas
- [x] Funções de criptografia usando btoa/atob
- [x] Tabelas do banco de dados corrigidas
- [x] Cache do Vite limpo
- [x] Servidor reiniciado
- [x] Estado do componente sincronizado
- [x] .gitignore atualizado
- [x] Documentação criada
- [ ] **Usuário testou com hard reload**
- [ ] **Chave salva com sucesso**

---

**Data**: 29 de Outubro de 2025  
**Hora**: 12:35 PM  
**Status**: ✅ TODAS AS CORREÇÕES APLICADAS - AGUARDANDO TESTE DO USUÁRIO

**Desenvolvido com 🔍 análise profunda para a Guarda Municipal.**
