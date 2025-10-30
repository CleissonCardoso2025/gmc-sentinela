/**
 * Serviço para gerenciar a chave da API do Google Maps
 * 
 * IMPORTANTE: As chaves agora são gerenciadas através de variáveis de ambiente
 * Configure VITE_GOOGLE_MAPS_API_KEY no Dokploy para usar o Google Maps
 */

import { getGoogleMapsApiKey, hasGoogleMapsKey as checkGoogleMapsKey } from './envConfigService';

/**
 * Obtém a chave da API do Google Maps das variáveis de ambiente
 * @returns A chave da API ou null se não configurada
 */
export function loadGoogleMapsKey(): string | null {
  return getGoogleMapsApiKey();
}

/**
 * Verifica se a chave do Google Maps está configurada
 * @returns true se a chave está configurada
 */
export function hasGoogleMapsKey(): boolean {
  return checkGoogleMapsKey();
}

/**
 * Função mantida para compatibilidade com código existente
 * Agora apenas informa que as chaves devem ser configuradas no Dokploy
 * @deprecated Use variáveis de ambiente no Dokploy
 */
export async function saveGoogleMapsKey(apiKey: string): Promise<boolean> {
  console.warn('⚠️ AVISO: As chaves de API agora devem ser configuradas no Dokploy através de variáveis de ambiente.');
  console.warn('⚠️ Configure VITE_GOOGLE_MAPS_API_KEY no painel do Dokploy.');
  console.warn('⚠️ Esta função não salva mais chaves no banco de dados por questões de segurança.');
  return false;
}
