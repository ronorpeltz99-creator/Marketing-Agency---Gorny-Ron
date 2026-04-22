'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Package, Loader2, CheckCircle2, ImageIcon, DollarSign, Star, Truck, ExternalLink } from 'lucide-react';
import { analyzeProductAction } from '@/app/actions/intelligence';

interface ProductData {
  title: string;
  price: string;
  images: string[];
  supplierName: string;
  supplierRating: string;
  orders: string;
  shipping: string;
  url: string;
  marketData?: any;
}

interface ProductImportProps {
  onProductImported: (data: ProductData) => void;
  productData: ProductData | null;
}

export default function ProductImport({ onProductImported, productData }: ProductImportProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Please paste a valid AliExpress product URL');
      return;
    }
    setError('');
    setIsLoading(true);
 
    try {
      const result = await analyzeProductAction(url);
      
      if (result.success && result.data) {
        const data = result.data;
        const supplier = data.supplier || {};
        
        const importedProduct: ProductData = {
          title: supplier.title || data.suggestedStoreName || 'Imported Product',
          price: supplier.price || '24.80',
          images: supplier.images || [],
          supplierName: supplier.name || 'AliExpress Supplier',
          supplierRating: supplier.rating || '4.9',
          orders: supplier.orders || '1,000+',
          shipping: supplier.shipping || 'Standard Shipping',
          url: url,
          marketData: data
        };

        // AUTO-CREATE STORE & PUSH PRODUCT
        try {
          const { createStoreAction, createShopifyProductAction } = await import('@/app/actions/shopify');
          const storeResult = await createStoreAction(data.suggestedStoreName || 'My New Brand');
          
          if (storeResult.success && storeResult.store) {
             (importedProduct as any).storeInfo = storeResult.store;
             
             // Push product to the new store
             await createShopifyProductAction(storeResult.store.domain, {
               title: importedProduct.title,
               description: `High-conversion product: ${importedProduct.title}. Sourced from AliExpress.`,
               price: importedProduct.price,
               imageUrls: importedProduct.images
             });
          }
        } catch (storeErr) {
          console.warn('Auto-setup failed:', storeErr);
        }

        onProductImported(importedProduct);
      } else {
        throw new Error(result.error || 'Failed to analyze product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to import product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="text-left">
        <div className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
          <Package className="w-4 h-4" /> Step 1
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
          Import <span className="text-zinc-600">Product</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl">
          Paste the exact AliExpress product URL from the supplier you've already chosen.
        </p>
      </header>

      {/* URL INPUT */}
      <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
        <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-indigo-400" /> Import Product URL
        </h2>

        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="https://www.aliexpress.com/item/..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm font-mono focus:border-indigo-500 focus:outline-none transition-all hover:border-white/20"
          />
          <LinkIcon className="absolute left-5 top-5.5 w-5 h-5 text-zinc-600" />
        </div>

        {error && (
          <p className="text-red-400 text-xs font-bold">{error}</p>
        )}

        <button
          onClick={handleImport}
          disabled={isLoading || !url.trim()}
          className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Importing Product...
            </>
          ) : (
            <>
              <Package className="w-5 h-5" /> Import Product
            </>
          )}
        </button>
      </div>

      {/* PRODUCT PREVIEW */}
      {productData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 rounded-[40px] bg-zinc-950 border border-emerald-500/20 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Product Imported Successfully
            </h2>
            <a
              href={productData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 uppercase tracking-widest"
            >
              View on AliExpress <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Info */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-black text-white">{productData.title}</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-2" />
                  <div className="text-[9px] text-zinc-500 uppercase font-bold">Unit Cost</div>
                  <div className="text-2xl font-black text-emerald-400">${productData.price}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <Star className="w-4 h-4 text-amber-400 mx-auto mb-2" />
                  <div className="text-[9px] text-zinc-500 uppercase font-bold">Rating</div>
                  <div className="text-2xl font-black text-amber-400">{productData.supplierRating}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <Package className="w-4 h-4 text-blue-400 mx-auto mb-2" />
                  <div className="text-[9px] text-zinc-500 uppercase font-bold">Orders</div>
                  <div className="text-lg font-black text-blue-400">{productData.orders}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <Truck className="w-4 h-4 text-purple-400 mx-auto mb-2" />
                  <div className="text-[9px] text-zinc-500 uppercase font-bold">Shipping</div>
                  <div className="text-[11px] font-bold text-purple-400 mt-1">{productData.shipping}</div>
                </div>
              </div>
            </div>

            {/* Images placeholder */}
            <div className="space-y-4">
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Product Images</div>
              <div className="grid grid-cols-2 gap-2">
                {productData.images.length > 0 ? productData.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                )) : (
                  <>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-zinc-800" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
