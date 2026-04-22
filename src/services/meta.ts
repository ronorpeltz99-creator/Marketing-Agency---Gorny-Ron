import { getApiKey } from '@/utils/keys';

/**
 * Meta Ads Service
 * Responsibility: Launch campaigns and monitor real-time performance.
 */
export class MetaAdsService {
  private async getBaseUrl() {
    const adAccountId = await getApiKey('meta_ad_account');
    return `https://graph.facebook.com/v19.0/${adAccountId}`;
  }

  private async getAccessToken() {
    return await getApiKey('meta_token');
  }

  /**
   * Fetches available ad accounts for the user.
   */
  async fetchAdAccounts() {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return [];
    
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?fields=name,account_id&access_token=${accessToken}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('[MetaAdsService] Error fetching ad accounts:', error);
      return [];
    }
  }

  /**
   * Launches a full campaign hierarchy (Campaign -> Ad Set -> Ad).
   */
  async launchFullCampaign(params: { 
    name: string; 
    budget: number; 
    creatives: string[];
    pixelId?: string;
  }) {
    const accessToken = await this.getAccessToken();
    const baseUrl = await this.getBaseUrl();

    try {
      // 1. Create Campaign (CBO)
      const campaignResponse = await fetch(`${baseUrl}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: params.name,
          objective: 'OUTCOME_SALES',
          daily_budget: params.budget * 100, // Cents
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          status: 'PAUSED',
          special_ad_categories: 'NONE',
          access_token: accessToken,
        }),
      });
      const campaign = await campaignResponse.json();
      if (campaign.error) throw new Error(campaign.error.message);

      // 2. Create Ad Set (Broad targeting example)
      const adSetResponse = await fetch(`${baseUrl}/adsets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${params.name} - Broad AdSet`,
          campaign_id: campaign.id,
          optimization_goal: 'OFFSITE_CONVERSIONS',
          billing_event: 'IMPRESSIONS',
          bid_amount: 100,
          status: 'PAUSED',
          targeting: { geo_locations: { countries: ['US'] } },
          access_token: accessToken,
        }),
      });
      const adSet = await adSetResponse.json();
      if (adSet.error) throw new Error(adSet.error.message);

      // 3. Create Ads (for each creative)
      for (const creativeUrl of params.creatives) {
        await fetch(`${baseUrl}/ads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Ad - ${params.name}`,
            adset_id: adSet.id,
            creative: {
              object_story_spec: {
                link_data: {
                  link: 'https://myshopify.com', // Should be the store URL
                  message: 'Get this amazing product now!',
                  picture: creativeUrl
                }
              }
            },
            status: 'PAUSED',
            access_token: accessToken,
          }),
        });
      }

      return { success: true, campaignId: campaign.id };
    } catch (error: any) {
      console.error('[MetaAdsService] Full launch failed:', error);
      throw error;
    }
  }

  /**
   * Fetches real-time metrics for a specific ad.
   */
  async getAdMetrics(adId: string) {
    const accessToken = await this.getAccessToken();
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${adId}/insights?fields=spend,cpm,ctr,inline_link_click_ctr,purchase_roas&access_token=${accessToken}`);
      const result = await response.json();
      if (result.error) throw new Error(result.error.message);
      
      const data = result.data[0] || {};
      return {
        spend: parseFloat(data.spend || '0'),
        cpm: parseFloat(data.cpm || '0'),
        ctr: data.inline_link_click_ctr || '0%',
        roas: data.purchase_roas?.[0]?.value || 0
      };
    } catch (error: any) {
      console.error('[MetaAdsService] Error fetching metrics:', error);
      return null;
    }
  }

  /**
   * Pauses an ad (The "Kill" switch).
   */
  async killAd(adId: string) {
    const accessToken = await this.getAccessToken();
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${adId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PAUSED',
          access_token: accessToken,
        }),
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('[MetaAdsService] Error killing ad:', error);
      return false;
    }
  }
}
