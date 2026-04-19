import { MetaAdsService } from "../../services/meta";

/**
 * Tool: Create Meta Ad Campaign
 * Sets up a new campaign with budget and basic settings.
 */
export async function createCampaign(name: string, budget: number) {
  const meta = new MetaAdsService();
  try {
    const result = await meta.createCampaign(name, budget);
    return {
      success: true,
      message: `Meta campaign ${name} created with budget ${budget}.`,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
