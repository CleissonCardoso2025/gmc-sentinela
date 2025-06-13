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
  provider: string;
  api_key: string;
  created_at?: string;
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

export interface EmailConfig {
  id?: string;
  provider: string;
  host: string;
  port: string;
  username: string;
  password?: string;
  from_email?: string;
  from_name?: string;
  secure: boolean;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}
