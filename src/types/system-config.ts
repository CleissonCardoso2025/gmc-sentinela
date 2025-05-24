export interface WebhookConfig {
  id?: string;
  event: string;
  url: string;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiKeyConfig {
  id?: string;
  key_name: string;
  key_value: string;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookNotificationLog {
  id?: string;
  event: string;
  webhook_id?: string;
  status: boolean;
  status_code?: number;
  response_message?: string;
  created_at?: string;
}
