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
   * Launches a full campaign pipeline on Meta.
   */
  async launchCampaign(params: { name: string; budget: number; objective: string }) {
    const accessToken = await this.getAccessToken();
    const baseUrl = await this.getBaseUrl();

    try {
      const response = await fetch(`${baseUrl}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: params.name,
          objective: params.objective || 'OUTCOME_SALES',
          status: 'PAUSED', // Start as paused for safety
          special_ad_categories: 'NONE',
          access_token: accessToken,
        }),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error.message);
      
      console.log(`[MetaAgent] Created campaign: ${result.id}`);
      return result;
    } catch (error: any) {
      console.error('[MetaAdsService] Error launching campaign:', error);
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
