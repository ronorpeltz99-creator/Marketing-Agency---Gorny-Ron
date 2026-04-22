'use server';

import { MetaAdsService } from '@/services/meta';
import { createClient } from '@/utils/supabase/server';

export async function launchCampaignAction(params: { 
  name: string; 
  budget: number; 
  objective?: string; 
  storeId: string; 
  productId: string;
  creatives?: string[];
}) {
  const meta = new MetaAdsService();
  const supabase = await createClient();

  try {
    const result = await meta.launchFullCampaign({
      name: params.name,
      budget: params.budget,
      creatives: params.creatives || []
    });
    
    // Save to Supabase
    const { data: dbCampaign, error: dbError } = await supabase
      .from('campaigns')
      .insert({
        name: params.name,
        daily_budget: params.budget,
        meta_campaign_id: result.campaignId,
        store_id: params.storeId,
        product_id: params.productId,
        status: 'paused'
      })
      .select()
      .single();

    if (dbError) {
      console.warn('DB Save failed (ignoring for now):', dbError);
    }

    return { success: true, campaignId: result.campaignId };
  } catch (error: any) {
    console.error('[Action] Meta campaign launch failed:', error);
    return { success: false, error: error.message };
  }
}

export async function fetchAdAccountsAction() {
  const meta = new MetaAdsService();
  try {
    const accounts = await meta.fetchAdAccounts();
    return { success: true, accounts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
