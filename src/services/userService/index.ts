
import { UserService } from './types';
import { MockUserService } from './mockUserService';
import { ApiUserService } from './apiUserService';
import { getServiceConfig } from '../api/serviceConfig';

let userServiceInstance: UserService | null = null;

/**
 * Factory function to get the appropriate UserService implementation
 */
export function getUserService(): UserService {
  if (!userServiceInstance) {
    const config = getServiceConfig('user');
    userServiceInstance = config.useMocks 
      ? new MockUserService() 
      : new ApiUserService();
  }
  
  return userServiceInstance;
}

/**
 * Reset the service instance (useful for testing or changing config)
 */
export function resetUserService(): void {
  userServiceInstance = null;
}

export * from './types';
