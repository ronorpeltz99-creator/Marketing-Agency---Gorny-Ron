'use server';

import { createClient } from '@/utils/supabase/server';
import { encrypt } from '@/utils/encryption';

export async function saveApiKeysAction(keys: Record<string, string>) {
  const supabase = await createClient();
  
  const updates = Object.entries(keys)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([service, value]) => ({
      service_name: service,
      encrypted_key: encrypt(value),
      // For now, we use a null organization_id or a default one if needed
    }));

  if (updates.length === 0) return { success: false, message: 'No keys provided' };

  for (const update of updates) {
    // Check if key already exists for this service
    const { data: existing } = await supabase
      .from('api_keys')
      .select('id')
      .eq('service_name', update.service_name)
      .single();

    if (existing) {
      await supabase
        .from('api_keys')
        .update({ encrypted_key: update.encrypted_key })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('api_keys')
        .insert(update);
    }
  }

  return { success: true };
}

export async function getSavedServicesAction() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('api_keys')
    .select('service_name');
  
  return data?.map(d => d.service_name) || [];
}
