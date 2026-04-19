import { DsersService } from "../services/dsers";
import { ShopifyService } from "../services/shopify";
import { CreativeService } from "../services/creative";
import { MetaAdsService } from "../services/meta";
import { IntelligenceService } from "../services/intelligence";
import { LogisticsService } from "../services/logistics";

/**
 * Agent Orchestrator (Turbo Mode)
 * Coordinates the autonomous pipeline with Parallel Execution.
 */
export class AgentOrchestrator {
  private dsers = new DsersService();
  private shopify = new ShopifyService();
  private creative = new CreativeService();
  private meta = new MetaAdsService();
  private intel = new IntelligenceService();
  private logistics = new LogisticsService();

  /**
   * THE TURBO ENTRY POINT
   * Runs multiple agents in parallel to maximize speed and efficiency.
   */
  async runFullPipeline(productUrl: string, dailyBudget: number) {
    console.log("--- STARTING TURBO AUTONOMOUS PIPELINE ---");

    // PHASE 1: Parallel Research & Setup
    console.log("[Phase 1] Running Intel, Sourcing, and Store Setup in parallel...");
    const [intelData, supplier, store] = await Promise.all([
      this.intel.analyzeCompetitors(productUrl),
      this.dsers.findBestSupplier(productUrl),
      this.shopify.createStore("NewTestStore")
    ]);

    // PHASE 2: Parallel Creative Generation & Store Design
    console.log("[Phase 2] Generating Creatives and Designing Store...");
    const [scripts, images] = await Promise.all([
      this.creative.generateScripts({ ...supplier, intel: intelData }),
      this.creative.generateImages(supplier.supplierId)
    ]);

    // Create the video using the first script and generated images
    const video = await this.creative.generateVideo(scripts[0].body, images);

    // PHASE 3: Synthesis & Final Prep
    console.log("[Phase 3] Finalizing Store Design and Legal Pages...");
    await Promise.all([
      this.shopify.designStore(store.storeId, { logo: images[0], video, intel: intelData }),
      this.shopify.setupLegalPages(store.storeId),
      this.dsers.importProduct(supplier.optimizedUrl, store.storeId)
    ]);

    // PHASE 4: Launch
    console.log("[Phase 4] Launching Meta Campaign...");
    const campaign = await this.meta.launchCampaign(store.storeUrl, dailyBudget, [video, ...images]);

    console.log("--- TURBO PIPELINE COMPLETE ---");
    return { store, campaign };
  }
}
