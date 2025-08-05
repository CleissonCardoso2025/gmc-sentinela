import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSystemConfig } from '@/hooks/use-system-config';



const SystemSettings = () => {
  const {
    isLoading,
    isSaving,
    isTesting,
    mapsApiKey,
    webhooks,
    error,
    setMapsApiKey,
    updateWebhookUrl,
    toggleWebhook,
    saveConfig,
    testWebhookEndpoint,
  } = useSystemConfig();

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Erro ao carregar configurações</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

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
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
        <Shield className="h-6 w-6 text-gcm-600" />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            APIs Externas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                console.log('Botão de salvar chave do Google Maps clicado');
                console.log('Valor atual do campo mapsApiKey:', mapsApiKey ? (mapsApiKey.includes('•') ? 'Placeholder' : 'Nova chave') : 'Vazio');
                
                // Verificar se o campo não está vazio e não é apenas o placeholder
                if (!mapsApiKey) {
                  console.error('Campo da chave está vazio');
                  return;
                }
                
                if (mapsApiKey.includes('•')) {
                  console.log('Campo contém apenas o placeholder, solicitando nova chave');
                  alert('Para alterar a chave, digite uma nova chave no campo.');
                  return;
                }
                
                console.log('Chamando saveConfig com onlyGoogleMaps=true');
                saveConfig({ onlyGoogleMaps: true });
              }} 
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

      <Card>
        <CardHeader>
          <CardTitle>Webhooks de Notificação (n8n, Zapier, etc)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {webhooks.map((wh) => (
            <div key={wh.event} className="flex flex-col gap-1 border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={wh.enabled}
                  onCheckedChange={checked => toggleWebhook(wh.event, checked)}
                  id={`switch-${wh.event}`}
                />
                <Label htmlFor={`switch-${wh.event}`}>{wh.label}</Label>
              </div>
              <Input
                type="url"
                placeholder="https://seu-n8n.com/webhook/..."
                value={wh.url}
                onChange={e => updateWebhookUrl(wh.event, e.target.value)}
                autoComplete="off"
                disabled={!wh.enabled}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-fit"
                disabled={!wh.enabled || !wh.url || isTesting === wh.event}
                onClick={() => testWebhookEndpoint(wh.event, wh.url)}
              >
                {isTesting === wh.event ? 'Testando...' : 'Testar Webhook'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button 
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          saveConfig();
        }}
        className="w-full"
        disabled={isSaving}
      >
        {isSaving ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </div>
  );
};

export default SystemSettings;
