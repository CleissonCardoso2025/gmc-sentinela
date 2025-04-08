
import { ServiceConfig } from './types';

// Environment detection
const isDevelopment = import.meta.env.DEV;

// Default configuration
const defaultConfig: ServiceConfig = {
  useMocks: isDevelopment,
  mockDelay: isDevelopment ? 500 : 0,
};

// Service configuration can be overridden per service
const serviceConfigs: Record<string, ServiceConfig> = {
  // Example: Override default config for specific services
  // 'auth': { useMocks: true, mockDelay: 1000 },
};

/**
 * Get configuration for a specific service
 * @param serviceName - Name of the service to get configuration for
 */
export function getServiceConfig(serviceName: string): ServiceConfig {
  return {
    ...defaultConfig,
    ...serviceConfigs[serviceName],
  };
}

/**
 * Set configuration for a specific service
 * @param serviceName - Name of the service to set configuration for
 * @param config - Configuration to set
 */
export function setServiceConfig(serviceName: string, config: Partial<ServiceConfig>): void {
  serviceConfigs[serviceName] = {
    ...getServiceConfig(serviceName),
    ...config,
  };
}

/**
 * Force all services to use mock data or real data
 * @param useMocks - Whether to use mock data
 */
export function setGlobalMockMode(useMocks: boolean): void {
  Object.keys(serviceConfigs).forEach((serviceName) => {
    serviceConfigs[serviceName] = {
      ...serviceConfigs[serviceName],
      useMocks,
    };
  });
}
