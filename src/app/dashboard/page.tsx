'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Store, Palette, Rocket, LayoutDashboard, BarChart3, Settings, 
  ChevronRight, Plus, Zap, ShieldCheck, Globe, MoreVertical, Link as LinkIcon, 
  ArrowLeft, Target, Eye, DollarSign, Play, Pause as PauseIcon, RefreshCcw,
  TrendingUp, TrendingDown, Trash2, Sliders, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'monitoring'>('pipeline');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [productUrl, setProductUrl] = useState('');
  const [budget, setBudget] = useState('50');
  const [isLaunching, setIsLaunching] = useState(false);

  const steps = [
    { id: 1, title: 'Product Sourcing', status: 'completed', icon: Search, desc: 'DSers: Found cheapest reliable supplier' },
    { id: 2, title: 'Store Builder', status: 'current', icon: Store, desc: 'Shopify: Designing high-conversion theme' },
    { id: 3, title: 'Creative Suite', status: 'upcoming', icon: Palette, desc: 'AI: Generating scripts, videos & copy' },
    { id: 4, title: 'Campaign Launch', status: 'upcoming', icon: Rocket, desc: 'Meta: Ready for budget injection' },
  ];

  const adPipeline = [
    { id: 'ad_1', name: 'Video Ad #1 - Golden Hour', status: 'Active', spend: 142, roas: 4.2, cpm: 12.4, ctr: '2.8%', budget: 20 },
    { id: 'ad_2', name: 'Image Ad #2 - Feature List', status: 'Active', spend: 98, roas: 2.1, cpm: 15.1, ctr: '1.4%', budget: 20 },
    { id: 'ad_3', name: 'Short Ad #3 - User Testimonial', status: 'Active', spend: 110, roas: 3.5, cpm: 10.8, ctr: '2.1%', budget: 30 },
    { id: 'ad_4', name: 'Video Ad #4 - Side-by-Side', status: 'Paused', spend: 50, roas: 0.8, cpm: 22.4, ctr: '0.6%', budget: 10 },
  ];

  const liveTests = [
    { id: 1, name: 'Crystal Lamp Store', status: 'Active', ads_count: 5, total_spend: 450, color: 'from-emerald-500/20 to-emerald-500/5' },
    { id: 2, name: 'Aroma Diffuser V2', status: 'Optimizing', ads_count: 3, total_spend: 120, color: 'from-blue-500/20 to-blue-500/5' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-outfit flex overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside className="w-80 bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col gap-12 z-20">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setSelectedStore(null); setActiveTab('pipeline'); }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter italic">GORNY RON</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem active={activeTab === 'pipeline' && !selectedStore} onClick={() => { setActiveTab('pipeline'); setSelectedStore(null); }} icon={LayoutDashboard} label="Production Pipeline" />
          <NavItem active={activeTab === 'monitoring' || !!selectedStore} onClick={() => { setActiveTab('monitoring'); setSelectedStore(null); }} icon={BarChart3} label="Live Monitoring" />
        </nav>

        <div className="space-y-6">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-2">Launch Automated Test</div>
          <div className="space-y-3">
            <div className="relative">
              <input type="text" placeholder="AliExpress Product URL..." value={productUrl} onChange={(e) => setProductUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs focus:border-indigo-500 focus:outline-none" />
              <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
            </div>
            <div className="relative">
              <input type="number" placeholder="Daily Budget ($)..." value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs focus:border-indigo-500 focus:outline-none" />
              <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
            </div>
            <button onClick={() => setIsLaunching(true)} className="w-full py-3 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all">Start Machine</button>
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase">
              <span>Agent Status</span>
              <span className="text-emerald-500">All Systems Go</span>
            </div>
            <div className="flex -space-x-2">
              {['🤖', '🎨', '🛒', '📈'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-xs">{emoji}</div>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto relative p-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <AnimatePresence mode="wait">
          {selectedStore ? (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setSelectedStore(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tests
              </button>
              
              <header className="flex justify-between items-end mb-16">
                <div>
                  <h1 className="text-6xl font-black tracking-tight mb-2">{selectedStore.name}</h1>
                  <p className="text-zinc-400">Real-time Ad Metrics & Optimization Control</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" /> Sync Metrics
                  </button>
                </div>
              </header>

              <div className="space-y-6">
                {adPipeline.map((ad) => (
                  <div key={ad.id} className="p-8 rounded-[40px] bg-zinc-950/50 border border-white/5 flex items-center gap-12 group hover:border-white/10 transition-all">
                    <div className="w-24 h-24 rounded-3xl bg-zinc-800 overflow-hidden border border-white/10">
                      <img src={`https://picsum.photos/seed/${ad.id}/200/200`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black">{ad.name}</h3>
                        <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${ad.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{ad.status}</span>
                      </div>
                      <div className="flex gap-8 text-zinc-500 text-[11px] font-bold">
                        <div>CPM: <span className="text-white">${ad.cpm}</span></div>
                        <div>CTR: <span className="text-white">{ad.ctr}</span></div>
                        <div>Spend: <span className="text-white">${ad.spend}</span></div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-[10px] text-zinc-600 font-bold uppercase mb-1">ROAS</div>
                      <div className={`text-4xl font-black tracking-tighter ${ad.roas >= 3 ? 'text-emerald-400' : 'text-blue-400'}`}>{ad.roas}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end mr-4">
                        <div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Daily Budget</div>
                        <div className="text-lg font-black text-white">${ad.budget}</div>
                      </div>
                      <button title="Scale Up (Raise Budget)" className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">
                        <TrendingUp className="w-5 h-5" />
                      </button>
                      <button title="Kill Ad (Pause)" className="p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'pipeline' ? (
            <motion.div key="pipeline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <header className="flex justify-between items-end mb-16">
                <div>
                  <div className="text-indigo-400 font-bold text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></div> Production Line
                  </div>
                  <h1 className="text-6xl font-black tracking-tight">Machine <span className="text-zinc-600">Active</span></h1>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {steps.map((step) => (
                  <div key={step.id} className={`p-8 rounded-[40px] border transition-all ${step.status === 'current' ? 'bg-indigo-600/10 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-zinc-950 border-white/5 opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${step.status === 'completed' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-indigo-400'}`}>
                      {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                    </div>
                    <h3 className="text-lg font-black mb-2">{step.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-12 rounded-[50px] bg-zinc-950 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-purple-500 border-b-transparent animate-spin"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black mb-2 tracking-tight italic uppercase">Processing Creative Scripts...</h2>
                    <p className="text-zinc-500 text-sm max-w-lg">The AI Creative Agent is writing 5 unique video scripts and drafting ad headlines for the specified product. Ready to generate visuals next.</p>
                  </div>
                  <button className="ml-auto px-10 py-5 rounded-3xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Review Scripts</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="monitoring" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <header className="mb-16"><h1 className="text-6xl font-black tracking-tight mb-4">Command Center</h1><p className="text-zinc-400 text-xl">Manage launched tests. Kill the losers, scale the winners.</p></header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {liveTests.map((test) => (
                  <div key={test.id} onClick={() => setSelectedStore(test)} className="p-8 rounded-[40px] bg-zinc-950 border border-white/5 cursor-pointer relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${test.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">📦</div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${test.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>{test.status}</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight mb-2">{test.name}</h3>
                      <div className="mt-8 flex justify-between items-end"><div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Total Ads: {test.ads_count}</div><ChevronRight className="w-6 h-6 text-zinc-700 group-hover:text-white transition-colors" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.3)]' : 'hover:bg-white/5'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
      <span className={`text-sm font-bold tracking-tight ${active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{label}</span>
    </button>
  );
}
