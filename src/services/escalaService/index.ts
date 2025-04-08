
import { EscalaService } from './types';
import { MockEscalaService } from './mockEscalaService';
import { ApiEscalaService } from './apiEscalaService';
import { getServiceConfig } from '../api/serviceConfig';

let escalaServiceInstance: EscalaService | null = null;

/**
 * Factory function to get the appropriate EscalaService implementation
 */
export function getEscalaService(): EscalaService {
  if (!escalaServiceInstance) {
    const config = getServiceConfig('escala');
    escalaServiceInstance = config.useMocks 
      ? new MockEscalaService() 
      : new ApiEscalaService();
  }
  
  return escalaServiceInstance;
}

/**
 * Reset the service instance (useful for testing or changing config)
 */
export function resetEscalaService(): void {
  escalaServiceInstance = null;
}

export * from './types';
