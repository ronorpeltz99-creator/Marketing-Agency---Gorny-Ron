'use server';

import { MetaAdsService } from '@/services/meta';
import { createClient } from '@/utils/supabase/server';

export async function launchCampaignAction(params: { name: string; budget: number; objective?: string; storeId: string; productId: string }) {
  const meta = new MetaAdsService();
  const supabase = await createClient();

  try {
    const result = await meta.launchCampaign({
      name: params.name,
      budget: params.budget,
      objective: params.objective || 'OUTCOME_SALES'
    });
    
    // Save to Supabase campaigns table
    const { data: dbCampaign, error: dbError } = await supabase
      .from('campaigns')
      .insert({
        name: params.name,
        daily_budget: params.budget,
        meta_campaign_id: result.id,
        store_id: params.storeId,
        product_id: params.productId,
        organization_id: 'your-org-id', // Should be fetched from session
        status: 'paused'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return { success: true, campaign: dbCampaign };
  } catch (error: any) {
    console.error('[Action] Meta campaign launch failed:', error);
    return { success: false, error: error.message };
  }
}
