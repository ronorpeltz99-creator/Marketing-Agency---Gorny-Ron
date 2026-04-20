'use server';

import { ShopifyService } from '@/services/shopify';
import { createClient } from '@/utils/supabase/server';

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
