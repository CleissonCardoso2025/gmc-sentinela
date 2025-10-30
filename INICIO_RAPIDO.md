# 🚀 Início Rápido - GMC Sentinela

## 📋 Configuração em 5 Minutos

### 1️⃣ Clone e Instale

```bash
git clone [seu-repositorio]
cd gmc-sentinela
npm install
```

### 2️⃣ Configure o Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e adicione suas chaves
# Mínimo necessário:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### 3️⃣ Inicie o Servidor

```bash
npm run dev
```

### 4️⃣ Acesse a Aplicação

Abra: http://localhost:5173

---

## 🔑 Onde Obter as Chaves?

### Supabase (Obrigatório)

1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em Settings > API
4. Copie:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

### Google Maps (Opcional)

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie uma API Key
3. Ative: Maps JavaScript API
4. Copie a chave → `VITE_GOOGLE_MAPS_API_KEY`

### OpenAI (Opcional)

1. Acesse: https://platform.openai.com/api-keys
2. Crie uma chave
3. Copie → `VITE_OPENAI_API_KEY`

---

## 📦 Deploy no Dokploy

### Opção 1: Via Interface

1. Acesse seu painel Dokploy
2. New Project > Git Repository
3. Conecte seu repositório
4. Configure:
   - Build: `npm run build`
   - Output: `dist`
5. Adicione as variáveis de ambiente
6. Deploy!

### Opção 2: Via CLI

```bash
# Configure as variáveis no Dokploy primeiro
dokploy deploy
```

**Importante**: Sempre adicione as variáveis de ambiente no Dokploy antes do deploy!

---

## ✅ Verificação

### Desenvolvimento Local

```bash
# Verifique se está rodando
curl http://localhost:5173

# Abra o console do navegador (F12)
# Não deve haver erros de configuração
```

### Produção (Dokploy)

1. Acesse sua URL do Dokploy
2. Faça login
3. Vá em Configurações > Integrações
4. Verifique os status:
   - ✅ Verde = OK
   - ⚠️ Amarelo = Opcional não configurado

---

## 🆘 Problemas Comuns

### "Supabase client not initialized"

```bash
# Verifique se as variáveis estão no .env
cat .env | grep SUPABASE

# Reinicie o servidor
npm run dev
```

### "Chave do Google Maps não funciona"

1. Verifique se a API está ativada
2. Adicione localhost nas restrições
3. Aguarde alguns minutos (propagação)

### "Página em branco"

```bash
# Limpe o cache e reinstale
rm -rf node_modules dist .vite
npm install
npm run dev
```

---

## 📚 Próximos Passos

1. ✅ **Leia a documentação completa**:
   - `CONFIGURACAO_API.md` - Configuração detalhada
   - `DOKPLOY_DEPLOYMENT.md` - Deploy em produção

2. ✅ **Configure funcionalidades opcionais**:
   - Google Maps para mapas
   - OpenAI para IA
   - Email para notificações

3. ✅ **Personalize a aplicação**:
   - Ajuste cores e tema
   - Configure permissões de usuários
   - Adicione webhooks

---

## 🔗 Links Úteis

- **Documentação Completa**: `CONFIGURACAO_API.md`
- **Deploy**: `DOKPLOY_DEPLOYMENT.md`
- **Mudanças**: `CHANGELOG_CONFIGURACAO.md`
- **Supabase**: https://supabase.com/docs
- **Dokploy**: https://docs.dokploy.com

---

## 💡 Dicas

### Desenvolvimento

- Use `npm run dev` para hot reload
- Abra o console (F12) para ver logs
- Use React DevTools para debug

### Produção

- Sempre teste localmente antes do deploy
- Configure variáveis de ambiente no Dokploy
- Monitore os logs após deploy
- Faça backup do banco de dados regularmente

### Segurança

- ❌ Nunca commite o arquivo `.env`
- ✅ Use `.env.example` como referência
- ✅ Rotacione chaves periodicamente
- ✅ Configure restrições nas APIs

---

## 📞 Suporte

**Problemas?**

1. Consulte `CONFIGURACAO_API.md`
2. Verifique o console (F12)
3. Revise os logs do Dokploy
4. Entre em contato com suporte

---

**Tempo estimado de configuração**: 5-10 minutos ⏱️

**Pronto para começar?** Execute: `npm run dev` 🚀
