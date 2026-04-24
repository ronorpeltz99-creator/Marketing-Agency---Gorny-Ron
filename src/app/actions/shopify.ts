'use server';

import { ShopifyService } from '@/services/shopify';
import { createClient } from '@/utils/supabase/server';

export async function createStoreAction(organizationName: string) {
  const shopify = new ShopifyService();
  const supabase = await createClient();

  try {
    const result = await shopify.createStore(organizationName);
    
    // 1. Ensure Org exists
    let { data: org } = await supabase.from('organizations').select('id').limit(1).single();
    if (!org) {
      const { data: newOrg } = await supabase.from('organizations').insert({ name: organizationName, slug: organizationName.toLowerCase().replace(/\s+/g, '-') }).select().single();
      org = newOrg;
    }

    // 2. Save to stores table
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        organization_id: org!.id,
        name: organizationName,
        shopify_domain: result.domain,
        status: 'active'
      })
      .select()
      .single();

    if (storeError) throw storeError;

    // Auto-create theme
    try {
      await shopify.createTheme(result.domain, `${organizationName} Premium Theme`);
    } catch (themeError) {
      console.warn('[Action] Theme creation failed (non-critical):', themeError);
    }
    
    return { success: true, store };
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
    
    // 1. Get store_id
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('shopify_domain', storeDomain)
      .single();

    if (!store) throw new Error(`Store with domain ${storeDomain} not found in database.`);

    // 2. Save to Supabase products table
    const { data: dbProduct, error: dbError } = await supabase
      .from('products')
      .insert({
        store_id: store.id,
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

export async function updateShopifyProductAction(storeDomain: string, productId: string, updates: { title?: string; descriptionHtml?: string; price?: string }) {
  const shopify = new ShopifyService();
  try {
    const result = await shopify.updateProduct(storeDomain, productId, updates);
    return { success: true, product: result };
  } catch (error: any) {
    console.error('[Action] Shopify product update failed:', error);
    return { success: false, error: error.message };
  }
}
