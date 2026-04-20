'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, DollarSign, Plus, Play, Pause, Eye, BarChart3,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, X,
  Settings2, Trash2, Sparkles, Loader2, CreditCard, ChevronDown
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  purchases: number;
  revenue: number;
  roas: number;
  creatives: string[];
}

interface AutoRule {
  id: string;
  condition: string;
  action: string;
  enabled: boolean;
}

import { launchCampaignAction } from '@/app/actions/meta';

export default function CampaignLaunch() {
  const [activeSubTab, setActiveSubTab] = useState<'campaigns' | 'rules' | 'budget'>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [selectedAdAccount, setSelectedAdAccount] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [campaignBudget, setCampaignBudget] = useState('50');

  const handleLaunch = async () => {
    if (!selectedAdAccount) {
      alert('Please select an ad account');
      return;
    }
    setIsLaunching(true);
    try {
      const result = await launchCampaignAction({
        name: `Turbo Campaign - ${new Date().toLocaleDateString()}`,
        budget: parseFloat(campaignBudget),
        storeId: 'your-store-id', // Should be dynamic
        productId: 'your-product-id' // Should be dynamic
      });
      
      if (result.success) {
        alert('Campaign launched on Meta!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert('Failed to launch campaign');
    } finally {
      setIsLaunching(false);
    }
  };

  const [campaigns] = useState<Campaign[]>([
    // Will be populated from Meta Ads API
  ]);

  const [autoRules, setAutoRules] = useState<AutoRule[]>([
    { id: '1', condition: 'Spend > $40 AND Purchases < 2', action: 'Pause Ad', enabled: true },
    { id: '2', condition: 'CTR < 1% AND Impressions > 1000', action: 'Pause Ad', enabled: true },
    { id: '3', condition: 'ROAS > 3x AND Spend > $20', action: 'Scale Budget +20%', enabled: false }
  ]);

  const [newRuleCondition, setNewRuleCondition] = useState('');
  const [newRuleAction, setNewRuleAction] = useState('');

  const handleAnalyze = async (campaign: Campaign) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    // This will use the analysis skill + Anthropic API
    setTimeout(() => {
      setAnalysisResult(
        campaign.roas > 2
          ? `✅ KEEP RUNNING — This ad is performing well with a ${campaign.roas}x ROAS. Consider scaling the budget by 20-30% to capitalize on momentum.`
          : `⚠️ CONSIDER PAUSING — With a ${campaign.roas}x ROAS and $${campaign.spend} spent, this ad is underperforming. Test new creative angles before scaling.`
      );
      setIsAnalyzing(false);
    }, 3000);
  };

  const addRule = () => {
    if (!newRuleCondition || !newRuleAction) return;
    setAutoRules([...autoRules, {
      id: `rule_${Date.now()}`,
      condition: newRuleCondition,
      action: newRuleAction,
      enabled: true
    }]);
    setNewRuleCondition('');
    setNewRuleAction('');
  };

  const toggleRule = (id: string) => {
    setAutoRules(autoRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id: string) => {
    setAutoRules(autoRules.filter(r => r.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="text-left">
        <div className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
          <Rocket className="w-4 h-4" /> Step 6
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
          Campaign <span className="text-zinc-600">Launch</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl">
          Launch, monitor, and optimize your Meta ad campaigns with auto-rules.
        </p>
      </header>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveSubTab('campaigns')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'campaigns' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>
          <Rocket className="w-3.5 h-3.5 inline mr-2" /> Campaigns
        </button>
        <button onClick={() => setActiveSubTab('rules')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'rules' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>
          <Settings2 className="w-3.5 h-3.5 inline mr-2" /> Auto-Rules
        </button>
        <button onClick={() => setActiveSubTab('budget')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'budget' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>
          <CreditCard className="w-3.5 h-3.5 inline mr-2" /> Budget & Accounts
        </button>
      </div>

      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Launch New Campaign */}
          <div className="p-8 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
            <h2 className="text-lg font-black uppercase italic">Launch New Campaign</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Campaign Budget (CBO)</label>
                <div className="relative">
                  <input type="number" value={campaignBudget} onChange={(e) => setCampaignBudget(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm font-black text-emerald-400 focus:border-emerald-500 focus:outline-none" />
                  <DollarSign className="absolute left-3.5 top-4 w-4 h-4 text-emerald-500/50" />
                  <span className="absolute right-4 top-4 text-[10px] font-bold text-zinc-600">/ day</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ad Account</label>
                <select
                  value={selectedAdAccount}
                  onChange={(e) => setSelectedAdAccount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm font-bold text-white focus:border-indigo-500 focus:outline-none appearance-none"
                >
                  <option value="">Select ad account...</option>
                  <option value="act_123">Main Ad Account</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleLaunch}
                  disabled={isLaunching || !selectedAdAccount}
                  className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLaunching ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Launching...</>
                  ) : (
                    <><Rocket className="w-4 h-4" /> Launch CBO Campaign</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          {campaigns.length === 0 ? (
            <div className="p-16 rounded-[40px] bg-zinc-950 border border-white/5 text-center">
              <Rocket className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">No active campaigns</p>
              <p className="text-zinc-700 text-xs mt-2">Create creatives in Ads Creator, then launch them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-8 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${campaign.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                      <h3 className="text-lg font-black">{campaign.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedCampaign(campaign)} className="px-4 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-zinc-400 hover:bg-white/10 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View Metrics
                      </button>
                      <button onClick={() => handleAnalyze(campaign)} className="px-4 py-2 rounded-lg bg-indigo-500/10 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Analyze Metrics
                      </button>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                    {[
                      { label: 'Spend', value: `$${campaign.spend}`, color: 'text-white' },
                      { label: 'Impressions', value: campaign.impressions.toLocaleString(), color: 'text-zinc-400' },
                      { label: 'Clicks', value: campaign.clicks.toLocaleString(), color: 'text-blue-400' },
                      { label: 'CTR', value: `${campaign.ctr}%`, color: campaign.ctr > 2 ? 'text-emerald-400' : 'text-red-400' },
                      { label: 'CPM', value: `$${campaign.cpm}`, color: 'text-zinc-400' },
                      { label: 'Purchases', value: campaign.purchases.toString(), color: 'text-emerald-400' },
                      { label: 'ROAS', value: `${campaign.roas}x`, color: campaign.roas > 2 ? 'text-emerald-400' : 'text-red-400' },
                    ].map((metric) => (
                      <div key={metric.label} className="p-3 rounded-xl bg-white/5 text-center">
                        <div className="text-[8px] text-zinc-600 uppercase font-bold">{metric.label}</div>
                        <div className={`text-sm font-black ${metric.color}`}>{metric.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Analysis Result */}
                  {analysisResult && selectedCampaign?.id === campaign.id && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" /> AI Analysis
                      </div>
                      <p className="text-sm text-zinc-300">{analysisResult}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'rules' && (
        <div className="space-y-6">
          <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
            <h2 className="text-lg font-black uppercase italic">Automation Rules</h2>
            <p className="text-zinc-500 text-xs">Set rules to automatically manage your ads based on performance metrics.</p>

            {/* Existing Rules */}
            <div className="space-y-3">
              {autoRules.map((rule) => (
                <div key={rule.id} className={`p-5 rounded-2xl border flex items-center justify-between ${rule.enabled ? 'bg-white/5 border-white/10' : 'bg-white/2 border-white/5 opacity-50'}`}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`w-10 h-5 rounded-full relative transition-all ${rule.enabled ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                    >
                      <motion.div animate={{ x: rule.enabled ? 22 : 2 }} className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-lg" />
                    </button>
                    <div>
                      <span className="text-xs font-bold text-white">IF </span>
                      <span className="text-xs font-mono text-indigo-400">{rule.condition}</span>
                      <span className="text-xs font-bold text-white"> → </span>
                      <span className="text-xs font-bold text-amber-400">{rule.action}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteRule(rule.id)} className="text-zinc-700 hover:text-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Rule */}
            <div className="p-6 rounded-2xl border border-dashed border-white/10 space-y-4">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Add New Rule</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-600">IF (Condition)</label>
                  <input
                    type="text"
                    value={newRuleCondition}
                    onChange={(e) => setNewRuleCondition(e.target.value)}
                    placeholder="e.g. Spend > $40 AND Purchases < 2"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-600">THEN (Action)</label>
                  <input
                    type="text"
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    placeholder="e.g. Pause Ad"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <button onClick={addRule} className="px-6 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" /> Add Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'budget' && (
        <div className="space-y-6">
          {/* Account Balance */}
          <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-8">
            <h2 className="text-lg font-black uppercase italic">Account Balance & Top Up</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/20 text-center space-y-4">
                <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Available Balance</div>
                <div className="text-6xl font-black text-white italic tracking-tighter">$0.00</div>
                <div className="text-[10px] text-zinc-500">Across all ad accounts</div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Top Up Amount</label>
                  <div className="relative">
                    <input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} placeholder="100" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-sm font-black text-emerald-400 focus:border-emerald-500 focus:outline-none" />
                    <DollarSign className="absolute left-3.5 top-4 w-4 h-4 text-emerald-500/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Ad Account</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm font-bold text-white focus:border-indigo-500 focus:outline-none appearance-none">
                    <option value="">Select ad account...</option>
                    <option value="act_123">Main Ad Account</option>
                  </select>
                </div>
                <button className="w-full py-4 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Top Up Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
