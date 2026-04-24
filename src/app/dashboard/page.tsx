'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Store, Target, Pen, Film, Rocket,
  Settings2, Zap, ChevronRight, Check, CheckCircle2,
  Save, Loader2
} from 'lucide-react';

import ProductImport from './sections/ProductImport';
import StoreBuilder from './sections/StoreBuilder';
import AudienceIntel from './sections/AudienceIntel';
import CopyEngine from './sections/CopyEngine';
import AdsCreator from './sections/AdsCreator';
import CampaignLaunch from './sections/CampaignLaunch';

import { saveApiKeysAction, getSavedServicesAction } from '@/app/actions/keys';

type SectionId = 'import' | 'store' | 'audience' | 'copy' | 'ads' | 'campaign' | 'settings';

const SECTIONS: { id: SectionId; label: string; icon: any; color: string; step?: number }[] = [
  { id: 'import', label: 'Import Product', icon: Package, color: 'indigo', step: 1 },
  { id: 'store', label: 'Store Builder', icon: Store, color: 'emerald', step: 2 },
  { id: 'audience', label: 'Audience Intel', icon: Target, color: 'purple', step: 3 },
  { id: 'copy', label: 'Copy Engine', icon: Pen, color: 'amber', step: 4 },
  { id: 'ads', label: 'Ads Creator', icon: Film, color: 'rose', step: 5 },
  { id: 'campaign', label: 'Campaign Launch', icon: Rocket, color: 'blue', step: 6 },
  { id: 'settings', label: 'API Keys & Settings', icon: Settings2, color: 'zinc' },
];

const colorMap: Record<string, { active: string; glow: string; text: string; icon: string }> = {
  indigo: { active: 'bg-indigo-600', glow: 'shadow-[0_0_30px_rgba(79,70,229,0.3)]', text: 'text-indigo-400', icon: 'bg-indigo-600/20' },
  emerald: { active: 'bg-emerald-600', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]', text: 'text-emerald-400', icon: 'bg-emerald-600/20' },
  purple: { active: 'bg-purple-600', glow: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]', text: 'text-purple-400', icon: 'bg-purple-600/20' },
  amber: { active: 'bg-amber-600', glow: 'shadow-[0_0_30px_rgba(217,119,6,0.3)]', text: 'text-amber-400', icon: 'bg-amber-600/20' },
  rose: { active: 'bg-rose-600', glow: 'shadow-[0_0_30px_rgba(225,29,72,0.3)]', text: 'text-rose-400', icon: 'bg-rose-600/20' },
  blue: { active: 'bg-blue-600', glow: 'shadow-[0_0_30px_rgba(37,99,235,0.3)]', text: 'text-blue-400', icon: 'bg-blue-600/20' },
  zinc: { active: 'bg-zinc-700', glow: 'shadow-[0_0_20px_rgba(100,100,100,0.2)]', text: 'text-zinc-400', icon: 'bg-zinc-600/20' },
};

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('import');

  // Shared state across sections
  const [productData, setProductData] = useState<any>(null);
  const [audienceData, setAudienceData] = useState<any>(null);
  const [creatives, setCreatives] = useState<{ static: any[]; video: any[] }>({ static: [], video: [] });

  // Settings state
  const [isSaving, setIsSaving] = useState(false);
  const [savedServices, setSavedServices] = useState<string[]>([]);
  const [apiKeys, setApiKeys] = useState({
    anthropic: '', serper: '', shopify_name: '', shopify_token: '',
    higgsfield: '', meta_token: '', meta_ad_account: ''
  });

  const handleSaveKeys = async () => {
    setIsSaving(true);
    try {
      await saveApiKeysAction(apiKeys);
      const saved = await getSavedServicesAction();
      setSavedServices(saved);
      setApiKeys({ anthropic: '', serper: '', shopify_name: '', shopify_token: '', higgsfield: '', meta_token: '', meta_ad_account: '' });
      alert('Configurations saved securely!');
    } catch { alert('Failed to save keys'); }
    finally { setIsSaving(false); }
  };

  const completedSteps = [
    productData ? 'import' : null,
    null, // store - always in progress
    audienceData ? 'audience' : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-outfit flex overflow-hidden text-left">
      {/* SIDEBAR */}
      <motion.aside className="w-72 bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col gap-6 z-20 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer px-2 py-3" onClick={() => setActiveSection('import')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tighter italic uppercase block leading-none">Gorny Ron</span>
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">AI Marketing Ops</span>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="space-y-1">
          <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] px-3 mb-3">Pipeline</div>
          {SECTIONS.filter(s => s.step).map((section) => {
            const isActive = activeSection === section.id;
            const isCompleted = completedSteps.includes(section.id);
            const colors = colorMap[section.color];

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-300 ${isActive ? `${colors.active} ${colors.glow}` : 'hover:bg-white/5'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-white/20' : isCompleted ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                  {isCompleted && !isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <section.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                    {section.label}
                  </span>
                  {section.step && (
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? 'text-white/50' : 'text-zinc-700'}`}>
                      Step {section.step}
                    </span>
                  )}
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-white/50 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Settings */}
        <div className="mt-auto space-y-1">
          <div className="h-px bg-white/5 mb-3" />
          {SECTIONS.filter(s => !s.step).map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group flex items-center gap-3 w-full p-3 rounded-2xl transition-all ${isActive ? 'bg-zinc-800' : 'hover:bg-white/5'}`}
              >
                <section.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-600'}`} />
                <span className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-zinc-500'}`}>{section.label}</span>
              </button>
            );
          })}
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative p-12 lg:p-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeSection === 'import' && (
            <ProductImport
              key="import"
              onProductImported={(data) => setProductData(data)}
              productData={productData}
            />
          )}

          {activeSection === 'store' && (
            <StoreBuilder 
              key="store" 
              productData={productData} 
              onProductSaved={(data) => setProductData({ ...productData, ...data })}
            />
          )}

          {activeSection === 'audience' && (
            <AudienceIntel
              key="audience"
              onAudienceIdentified={(data) => setAudienceData(data)}
              audienceData={audienceData}
            />
          )}

          {activeSection === 'copy' && (
            <CopyEngine 
              key="copy" 
              audienceData={audienceData} 
              productData={productData}
            />
          )}

          {activeSection === 'ads' && (
            <AdsCreator 
              key="ads" 
              onCreativesUpdated={(data) => setCreatives(data)}
              creatives={creatives}
            />
          )}

          {activeSection === 'campaign' && (
            <CampaignLaunch 
              key="campaign" 
              creatives={creatives}
              productData={productData}
            />
          )}

          {activeSection === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <header className="mb-12">
                <div className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                  <Settings2 className="w-4 h-4" /> Configuration
                </div>
                <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
                  System <span className="text-zinc-600">Keys</span>
                </h1>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Intelligence */}
                <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400"><Target className="w-5 h-5" /></div>
                    <h2 className="text-xl font-black uppercase italic">Intelligence & Logic</h2>
                  </div>
                  <ApiKeyInput label="Anthropic API Key (Claude)" value={apiKeys.anthropic} onChange={(v) => setApiKeys({ ...apiKeys, anthropic: v })} placeholder="sk-ant-..." isSaved={savedServices.includes('anthropic')} />
                  <ApiKeyInput label="Serper.dev API Key (Search)" value={apiKeys.serper} onChange={(v) => setApiKeys({ ...apiKeys, serper: v })} placeholder="Actual Google search access..." isSaved={savedServices.includes('serper')} />
                </div>

                {/* Store */}
                <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400"><Store className="w-5 h-5" /></div>
                    <h2 className="text-xl font-black uppercase italic">Store & Sourcing</h2>
                  </div>
                  <ApiKeyInput label="Shopify Shop Name" value={apiKeys.shopify_name} onChange={(v) => setApiKeys({ ...apiKeys, shopify_name: v })} placeholder="my-store.myshopify.com" isSaved={savedServices.includes('shopify_name')} />
                  <ApiKeyInput label="Shopify Admin Token" value={apiKeys.shopify_token} onChange={(v) => setApiKeys({ ...apiKeys, shopify_token: v })} placeholder="shpat_..." isSaved={savedServices.includes('shopify_token')} />
                </div>

                {/* Creative */}
                <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400"><Film className="w-5 h-5" /></div>
                    <h2 className="text-xl font-black uppercase italic">Creative Assets</h2>
                  </div>
                  <ApiKeyInput label="Higgsfield API Key" value={apiKeys.higgsfield} onChange={(v) => setApiKeys({ ...apiKeys, higgsfield: v })} placeholder="for hyper-realistic AI video..." isSaved={savedServices.includes('higgsfield')} />
                </div>

                {/* Ads */}
                <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400"><Rocket className="w-5 h-5" /></div>
                    <h2 className="text-xl font-black uppercase italic">Meta Marketing</h2>
                  </div>
                  <ApiKeyInput label="Meta Access Token" value={apiKeys.meta_token} onChange={(v) => setApiKeys({ ...apiKeys, meta_token: v })} placeholder="EAA..." isSaved={savedServices.includes('meta_token')} />
                  <ApiKeyInput label="Meta Ad Account ID" value={apiKeys.meta_ad_account} onChange={(v) => setApiKeys({ ...apiKeys, meta_ad_account: v })} placeholder="act_..." isSaved={savedServices.includes('meta_ad_account')} />
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSaveKeys} disabled={isSaving} className="px-12 py-6 rounded-3xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-2xl disabled:opacity-50">
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save All Configuration</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ApiKeyInput({ label, value, onChange, placeholder, isSaved = false }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; isSaved?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{label}</label>
        {isSaved && <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Configured</span>}
      </div>
      <div className="relative group">
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-[12px] font-mono focus:border-indigo-500 focus:outline-none transition-all group-hover:border-white/20"
        />
        {value && <CheckCircle2 className="absolute right-5 top-4 w-4 h-4 text-emerald-500" />}
      </div>
    </div>
  );
}
