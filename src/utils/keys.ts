import { createClient } from './supabase/server';
import { decrypt } from './encryption';

export async function getApiKey(serviceName: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('service_name', serviceName)
    .single();

  if (error || !data) {
    return null;
  }

  try {
    return decrypt(data.encrypted_key);
  } catch (err) {
    console.error(`Failed to decrypt key for ${serviceName}:`, err);
    return null;
  }
}
