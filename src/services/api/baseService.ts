
import { BaseService, ServiceConfig } from './types';
import { getServiceConfig } from './serviceConfig';

/**
 * Base service class that all services should extend
 */
export abstract class AbstractBaseService implements BaseService {
  protected readonly serviceName: string;
  
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }
  
  /**
   * Get the configuration for this service
   */
  getConfig(): ServiceConfig {
    return getServiceConfig(this.serviceName);
  }
  
  /**
   * Simulates network delay for consistent mock behavior
   */
  protected async mockDelay(): Promise<void> {
    const { mockDelay } = this.getConfig();
    if (mockDelay && mockDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, mockDelay));
    }
  }
}
