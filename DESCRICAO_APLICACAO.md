# GMC Sentinela - Descrição Detalhada da Aplicação

## 📋 Visão Geral

**GMC Sentinela** é uma plataforma web completa de gestão operacional para Guardas Municipais, desenvolvida com tecnologias modernas (React, TypeScript, Supabase) e focada em otimizar o controle e monitoramento das operações de segurança municipal.

---

## 🎯 Objetivo Principal

Centralizar e automatizar a gestão de operações da Guarda Municipal, incluindo:
- Rastreamento de viaturas em tempo real
- Registro e acompanhamento de ocorrências
- Gestão de guarnições e escalas de trabalho
- Controle de manutenção de viaturas
- Processos de corregedoria e sindicâncias
- Sistema de alertas e notificações

---

## 🏗️ Arquitetura Técnica

### **Stack Tecnológico**
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Mapas**: Google Maps API / Leaflet
- **Gráficos**: ECharts / Recharts
- **Autenticação**: Supabase Auth
- **Estado Global**: React Context API + TanStack Query

### **Estrutura do Projeto**
```
src/
├── components/       # Componentes reutilizáveis
│   ├── Dashboard/    # Componentes do painel principal
│   ├── Ocorrencias/  # Gestão de ocorrências
│   ├── Viaturas/     # Gestão de viaturas
│   ├── Inspetoria/   # Módulo de inspetoria
│   ├── Corregedoria/ # Módulo de corregedoria
│   └── Configuracoes/# Configurações do sistema
├── pages/           # Páginas da aplicação
├── services/        # Serviços e APIs
├── hooks/           # Hooks customizados
├── contexts/        # Contextos React
├── types/           # Definições TypeScript
└── database/        # Migrações SQL
```

---

## 📱 Módulos e Funcionalidades

### 1. **Dashboard / Centro de Comando**

#### **Página Inicial (Index)**
- **Estatísticas em Tempo Real**:
  - Viaturas em operação
  - Ocorrências ativas
  - Efetivo em serviço
  - Alertas de manutenção

- **Visualizações com Tabs**:
  - **Mapa de Ocorrências**: Visualização geográfica de todas as ocorrências registradas
  - **Rastreamento de Viaturas**: Monitoramento em tempo real da localização das viaturas

- **Tabelas Informativas**:
  - Lista de viaturas ativas com status
  - Lista de ocorrências recentes

#### **Dashboard Executivo**
- **Cabeçalho de Boas-Vindas**: Personalizado com nome e cargo do usuário
- **Estatísticas Rápidas (QuickStats)**: Métricas operacionais principais
- **Ações Rápidas (QuickActions)**: Atalhos para funções frequentes
- **Mural de Alertas**: Exibição de alertas importantes (máximo 3 na página inicial)
- **Grid de Dados**: Visualizações de rotas de patrulha e escalas de trabalho

---

### 2. **Gestão de Ocorrências**

#### **Funcionalidades**:
- **Registro de Nova Ocorrência**:
  - Formulário completo com validação
  - Campos: tipo, localização, descrição, gravidade, envolvidos
  - Upload de anexos (fotos, documentos)
  - Geolocalização automática

- **Lista de Ocorrências**:
  - Visualização em tabela com filtros
  - Status: Aberta, Em Andamento, Resolvida, Arquivada
  - Busca por data, tipo, localização
  - Exportação de relatórios

- **Detalhes da Ocorrência**:
  - Visualização completa de informações
  - Histórico de atualizações
  - Anexos e evidências
  - Linha do tempo de ações
  - Atribuição de responsáveis

#### **Tipos de Ocorrência**:
- Perturbação da ordem
- Furto/Roubo
- Acidente de trânsito
- Violência doméstica
- Dano ao patrimônio público
- Outros

---

### 3. **Gestão de Viaturas**

#### **Cadastro de Viaturas**:
- **Informações Básicas**:
  - Código/Prefixo
  - Modelo e marca
  - Placa
  - Ano de fabricação
  - Tipo (patrulha, administrativa, especial)
  - Status operacional

- **Documentação**:
  - CRLV
  - Seguro
  - Vencimentos e renovações

#### **Controle de Manutenção**:
- **Registro de Manutenções**:
  - Preventiva / Corretiva
  - Data e quilometragem
  - Descrição do serviço
  - Custo
  - Responsável
  - Anexos (notas fiscais, fotos)

- **Alertas Automáticos**:
  - Manutenção preventiva vencida
  - Documentação a vencer
  - Quilometragem para revisão

#### **Relatórios**:
- Histórico de manutenções por viatura
- Custos mensais/anuais
- Disponibilidade da frota
- Gráficos de desempenho

#### **Rastreamento**:
- Localização em tempo real no mapa
- Histórico de rotas
- Status: Em Patrulha, Disponível, Em Manutenção, Indisponível

---

### 4. **Inspetoria Geral**

#### **Dashboard Operacional**:
- Visão geral das operações
- Estatísticas de guarnições ativas
- Ocorrências por região
- Efetivo em campo

#### **Gestão de Guarnições**:
- **Cadastro de Guarnições**:
  - Nome da guarnição
  - Supervisor responsável
  - Membros da equipe (nome, função, matrícula)
  - Observações

- **Listagem e Edição**:
  - Visualização de todas as guarnições
  - Edição de membros
  - Histórico de alterações

#### **Escala de Trabalho**:
- **Criação de Escalas**:
  - Seleção de guarnição
  - Definição de rota
  - Atribuição de viatura
  - Período (diurno/noturno)
  - Dias da semana ativos

- **Visualização**:
  - Calendário semanal/mensal
  - Filtros por guarnição, rota, período
  - Exportação para PDF

#### **Rotas de Patrulhamento**:
- **Cadastro de Rotas**:
  - Nome da rota
  - Descrição
  - Pontos de interesse
  - Área de cobertura
  - Prioridade

- **Visualização no Mapa**:
  - Traçado da rota
  - Pontos críticos
  - Histórico de patrulhas

#### **Relatórios Operacionais**:
- Relatórios de atividades por período
- Desempenho de guarnições
- Cobertura territorial
- Ocorrências atendidas

#### **Mural de Alertas**:
- **Criação de Alertas**:
  - Título e descrição
  - Tipo (informativo, urgente, crítico)
  - Data de validade
  - Destinatários

- **Gerenciamento**:
  - Edição e exclusão
  - Marcação como lido
  - Notificações push

---

### 5. **Corregedoria**

#### **Gestão de Sindicâncias**:
- **Nova Sindicância**:
  - Número do processo
  - Data de abertura
  - Investigado (nome, matrícula)
  - Motivo/Denúncia
  - Relato inicial
  - Anexos (documentos, evidências)

- **Acompanhamento**:
  - Status: Aberta, Em Andamento, Concluída, Arquivada
  - Etapa atual do processo
  - Responsável pela investigação

- **Etapas da Investigação**:
  - Criação de etapas personalizadas
  - Descrição e responsável
  - Data de conclusão
  - Marcação de conclusão

- **Estatísticas**:
  - Total de investigações
  - Por status
  - Tempo médio de conclusão
  - Gráficos de tendências

#### **Documentação**:
- Upload de documentos
- Anexos organizados por etapa
- Histórico de alterações
- Controle de acesso restrito

---

### 6. **Configurações do Sistema**

#### **Gestão de Usuários**:
- **Cadastro de Usuários**:
  - Nome completo
  - Email
  - Matrícula
  - Data de nascimento
  - Perfil/Cargo
  - Status (ativo/inativo)
  - Senha

- **Perfis de Acesso**:
  - Administrador: Acesso total
  - Inspetor: Gestão operacional
  - Agente: Acesso limitado
  - Corregedoria: Acesso a sindicâncias
  - Personalizado: Permissões customizadas

- **Listagem e Edição**:
  - Tabela com todos os usuários
  - Filtros e busca
  - Edição de perfil e status
  - Redefinição de senha

#### **Integrações de APIs**:
- **Google Maps API**:
  - Configuração da chave de API
  - Armazenamento seguro (criptografado)
  - Sincronização com arquivo .env
  - Teste de conectividade

- **Webhooks de Notificação**:
  - Integração com n8n, Zapier, etc.
  - Configuração de eventos:
    - Nova ocorrência
    - Alteração de status
    - Novo alerta
    - Manutenção vencida
  - URL do webhook (apenas HTTPS)
  - Ativação/desativação por evento
  - Log de notificações enviadas

#### **Notificações**:
- Preferências de notificações (a ser implementado)
- Canais: Email, Push, SMS
- Frequência e horários

---

## 🔐 Segurança e Autenticação

### **Sistema de Login**:
- Autenticação via Supabase Auth
- Email e senha
- Validação de credenciais
- Sessão persistente

### **Recuperação de Senha**:
- Envio de email com link de redefinição
- Token de segurança temporário
- Validação de nova senha

### **Controle de Acesso**:
- **Row Level Security (RLS)** no Supabase
- Políticas baseadas em perfil do usuário
- Proteção de rotas no frontend
- Componente `ProtectedRoute` para validação

### **Armazenamento Seguro**:
- Chaves de API criptografadas
- Dados sensíveis protegidos
- Logs de auditoria
- Backup automático

---

## 📊 Banco de Dados

### **Tabelas Principais**:

#### **Usuários e Autenticação**:
- `users`: Dados dos usuários
- `profiles`: Perfis e permissões

#### **Operações**:
- `occurrences`: Ocorrências registradas
- `vehicles`: Viaturas cadastradas
- `vehicle_maintenance`: Manutenções
- `guarnicoes`: Guarnições
- `guarnicao_membros`: Membros das guarnições
- `rotas`: Rotas de patrulhamento
- `escalas`: Escalas de trabalho

#### **Corregedoria**:
- `investigacoes`: Sindicâncias
- `etapas_investigacao`: Etapas dos processos
- `investigacao_anexos`: Anexos

#### **Sistema**:
- `system_api_keys`: Chaves de API
- `system_webhooks`: Configurações de webhooks
- `webhook_notification_log`: Log de notificações
- `system_env_updates`: Histórico de atualizações
- `alerts`: Alertas do sistema

---

## 🗺️ Funcionalidades de Mapeamento

### **Mapas Interativos**:
- **Mapa de Ocorrências**:
  - Marcadores por tipo de ocorrência
  - Cores por gravidade
  - Popup com informações
  - Filtros por data e tipo
  - Clustering de marcadores

- **Rastreamento de Viaturas**:
  - Localização em tempo real
  - Ícones personalizados por tipo
  - Status da viatura
  - Histórico de rotas
  - Geofencing (áreas de cobertura)

- **Rotas de Patrulhamento**:
  - Desenho de rotas no mapa
  - Pontos de interesse
  - Áreas prioritárias
  - Sobreposição de múltiplas rotas

### **Geolocalização**:
- Captura automática de coordenadas
- Endereço reverso (coordenadas → endereço)
- Busca por endereço
- Cálculo de distâncias

---

## 📈 Relatórios e Estatísticas

### **Dashboards Analíticos**:
- Gráficos de ocorrências por tipo
- Tendências temporais
- Mapas de calor
- Comparativos mensais/anuais

### **Exportação**:
- PDF
- Excel/CSV
- Impressão otimizada

### **Métricas Operacionais**:
- Taxa de resolução de ocorrências
- Tempo médio de resposta
- Disponibilidade da frota
- Eficiência de guarnições
- Custos operacionais

---

## 🔔 Sistema de Alertas e Notificações

### **Tipos de Alertas**:
- **Informativo**: Avisos gerais
- **Urgente**: Requer atenção
- **Crítico**: Ação imediata necessária

### **Canais de Notificação**:
- Notificações in-app
- Webhooks para sistemas externos
- Email (configurável)
- Push notifications (PWA)

### **Eventos Notificáveis**:
- Nova ocorrência registrada
- Alteração de status de ocorrência
- Manutenção vencida
- Documentação a vencer
- Novo alerta criado
- Atribuição de tarefa

---

## 🎨 Interface do Usuário

### **Design System**:
- **Cores Principais**:
  - GCM Primary: Azul institucional (#1e40af)
  - GCM Secondary: Verde (#16a34a)
  - Alertas: Vermelho (#dc2626)
  - Avisos: Âmbar (#f59e0b)

- **Componentes UI**:
  - Shadcn/ui (biblioteca de componentes)
  - Tailwind CSS (estilização)
  - Lucide Icons (ícones)
  - Animações suaves (fade-in, slide)

### **Responsividade**:
- Mobile-first design
- Breakpoints: sm, md, lg, xl
- Navegação adaptativa
- Tabelas responsivas com scroll

### **Acessibilidade**:
- Contraste adequado (WCAG AA)
- Navegação por teclado
- Labels descritivos
- Feedback visual claro

---

## 🚀 Funcionalidades Avançadas

### **PWA (Progressive Web App)**:
- Instalável em dispositivos móveis
- Funciona offline (cache)
- Notificações push
- Ícones e splash screen personalizados

### **Otimizações de Performance**:
- Lazy loading de componentes
- Code splitting
- Caching de dados (TanStack Query)
- Compressão de imagens
- Minificação de assets

### **Integração com n8n**:
- Automação de workflows
- Notificações para equipes (Slack, Teams)
- Sincronização com outros sistemas
- Relatórios automáticos

---

## 📦 Deployment e Infraestrutura

### **Ambiente de Desenvolvimento**:
- Vite dev server
- Hot Module Replacement (HMR)
- TypeScript strict mode
- ESLint + Prettier

### **Produção**:
- Build otimizado com Vite
- Deploy em Netlify/Vercel
- CDN para assets estáticos
- SSL/HTTPS obrigatório

### **Banco de Dados**:
- Supabase (PostgreSQL)
- Backups automáticos
- Replicação
- Monitoramento de performance

---

## 🔄 Fluxos de Trabalho Principais

### **1. Registro de Ocorrência**:
```
Agente → Preenche formulário → Upload de evidências → 
Geolocalização → Salva no banco → Notifica supervisor → 
Atualiza mapa → Envia webhook
```

### **2. Manutenção de Viatura**:
```
Inspetor → Identifica necessidade → Registra manutenção → 
Atualiza status da viatura → Agenda serviço → 
Anexa documentos → Notifica responsável → 
Atualiza relatórios
```

### **3. Criação de Escala**:
```
Inspetor → Seleciona guarnição → Define rota → 
Atribui viatura → Define período → Salva escala → 
Notifica equipe → Atualiza dashboard
```

### **4. Sindicância**:
```
Corregedoria → Abre processo → Registra denúncia → 
Cria etapas → Anexa documentos → Atualiza status → 
Notifica envolvidos → Gera relatório final
```

---

## 📋 Requisitos do Sistema

### **Navegadores Suportados**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### **Dispositivos**:
- Desktop (Windows, macOS, Linux)
- Tablets (iOS, Android)
- Smartphones (iOS, Android)

### **Conexão**:
- Recomendado: 5 Mbps ou superior
- Funciona offline (funcionalidades limitadas)

---

## 🎓 Casos de Uso

### **Cenário 1: Patrulha Diária**
Um agente inicia sua ronda seguindo a rota definida na escala. Durante o patrulhamento, identifica uma perturbação da ordem. Através do app móvel, registra a ocorrência com fotos, localização automática e descrição. O sistema notifica o supervisor imediatamente e atualiza o mapa de ocorrências em tempo real.

### **Cenário 2: Gestão de Frota**
O inspetor recebe um alerta de que uma viatura está próxima da quilometragem para manutenção preventiva. Acessa o módulo de viaturas, agenda a manutenção, atualiza o status para "Em Manutenção" e realoca a guarnição para outra viatura disponível. Após o serviço, registra os custos e anexa a nota fiscal.

### **Cenário 3: Investigação Interna**
A corregedoria recebe uma denúncia contra um agente. Abre uma sindicância no sistema, registra o relato inicial, cria as etapas da investigação (oitiva, análise de documentos, conclusão), atribui responsáveis e define prazos. Conforme as etapas são concluídas, o sistema atualiza o status e notifica os envolvidos.

---

## 🔮 Roadmap Futuro

### **Funcionalidades Planejadas**:
- [ ] Integração com câmeras de segurança
- [ ] Reconhecimento facial
- [ ] Análise preditiva de ocorrências
- [ ] App mobile nativo (React Native)
- [ ] Chatbot para atendimento
- [ ] Integração com 190
- [ ] Dashboard para cidadãos
- [ ] API pública para desenvolvedores
- [ ] Módulo de treinamento e capacitação
- [ ] Sistema de ponto eletrônico

---

## 📞 Suporte e Manutenção

### **Documentação**:
- Manual do usuário
- Guias de instalação
- API documentation
- Vídeos tutoriais

### **Suporte Técnico**:
- Email: suporte@gmcsentinela.com
- Chat in-app
- Base de conhecimento
- FAQ

---

## 📄 Licença e Propriedade

**GMC Sentinela** é uma aplicação proprietária desenvolvida para uso exclusivo de Guardas Municipais. Todos os direitos reservados.

---

## 🏆 Diferenciais Competitivos

1. **Interface Intuitiva**: Design moderno e fácil de usar
2. **Tempo Real**: Atualizações instantâneas em todos os módulos
3. **Multiplataforma**: Funciona em qualquer dispositivo
4. **Segurança**: Criptografia e controle de acesso robusto
5. **Escalabilidade**: Suporta crescimento da operação
6. **Integração**: Conecta-se com sistemas externos
7. **Customização**: Adaptável às necessidades específicas
8. **Suporte**: Documentação completa e suporte técnico

---

## 📊 Métricas de Sucesso

- **Redução de 40%** no tempo de registro de ocorrências
- **Aumento de 60%** na eficiência de patrulhamento
- **Diminuição de 30%** nos custos de manutenção
- **Melhoria de 50%** na comunicação entre equipes
- **100%** de rastreabilidade de processos

---

**Desenvolvido com ❤️ para tornar as operações da Guarda Municipal mais eficientes e seguras.**
