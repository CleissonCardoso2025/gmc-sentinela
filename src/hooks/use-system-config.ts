import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  getWebhookConfigs,
  getApiKey,
  saveApiKey,
  saveWebhookConfig,
  testWebhook
} from '@/services/systemConfigService';
import { WebhookConfig } from '@/types/system-config';

// Lista de eventos suportados para notificação
export const NOTIFICATION_EVENTS = [
  { key: 'new_occurrence', label: 'Nova Ocorrência' },
  { key: 'occurrence_updated', label: 'Ocorrência Atualizada' },
  { key: 'alert_created', label: 'Novo Alerta Criado' },
  { key: 'user_registered', label: 'Novo Usuário Cadastrado' },
  { key: 'user_updated', label: 'Usuário Alterado' },
  { key: 'vehicle_maintenance', label: 'Viatura em Manutenção' },
  { key: 'permission_changed', label: 'Permissão Alterada' },
];

export interface WebhookFormData {
  event: string;
  label: string;
  enabled: boolean;
  url: string;
}

export function useSystemConfig() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [mapsApiKey, setMapsApiKey] = useState('');
  const [webhooks, setWebhooks] = useState<WebhookFormData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações do sistema
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Buscar configurações de webhook
        const webhookConfigs = await getWebhookConfigs();
        
        // Inicializar webhooks com todos os eventos possíveis
        const initialWebhooks = NOTIFICATION_EVENTS.map(event => {
          // Procurar configuração existente para este evento
          const existingConfig = webhookConfigs.find(wh => wh.event === event.key);
          
          return {
            event: event.key,
            label: event.label,
            enabled: existingConfig?.enabled || false,
            url: existingConfig?.url || '',
          };
        });
        
        setWebhooks(initialWebhooks);
        
        // Buscar chave da API do Google Maps
        // Não exibimos a chave real, apenas um placeholder se ela existir
        const hasKey = await getApiKey('google_maps');
        setMapsApiKey(hasKey ? '••••••••••••••••' : '');
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError('Falha ao carregar configurações do sistema');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, []);

  // Salvar configurações
  const saveConfig = async ({ onlyGoogleMaps = false } = {}) => {
    setIsSaving(true);
    let success = true;
    
    try {
      // Salvar chave da API do Google Maps (apenas se foi alterada)
      if (mapsApiKey && !mapsApiKey.includes('•')) {
        const keySuccess = await saveApiKey('google_maps', mapsApiKey);
        if (!keySuccess) {
          success = false;
          toast.error('Falha ao salvar chave da API do Google Maps');
        } else if (onlyGoogleMaps) {
          toast.success('Chave da API do Google Maps salva com sucesso!');
          return;
        }
      }
      
      // Se não for apenas Google Maps, salvar configurações de webhook
      if (!onlyGoogleMaps) {
        for (const webhook of webhooks) {
          if (webhook.enabled && webhook.url) {
            const webhookSuccess = await saveWebhookConfig({
              event: webhook.event,
              url: webhook.url,
              enabled: webhook.enabled,
            });
            
            if (!webhookSuccess) {
              success = false;
              toast.error(`Falha ao salvar webhook para ${webhook.label}`);
            }
          }
        }
      }
      
      if (success) {
        toast.success('Configurações salvas com sucesso!');
      } else {
        toast.warning('Algumas configurações não puderam ser salvas');
      }
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      toast.error('Falha ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  // Testar um webhook
  const testWebhookEndpoint = async (eventKey: string, url: string) => {
    if (!url.startsWith('https://')) {
      toast.error('O webhook deve usar HTTPS!');
      return false;
    }
    
    setIsTesting(eventKey);
    try {
      const success = await testWebhook(eventKey, url);
      if (success) {
        toast.success('Webhook testado com sucesso!');
        return true;
      } else {
        toast.error('Falha ao testar webhook. Verifique a URL e tente novamente.');
        return false;
      }
    } catch (err) {
      console.error('Erro ao testar webhook:', err);
      toast.error('Erro ao testar webhook');
      return false;
    } finally {
      setIsTesting(null);
    }
  };

  // Atualizar URL de um webhook
  const updateWebhookUrl = (eventKey: string, url: string) => {
    setWebhooks(prev => 
      prev.map(wh => 
        wh.event === eventKey 
          ? { ...wh, url } 
          : wh
      )
    );
  };

  // Ativar/desativar um webhook
  const toggleWebhook = (eventKey: string, enabled: boolean) => {
    setWebhooks(prev => 
      prev.map(wh => 
        wh.event === eventKey 
          ? { ...wh, enabled } 
          : wh
      )
    );
  };

  return {
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
  };
}
