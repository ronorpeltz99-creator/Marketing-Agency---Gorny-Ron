'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store, DollarSign, ImageIcon, Save, Loader2, CheckCircle2,
  ToggleLeft, ToggleRight, Trash2, Plus, Package, ShoppingCart,
  CreditCard, RefreshCcw, ChevronRight, Eye, X, Upload
} from 'lucide-react';

import { createShopifyProductAction } from '@/app/actions/shopify';

interface ProductData {
  title: string;
  price: string;
  images: string[];
  supplierName: string;
  supplierRating: string;
  orders: string;
  shipping: string;
  url: string;
}

interface StoreProduct {
  title: string;
  price: string;
  comparePrice: string;
  costPerUnit: string;
  isPhysical: boolean;
  images: string[];
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  product: string;
  amount: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  date: string;
}

interface StoreBuilderProps {
  productData: ProductData | null;
}

export default function StoreBuilder({ productData }: StoreBuilderProps) {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'orders'>('products');
  const [isSaving, setIsSaving] = useState(false);
  const [storeProduct, setStoreProduct] = useState<StoreProduct>({
    title: productData?.title || '',
    price: '49.99',
    comparePrice: '89.99',
    costPerUnit: productData?.price || '24.80',
    isPhysical: true,
    images: productData?.images || []
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await createShopifyProductAction('your-store.myshopify.com', {
        title: storeProduct.title,
        description: `High-quality product: ${storeProduct.title}`,
        price: storeProduct.price,
        imageUrls: storeProduct.images
      });
      
      if (result.success) {
        alert('Product pushed to Shopify!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert('Failed to save to Shopify');
    } finally {
      setIsSaving(false);
    }
  };

  const margin = storeProduct.price && storeProduct.costPerUnit
    ? (((parseFloat(storeProduct.price) - parseFloat(storeProduct.costPerUnit)) / parseFloat(storeProduct.price)) * 100).toFixed(1)
    : '0';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="text-left">
        <div className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
          <Store className="w-4 h-4" /> Step 2
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
          Store <span className="text-zinc-600">Builder</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl">
          Manage your Shopify store, products, pricing, and orders — all from here.
        </p>
      </header>

      {!productData ? (
        <div className="p-20 rounded-[40px] bg-zinc-950 border border-white/5 text-center">
          <Package className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Import a product first</p>
          <p className="text-zinc-700 text-xs mt-2">Go to "Import Product" to get started</p>
        </div>
      ) : (
        <>
          {/* Sub-tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('products')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'products' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
            >
              <Package className="w-3.5 h-3.5 inline mr-2" /> Product Manager
            </button>
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'orders' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
            >
              <ShoppingCart className="w-3.5 h-3.5 inline mr-2" /> Orders
            </button>
          </div>

          {activeSubTab === 'products' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Editor */}
              <div className="lg:col-span-2 p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase italic">Product Details</h2>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {isSaving ? 'Pushing to Shopify...' : 'Save to Shopify'}
                  </button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Product Title</label>
                  <input
                    type="text"
                    value={storeProduct.title}
                    onChange={(e) => setStoreProduct({ ...storeProduct, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Selling Price</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={storeProduct.price}
                        onChange={(e) => setStoreProduct({ ...storeProduct, price: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm font-black text-emerald-400 focus:border-emerald-500 focus:outline-none"
                      />
                      <DollarSign className="absolute left-3.5 top-4 w-4 h-4 text-emerald-500/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Compare Price</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={storeProduct.comparePrice}
                        onChange={(e) => setStoreProduct({ ...storeProduct, comparePrice: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm font-black text-zinc-400 line-through focus:border-zinc-500 focus:outline-none"
                      />
                      <DollarSign className="absolute left-3.5 top-4 w-4 h-4 text-zinc-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cost Per Unit</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={storeProduct.costPerUnit}
                        onChange={(e) => setStoreProduct({ ...storeProduct, costPerUnit: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm font-black text-red-400 focus:border-red-500 focus:outline-none"
                      />
                      <DollarSign className="absolute left-3.5 top-4 w-4 h-4 text-red-500/50" />
                    </div>
                  </div>
                </div>

                {/* Physical Product Toggle */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
                  <div>
                    <div className="text-sm font-bold">Physical Product</div>
                    <div className="text-[10px] text-zinc-500">Requires shipping address at checkout</div>
                  </div>
                  <button
                    onClick={() => setStoreProduct({ ...storeProduct, isPhysical: !storeProduct.isPhysical })}
                    className="text-indigo-400"
                  >
                    {storeProduct.isPhysical ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-zinc-600" />}
                  </button>
                </div>

                {/* Product Images */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Product Images</label>
                    <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-300">
                      <Upload className="w-3 h-3" /> Upload Images
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {storeProduct.images.length > 0 ? storeProduct.images.map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )) : (
                      <>
                        {[1, 2, 3, 4].map(i => (
                          <button key={i} className="aspect-square rounded-xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 transition-all">
                            <Plus className="w-5 h-5 text-zinc-700" />
                            <span className="text-[8px] text-zinc-700 font-bold uppercase">Add</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Margin Calculator */}
              <div className="space-y-6">
                <div className="p-8 rounded-[40px] bg-indigo-600/5 border border-indigo-500/20 text-center space-y-6">
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Profit Margin</div>
                  <div className="text-7xl font-black text-white italic tracking-tighter">{margin}%</div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-zinc-600">Revenue</span>
                      <span className="text-emerald-400">${storeProduct.price}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-zinc-600">Cost</span>
                      <span className="text-red-400">-${storeProduct.costPerUnit}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 flex justify-between text-[11px] font-black">
                      <span className="text-zinc-400">Net Profit</span>
                      <span className="text-white">${(parseFloat(storeProduct.price || '0') - parseFloat(storeProduct.costPerUnit || '0')).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min(parseFloat(margin), 100)}%` }} />
                  </div>
                </div>

                <div className="p-8 rounded-[40px] bg-zinc-950 border border-white/5 space-y-4">
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Quick Actions</div>
                  <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-indigo-500/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400" />
                      <span className="text-xs font-bold">Preview Store</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700" />
                  </button>
                  <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-emerald-500/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400" />
                      <span className="text-xs font-bold">Setup Payments</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700" />
                  </button>
                  <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-purple-500/30 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <RefreshCcw className="w-4 h-4 text-zinc-600 group-hover:text-purple-400" />
                      <span className="text-xs font-bold">Sync from Shopify</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Orders Tab */
            <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5">
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">No orders yet</p>
                  <p className="text-zinc-700 text-xs mt-2">Orders will appear here automatically when customers buy</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest pb-4 border-b border-white/5">
                    <span>Customer</span>
                    <span>Email</span>
                    <span>Product</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Date</span>
                  </div>
                  {orders.map((order) => (
                    <div key={order.id} className="grid grid-cols-6 items-center py-4 border-b border-white/5 text-xs">
                      <span className="font-bold">{order.customerName}</span>
                      <span className="text-zinc-500">{order.email}</span>
                      <span className="text-zinc-400">{order.product}</span>
                      <span className="font-black text-emerald-400">${order.amount}</span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase w-fit ${
                        order.status === 'fulfilled' ? 'bg-emerald-500/10 text-emerald-400' :
                        order.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{order.status}</span>
                      <span className="text-zinc-600">{order.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
