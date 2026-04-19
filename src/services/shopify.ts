import { encrypt, decrypt } from "../utils/crypto";

/**
 * Shopify Service
 * Handles store management and product operations.
 */
export class ShopifyService {
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.apiKey = process.env.SHOPIFY_API_KEY!;
    this.apiSecret = process.env.SHOPIFY_API_SECRET!;
  }

  async createStore(name: string) {
    // Logic for creating a development store via Partner API
    console.log(`Creating store: ${name}`);
    return { id: 'new_store_id', url: `${name}.myshopify.com` };
  }

  async importProduct(storeId: string, productData: any) {
    // 1. Fetch encrypted token from DB (Supabase)
    // 2. Decrypt token using decrypt()
    // 3. Call Shopify API with decrypted token
    console.log(`Importing product to store: ${storeId}`);
  }
}
