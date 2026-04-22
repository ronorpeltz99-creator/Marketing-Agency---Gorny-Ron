import { createClient } from './supabase/server';
import { decrypt } from './encryption';

export async function getApiKey(serviceName: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('service_name', serviceName)
    .single();

  if (!error && data) {
    try {
      return decrypt(data.encrypted_key);
    } catch (err) {
      console.error(`Failed to decrypt key for ${serviceName}:`, err);
    }
  }

  // Fallback to Environment Variables for local development
  const envMap: Record<string, string> = {
    'anthropic': 'ANTHROPIC_API_KEY',
    'serper': 'SERPER_API_KEY',
    'shopify_token': 'SHOPIFY_PARTNER_API_TOKEN',
    'shopify_partner_token': 'SHOPIFY_PARTNER_API_TOKEN',
    'shopify_partner_org_id': 'SHOPIFY_PARTNER_ORG_ID',
    'shopify_name': 'SHOPIFY_STORE_NAME',
    'higgsfield': 'HIGGSFIELD_API_KEY',
    'meta_token': 'META_ACCESS_TOKEN',
    'fal': 'FAL_KEY',
    'fal_ai_key': 'FAL_KEY'
  };

  const envVarName = envMap[serviceName] || serviceName.toUpperCase();
  const envKey = process.env[envVarName];

  if (envKey && !envKey.includes('your-')) {
    return envKey;
  }

  return null;
}
