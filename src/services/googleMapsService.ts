/**
 * Serviço SIMPLIFICADO para gerenciar a chave da API do Google Maps
 * SEM criptografia complexa, SEM hooks complicados
 * Apenas salvar e carregar do banco de dados
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Criptografia SIMPLES usando Base64 (navegador)
 */
function simpleEncrypt(text: string): string {
  return btoa(text);
}

/**
 * Descriptografia SIMPLES usando Base64 (navegador)
 */
function simpleDecrypt(encrypted: string): string {
  return atob(encrypted);
}

/**
 * Salvar chave do Google Maps no banco de dados
 */
export async function saveGoogleMapsKey(apiKey: string): Promise<boolean> {
  try {
    console.log('🔑 Salvando chave do Google Maps...');
    
    // Validar entrada
    if (!apiKey || apiKey.trim() === '') {
      toast.error('A chave não pode estar vazia');
      return false;
    }
    
    // Não salvar se for placeholder
    if (apiKey.includes('•')) {
      toast.info('Digite uma nova chave para substituir');
      return false;
    }
    
    // Criptografar
    const encryptedKey = simpleEncrypt(apiKey);
    console.log('✅ Chave criptografada');
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('system_api_keys')
      .select('id')
      .eq('key_name', 'google_maps')
      .single();
    
    if (existing) {
      // ATUALIZAR
      console.log('📝 Atualizando chave existente...');
      const { error } = await supabase
        .from('system_api_keys')
        .update({
          key_value: encryptedKey,
          updated_at: new Date().toISOString()
        })
        .eq('key_name', 'google_maps');
      
      if (error) {
        console.error('❌ Erro ao atualizar:', error);
        toast.error('Erro ao atualizar chave: ' + error.message);
        return false;
      }
    } else {
      // INSERIR
      console.log('➕ Inserindo nova chave...');
      const { error } = await supabase
        .from('system_api_keys')
        .insert({
          key_name: 'google_maps',
          key_value: encryptedKey,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('❌ Erro ao inserir:', error);
        toast.error('Erro ao inserir chave: ' + error.message);
        return false;
      }
    }
    
    console.log('✅ Chave salva com sucesso!');
    toast.success('Chave do Google Maps salva com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    toast.error('Erro ao salvar chave');
    return false;
  }
}

/**
 * Carregar chave do Google Maps do banco de dados
 */
export async function loadGoogleMapsKey(): Promise<string | null> {
  try {
    console.log('📥 Carregando chave do Google Maps...');
    
    const { data, error } = await supabase
      .from('system_api_keys')
      .select('key_value')
      .eq('key_name', 'google_maps')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ Nenhuma chave encontrada');
        return null;
      }
      console.error('❌ Erro ao carregar:', error);
      return null;
    }
    
    if (!data || !data.key_value) {
      console.log('ℹ️ Chave vazia');
      return null;
    }
    
    // Descriptografar
    const decryptedKey = simpleDecrypt(data.key_value);
    console.log('✅ Chave carregada');
    return decryptedKey;
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return null;
  }
}

/**
 * Verificar se existe uma chave salva
 */
export async function hasGoogleMapsKey(): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('system_api_keys')
      .select('id')
      .eq('key_name', 'google_maps')
      .single();
    
    return !!data;
  } catch {
    return false;
  }
}
