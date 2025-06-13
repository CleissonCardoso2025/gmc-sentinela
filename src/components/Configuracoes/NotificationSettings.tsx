import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSystemConfig } from '@/hooks/use-system-config';

const NotificationSettings = () => {
  const {
    isLoading,
    isSaving,
    isTesting,
    webhooks,
    error,
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
      <Card>
        <CardHeader>
          <CardTitle>Webhooks de Notificação (n8n, Zapier, etc)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground mb-4">
            Configure webhooks para receber notificações em sistemas externos quando eventos ocorrerem no sistema.
          </p>
          
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

export default NotificationSettings;
