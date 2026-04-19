import { ShopifyService } from "../../services/shopify";

/**
 * Tool: Create Shopify Store
 * Creates a new development store for a client.
 */
export async function createStore(name: string) {
  const shopify = new ShopifyService();
  try {
    const result = await shopify.createStore(name);
    return {
      success: true,
      message: `Store ${name} creation initiated.`,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
