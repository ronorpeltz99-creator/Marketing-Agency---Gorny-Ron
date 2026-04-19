import { ShopifyService } from '../services/shopify';
import { MetaAdsService } from '../services/meta';
import { DsersService } from '../services/dsers';
import { CreativeService } from '../services/creative';
import { IntelligenceService } from '../services/intelligence';
import { createClient } from '../utils/supabase/server';

export type PipelineStatus = 'IDLE' | 'COMPETITOR_INTEL' | 'PRODUCT_SOURCING' | 'STORE_BUILDING' | 'CREATIVE_GEN' | 'LAUNCHING' | 'WAITING_FOR_USER' | 'COMPLETED' | 'FAILED';

export class AgentOrchestrator {
  private shopify = new ShopifyService();
  private meta = new MetaAdsService();
  private dsers = new DsersService();
  private creative = new CreativeService();
  private intel = new IntelligenceService();

  async updateStatus(testId: string, status: PipelineStatus, newMetadata: any = {}) {
    const supabase = await createClient();
    
    // Fetch existing metadata first to merge
    const { data: existing } = await supabase
      .from('active_tests')
      .select('metadata')
      .eq('id', testId)
      .single();

    const mergedMetadata = {
      ...(existing?.metadata || {}),
      ...newMetadata,
      [`status_${status.toLowerCase()}_at`]: new Date().toISOString()
    };

    await supabase
      .from('active_tests')
      .update({ 
        status, 
        last_update: new Date().toISOString(),
        metadata: mergedMetadata 
      })
      .eq('id', testId);
  }

  async runFullPipeline(testId: string, productUrl: string, dailyBudget: number, manualMode: boolean) {
    try {
      // PHASE 1: Intelligence & Sourcing (Parallel)
      await this.updateStatus(testId, 'COMPETITOR_INTEL');
      const [marketData, supplierData] = await Promise.all([
        this.intel.analyzeCompetitors(productUrl),
        this.dsers.findBestSupplier(productUrl)
      ]);

      if (manualMode) {
        await this.updateStatus(testId, 'WAITING_FOR_USER', { marketData, supplierData });
        return; // Halt until user sends 'resume' signal
      }

      await this.resumeFromSourcing(testId, marketData, supplierData, dailyBudget);

    } catch (error: any) {
      console.error('Pipeline Error:', error);
      await this.updateStatus(testId, 'FAILED', { error: error.message });
      throw error;
    }
  }

  async resumeFromSourcing(testId: string, marketData: any, supplierData: any, dailyBudget: number) {
    try {
      // PHASE 2: Store Build & Creative Gen (Parallel)
      await this.updateStatus(testId, 'STORE_BUILDING');
      
      const [storeResult, creatives] = await Promise.all([
        this.shopify.createStore(marketData.suggestedStoreName || 'New Store'),
        this.creative.generateScripts(marketData)
      ]);

      // PHASE 3: Design Application
      await this.updateStatus(testId, 'CREATIVE_GEN');
      await this.shopify.designStore(storeResult.id, { ...marketData, ...creatives });

      // PHASE 4: Launch
      await this.updateStatus(testId, 'LAUNCHING');
      const campaign = await this.meta.launchCampaign(storeResult.name, dailyBudget, creatives.ads);

      await this.updateStatus(testId, 'COMPLETED', { campaignId: campaign.id, storeUrl: storeResult.url });
      
      return { success: true, storeUrl: storeResult.url };

    } catch (error: any) {
      await this.updateStatus(testId, 'FAILED', { error: error.message });
      throw error;
    }
  }

  async handleUserApproval(testId: string, approvedData: any) {
    // This will be called when the user clicks 'Confirm' in the dashboard
    const supabase = await createClient();
    const { data: test } = await supabase.from('active_tests').select('*').eq('id', testId).single();
    
    if (test) {
      return this.resumeFromSourcing(testId, test.metadata.marketData, test.metadata.supplierData, test.daily_budget);
    }
  }
}
