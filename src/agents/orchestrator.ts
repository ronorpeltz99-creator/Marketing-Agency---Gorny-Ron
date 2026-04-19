import { DsersService } from "../services/dsers";
import { ShopifyService } from "../services/shopify";
import { CreativeService } from "../services/creative";
import { MetaAdsService } from "../services/meta";

/**
 * Agent Orchestrator
 * The "Main Bot" that coordinates the entire autonomous pipeline.
 */
export class AgentOrchestrator {
  private dsers = new DsersService();
  private shopify = new ShopifyService();
  private creative = new CreativeService();
  private meta = new MetaAdsService();

  /**
   * THE MAIN ENTRY POINT
   * Input: Product URL + Budget
   */
  async runFullPipeline(productUrl: string, dailyBudget: number) {
    console.log("--- STARTING AUTONOMOUS PIPELINE ---");

    // Phase 1: Sourcing
    const supplier = await this.dsers.findBestSupplier(productUrl);
    
    // Phase 2: Store Building
    const store = await this.shopify.createStore(supplier.supplierId);
    await this.dsers.importProduct(supplier.optimizedUrl, store.storeId);
    
    // Phase 3: Creative Generation
    const scripts = await this.creative.generateScripts(supplier);
    const images = await this.creative.generateImages(supplier.supplierId);
    const video = await this.creative.generateVideo(scripts[0].body, images);

    // Phase 4: Launch
    await this.shopify.designStore(store.storeId, { logo: images[0], video });
    await this.shopify.setupLegalPages(store.storeId);
    
    const campaign = await this.meta.launchCampaign(store.storeUrl, dailyBudget, [video, ...images]);

    console.log("--- PIPELINE COMPLETE: STORE IS LIVE & ADS ARE RUNNING ---");
    return { store, campaign };
  }
}
