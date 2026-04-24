'use server';

import { createClient } from '@/utils/supabase/server';
import { encrypt } from '@/utils/encryption';

export async function saveApiKeysAction(keys: Record<string, string>) {
  const supabase = await createClient();
  
  // 1. Get or create a default organization for the system
  // In a real app, this would be the user's organization from their profile
  let { data: org } = await supabase.from('organizations').select('id').limit(1).single();
  
  if (!org) {
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: 'Default Organization', slug: 'default' })
      .select()
      .single();
    
    if (orgError) {
      console.error('[Action] Failed to create organization:', orgError);
      return { success: false, message: 'Organization required' };
    }
    org = newOrg;
  }

  const updates = Object.entries(keys)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([service, value]) => ({
      service_name: service,
      encrypted_key: encrypt(value),
      organization_id: org!.id
    }));

  if (updates.length === 0) return { success: false, message: 'No keys provided' };

  for (const update of updates) {
    // Check if key already exists for this service in this organization
    const { data: existing } = await supabase
      .from('api_keys')
      .select('id')
      .eq('service_name', update.service_name)
      .eq('organization_id', update.organization_id)
      .maybeSingle();

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
