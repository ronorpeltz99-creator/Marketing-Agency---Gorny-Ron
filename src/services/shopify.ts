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
   * Creates a new development store using the Shopify Partner GraphQL API.
   */
  async createStore(organizationName: string) {
    const partnerToken = await getApiKey('shopify_partner_token');
    const orgId = await getApiKey('shopify_partner_org_id');

    if (!partnerToken || !orgId) {
      throw new Error('Missing SHOPIFY_PARTNER_API_TOKEN or SHOPIFY_PARTNER_ORG_ID');
    }

    const storeName = organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const query = `
      mutation {
        shopCreate(input: {
          name: "${organizationName} Dev Store",
          plan: "developer_preview"
        }) {
          shop {
            id
            name
            myshopifyDomain
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://partners.shopify.com/${orgId}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': partnerToken,
        },
        body: JSON.stringify({ query }),
      }
    );

    const result = await response.json();

    if (result.data?.shopCreate?.userErrors?.length > 0) {
      throw new Error(result.data.shopCreate.userErrors[0].message);
    }

    const shop = result.data?.shopCreate?.shop;
    if (!shop) {
      throw new Error(`Partner API error: ${JSON.stringify(result)}`);
    }

    return {
      id: shop.id,
      name: shop.name,
      url: `https://${shop.myshopifyDomain}`,
      domain: shop.myshopifyDomain,
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

  /**
   * Creates a new theme for the store.
   */
  async createTheme(storeDomain: string, name: string) {
    const headers = await this.getHeaders(storeDomain);
    const response = await fetch(`https://${storeDomain}/admin/api/2024-01/themes.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        theme: {
          name,
          src: 'https://github.com/Shopify/dawn/archive/refs/heads/main.zip', // Default to Dawn
          role: 'main'
        }
      }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(JSON.stringify(result.errors));
    }
    return result.theme;
  }

  /**
   * Uploads an asset (liquid, css, etc.) to a specific theme.
   */
  async uploadAsset(storeDomain: string, themeId: string, asset: { key: string; value: string }) {
    const headers = await this.getHeaders(storeDomain);
    const response = await fetch(`https://${storeDomain}/admin/api/2024-01/themes/${themeId}/assets.json`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        asset: {
          key: asset.key,
          value: asset.value
        }
      }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(JSON.stringify(result.errors));
    }
    return result.asset;
  }

  /**
   * Fetches the latest orders for a store.
   */
  async fetchOrders(shopDomain: string) {
    const accessToken = await getApiKey('shopify_token');
    if (!accessToken) return [];

    try {
      const response = await fetch(`https://${shopDomain}/admin/api/2024-04/orders.json?status=any`, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.errors || 'Failed to fetch orders');

      return (result.orders || []).map((o: any) => ({
        id: o.id.toString(),
        customerName: `${o.customer?.first_name || 'Guest'} ${o.customer?.last_name || ''}`,
        email: o.email || 'N/A',
        product: o.line_items?.[0]?.title || 'Multiple Items',
        amount: o.total_price,
        status: o.fulfillment_status === 'fulfilled' ? 'fulfilled' : 'pending',
        date: new Date(o.created_at).toLocaleDateString()
      }));
    } catch (error) {
      console.error('[ShopifyService] Error fetching orders:', error);
      return [];
    }
  }
}
