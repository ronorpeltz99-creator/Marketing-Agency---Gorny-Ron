'use server';

import { ShopifyService } from '@/services/shopify';
import { createClient } from '@/utils/supabase/server';

export async function createStoreAction(organizationName: string) {
  const shopify = new ShopifyService();
  try {
    const result = await shopify.createStore(organizationName);
    
    // Auto-create theme as per product vision
    try {
      await shopify.createTheme(result.domain, `${organizationName} Premium Theme`);
    } catch (themeError) {
      console.warn('[Action] Theme creation failed (non-critical):', themeError);
    }
    
    return { success: true, store: result };
  } catch (error: any) {
    console.error('[Action] Store creation failed:', error);
    return { success: false, error: error.message };
  }
}

export async function createShopifyProductAction(storeDomain: string, product: { title: string; description: string; price: string; imageUrls: string[] }) {
  const shopify = new ShopifyService();
  const supabase = await createClient();

  try {
    const result = await shopify.createProduct(storeDomain, product);
    
    // Save to Supabase products table
    const { data: dbProduct, error: dbError } = await supabase
      .from('products')
      .insert({
        title: product.title,
        description: product.description,
        price: parseFloat(product.price),
        image_url: product.imageUrls[0] || '',
        shopify_product_id: result.id,
        status: 'active'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return { success: true, product: dbProduct };
  } catch (error: any) {
    console.error('[Action] Shopify product creation failed:', error);
    return { success: false, error: error.message };
  }
}

export async function getOrdersAction(shopDomain: string) {
  const shopify = new ShopifyService();
  try {
    const orders = await shopify.fetchOrders(shopDomain);
    return { success: true, orders };
  } catch (error: any) {
    console.error('[Action] Fetch orders failed:', error);
    return { success: false, error: error.message };
  }
}
