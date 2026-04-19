import { createClient } from './server';
import { decrypt } from '../crypto';

export async function getDecryptedKey(organizationId: string, serviceName: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('organization_id', organizationId)
    .eq('service_name', serviceName)
    .single();

  if (error || !data) {
    console.error(`Key not found for service: ${serviceName}`);
    return null;
  }

  try {
    return decrypt(data.encrypted_key);
  } catch (err) {
    console.error(`Failed to decrypt key for ${serviceName}`);
    return null;
  }
}

export async function saveEncryptedKey(organizationId: string, serviceName: string, rawKey: string) {
  const { encrypt } = await import('../crypto');
  const supabase = await createClient();
  
  const encrypted = encrypt(rawKey);
  
  const { error } = await supabase
    .from('api_keys')
    .upsert({
      organization_id: organizationId,
      service_name: serviceName,
      encrypted_key: encrypted,
      created_at: new Date().toISOString()
    });

  if (error) throw error;
  return true;
}
