
/**
 * Generic API response structure
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Environment configuration for services
 */
export interface ServiceConfig {
  useMocks: boolean;
  mockDelay?: number;
}

/**
 * Base service interface
 */
export interface BaseService {
  getConfig(): ServiceConfig;
}
