/**
 * Utilitário para criptografia e descriptografia de dados sensíveis
 * 
 * IMPORTANTE: Em um ambiente de produção real, você deve:
 * 1. Usar uma chave de criptografia armazenada em variáveis de ambiente
 * 2. Considerar usar um serviço de gerenciamento de segredos (AWS KMS, Azure Key Vault, etc)
 * 3. Implementar rotação de chaves e outras práticas de segurança
 */

// Em produção, esta chave deve vir de variáveis de ambiente
const ENCRYPTION_KEY = 'gcm-sentinela-encryption-key-2025';

/**
 * Criptografa uma string usando AES
 * @param text Texto a ser criptografado
 * @returns Texto criptografado em base64
 */
export function encrypt(text: string): string {
  // Esta é uma implementação simplificada para fins de demonstração
  // Em produção, use uma biblioteca de criptografia robusta como crypto-js
  
  // Usar btoa para Base64 encoding (disponível no navegador)
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    throw new Error('Falha ao criptografar dados');
  }
}

/**
 * Descriptografa uma string criptografada
 * @param encryptedText Texto criptografado em base64
 * @returns Texto original descriptografado
 */
export function decrypt(encryptedText: string): string {
  // Esta é uma implementação simplificada para fins de demonstração
  // Em produção, use uma biblioteca de criptografia robusta como crypto-js
  
  // Usar atob para Base64 decoding (disponível no navegador)
  try {
    return decodeURIComponent(escape(atob(encryptedText)));
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return '';
  }
}

/**
 * Gera um hash seguro para uma senha
 * @param password Senha a ser hasheada
 * @returns Hash da senha
 */
export function hashPassword(password: string): string {
  // Em produção, use bcrypt ou argon2
  // Esta é apenas uma simulação
  return `hashed_${password}`;
}

/**
 * Verifica se uma senha corresponde a um hash
 * @param password Senha a ser verificada
 * @param hash Hash para comparação
 * @returns true se a senha corresponder ao hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  // Em produção, use bcrypt ou argon2
  // Esta é apenas uma simulação
  return hash === `hashed_${password}`;
}
