import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Lock, Mail, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import { getEmailConfig, saveEmailConfig, testEmailConfig, getApiKey, saveApiKey } from '@/services/systemConfigService';
import { saveGoogleMapsKey, hasGoogleMapsKey } from '@/services/googleMapsService';

const ApiIntegrations = () => {
  // Estados simples
  const [openaiApiKey, setOpenaiApiKey] = React.useState('');
  const [mapsApiKey, setMapsApiKey] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [emailService, setEmailService] = React.useState({
    enabled: false,
    provider: 'smtp',
    host: '',
    port: '587',
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'GMC Sentinela',
    secure: true
  });

  // Função para salvar chave da OpenAI
  const saveOpenAIKey = async () => {
    try {
      const success = await saveApiKey('openai', openaiApiKey);
      if (success) {
        toast.success('Chave da API OpenAI salva com sucesso!');
        setOpenaiApiKey('••••••••••••••••');
      } else {
        toast.error('Falha ao salvar chave da API OpenAI');
      }
    } catch (error) {
      console.error('Erro ao salvar chave da API OpenAI:', error);
      toast.error('Erro ao salvar chave da API OpenAI');
    }
  };

  // Função para salvar configurações de email
  const saveEmailSettings = async () => {
    try {
      // Validações básicas
      if (!emailService.host || !emailService.username || (!emailService.password && !emailService.password.includes('•'))) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      const emailConfig = {
        provider: emailService.provider,
        host: emailService.host,
        port: emailService.port,
        username: emailService.username,
        password: emailService.password,
        from_email: emailService.fromEmail || emailService.username,
        from_name: emailService.fromName,
        secure: emailService.secure,
        enabled: emailService.enabled
      };

      const success = await saveEmailConfig(emailConfig);
      if (success) {
        toast.success('Configurações de email salvas com sucesso!');
        setEmailService(prev => ({
          ...prev,
          password: '••••••••••••••••'
        }));
      } else {
        toast.error('Falha ao salvar configurações de email');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de email:', error);
      toast.error('Erro ao salvar configurações de email');
    }
  };

  // Função para testar configuração de email
  const testEmailSettings = async () => {
    try {
      toast.info('Enviando email de teste...');
      const success = await testEmailConfig();
      if (success) {
        toast.success('Email de teste enviado com sucesso!');
      } else {
        toast.error('Falha ao enviar email de teste');
      }
    } catch (error) {
      console.error('Erro ao testar email:', error);
      toast.error('Erro ao enviar email de teste');
    }
  };

  // Função SIMPLES para salvar chave do Google Maps
  const saveMapsApiKey = async () => {
    setIsSaving(true);
    try {
      const success = await saveGoogleMapsKey(mapsApiKey);
      if (success) {
        // Atualizar para placeholder
        setMapsApiKey('••••••••••••••••');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Função para carregar as configurações
  React.useEffect(() => {
    const loadApiConfigs = async () => {
      try {
        console.log('Carregando configurações de API...');
        
        // Carregar chave da OpenAI
        const hasOpenAIKey = await getApiKey('openai');
        setOpenaiApiKey(hasOpenAIKey ? '••••••••••••••••' : '');
        
        // Carregar chave do Google Maps
        const hasGoogleKey = await hasGoogleMapsKey();
        setMapsApiKey(hasGoogleKey ? '••••••••••••••••' : '');

        // Carregar configurações de email
        const emailConfig = await getEmailConfig();
        if (emailConfig) {
          setEmailService({
            enabled: emailConfig.enabled || false,
            provider: emailConfig.provider || 'smtp',
            host: emailConfig.host || '',
            port: emailConfig.port || '587',
            username: emailConfig.username || '',
            password: '••••••••••••••••',
            fromEmail: emailConfig.from_email || '',
            fromName: emailConfig.from_name || 'GMC Sentinela',
            secure: emailConfig.secure !== undefined ? emailConfig.secure : true
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiConfigs();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Integrações com APIs</h1>
        <Lock className="h-6 w-6 text-gcm-600" />
      </div>

      <Tabs defaultValue="openai" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="google_maps">Google Maps</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="openai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                API OpenAI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure a chave da API OpenAI para utilizar recursos de inteligência artificial no sistema.
              </p>
              <Label htmlFor="openai-api-key">Chave da API OpenAI</Label>
              <div className="flex gap-2">
                <Input
                  id="openai-api-key"
                  type="password"
                  placeholder="Digite uma nova chave para substituir a atual"
                  value={openaiApiKey}
                  onChange={e => setOpenaiApiKey(e.target.value)}
                  autoComplete="off"
                />
                <Button 
                  onClick={saveOpenAIKey} 
                  disabled={isSaving || !openaiApiKey || openaiApiKey.includes('•')}
                  className="whitespace-nowrap"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Chave'}
                </Button>
              </div>
              <small className="text-muted-foreground">
                A chave nunca será exibida após salva. Para alterar, digite uma nova e salve.
              </small>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google_maps">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Google Maps API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure a chave da API Google Maps para utilizar recursos de mapas e geolocalização no sistema.
              </p>
              <Label htmlFor="maps-api-key">Google Maps API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="maps-api-key"
                  type="password"
                  placeholder="Digite uma nova chave para substituir a atual"
                  value={mapsApiKey}
                  onChange={e => setMapsApiKey(e.target.value)}
                  autoComplete="off"
                />
                <Button 
                  onClick={saveMapsApiKey} 
                  disabled={isSaving || !mapsApiKey || mapsApiKey.includes('•')}
                  className="whitespace-nowrap"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Chave'}
                </Button>
              </div>
              <small className="text-muted-foreground">
                A chave nunca será exibida após salva. Para alterar, digite uma nova e salve.
              </small>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Serviço de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Switch
                  checked={emailService.enabled}
                  onCheckedChange={(checked) => setEmailService(prev => ({ ...prev, enabled: checked }))}
                  id="email-enabled"
                />
                <Label htmlFor="email-enabled">Ativar serviço de email</Label>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email-host">Servidor SMTP</Label>
                    <Input
                      id="email-host"
                      placeholder="smtp.example.com"
                      value={emailService.host}
                      onChange={e => setEmailService(prev => ({ ...prev, host: e.target.value }))}
                      disabled={!emailService.enabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-port">Porta</Label>
                    <Input
                      id="email-port"
                      placeholder="587"
                      value={emailService.port}
                      onChange={e => setEmailService(prev => ({ ...prev, port: e.target.value }))}
                      disabled={!emailService.enabled}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email-username">Usuário</Label>
                  <Input
                    id="email-username"
                    placeholder="seu-email@example.com"
                    value={emailService.username}
                    onChange={e => setEmailService(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!emailService.enabled}
                  />
                </div>

                <div>
                  <Label htmlFor="email-password">Senha</Label>
                  <Input
                    id="email-password"
                    type="password"
                    placeholder="Digite uma nova senha para substituir a atual"
                    value={emailService.password}
                    onChange={e => setEmailService(prev => ({ ...prev, password: e.target.value }))}
                    autoComplete="off"
                    disabled={!emailService.enabled}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email-from">Email de Origem</Label>
                    <Input
                      id="email-from"
                      placeholder="noreply@seudominio.com"
                      value={emailService.fromEmail}
                      onChange={e => setEmailService(prev => ({ ...prev, fromEmail: e.target.value }))}
                      disabled={!emailService.enabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-name">Nome de Exibição</Label>
                    <Input
                      id="email-name"
                      placeholder="GMC Sentinela"
                      value={emailService.fromName}
                      onChange={e => setEmailService(prev => ({ ...prev, fromName: e.target.value }))}
                      disabled={!emailService.enabled}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={emailService.secure}
                    onCheckedChange={(checked) => setEmailService(prev => ({ ...prev, secure: checked }))}
                    id="email-secure"
                    disabled={!emailService.enabled}
                  />
                  <Label htmlFor="email-secure">Conexão segura (SSL/TLS)</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={saveEmailSettings} 
                    disabled={isSaving || !emailService.enabled}
                    className="whitespace-nowrap"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={testEmailSettings} 
                    disabled={!emailService.enabled || !emailService.host || !emailService.username}
                    className="whitespace-nowrap"
                  >
                    Testar Configuração
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiIntegrations;


