import { ShopifyService } from "../../services/shopify";

/**
 * Tool: Import Shopify Product
 * Imports a product with description and images to a specific store.
 */
export async function importProduct(storeUrl: string, productData: any) {
  const shopify = new ShopifyService();
  try {
    const result = await shopify.importProduct(storeUrl, productData);
    return {
      success: true,
      message: `Product ${productData.title} imported successfully to ${storeUrl}.`,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
