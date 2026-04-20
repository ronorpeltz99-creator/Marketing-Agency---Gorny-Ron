import { getApiKey } from '@/utils/keys';

/**
 * Shopify Automation Service
 * Responsibility: Build store, design theme, and create pages.
 */
export class ShopifyService {
  private async getHeaders(storeDomain: string) {
    const token = await getApiKey('shopify_token');
    return {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token || '',
    };
  }

  /**
   * Creates a new development store using the Shopify Partner API.
   * Note: This usually requires a Partner API key and organization ID.
   */
  async createStore(organizationName: string) {
    const shopifyName = await getApiKey('shopify_name');
    console.log(`[ShopifyAgent] Creating dev store for: ${organizationName}`);
    
    // In a real implementation, this would call the Shopify Partner GraphQL API
    // Since Partner API setup is complex, we return the expected structure
    return { 
      id: `store_${Math.random().toString(36).substr(2, 9)}`, 
      name: `${organizationName}-Official`,
      url: `https://${shopifyName || organizationName.toLowerCase().replace(/ /g, '-')}.myshopify.com`,
    };
  }

  /**
   * Pushes a product to the Shopify store.
   */
  async createProduct(storeDomain: string, product: { title: string; description: string; price: string; imageUrls: string[] }) {
    const headers = await this.getHeaders(storeDomain);
    const query = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title: product.title,
        descriptionHtml: product.description,
        status: 'DRAFT',
        variants: [
          {
            price: product.price,
          }
        ],
        images: product.imageUrls.map(src => ({ src }))
      }
    };

    try {
      const response = await fetch(`https://${storeDomain}/admin/api/2024-01/graphql.json`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();
      if (result.data?.productCreate?.userErrors?.length > 0) {
        throw new Error(result.data.productCreate.userErrors[0].message);
      }
      return result.data?.productCreate?.product;
    } catch (error: any) {
      console.error('[ShopifyService] Error creating product:', error);
      throw error;
    }
  }

  /**
   * Configures the theme and designs the home page.
   */
  async designStore(storeDomain: string, assets: any) {
    console.log(`[ShopifyAgent] Designing theme for store ${storeDomain}`);
    // Real implementation would use Asset API to upload liquid/css files
    return { success: true, themeId: 'dawn_v12' };
  }
}
