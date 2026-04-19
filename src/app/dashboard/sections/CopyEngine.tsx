'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pen, Sparkles, Loader2, CheckCircle2, Upload, FileText,
  MessageSquare, ChevronRight, X, Eye, Copy, RefreshCcw
} from 'lucide-react';

interface CopyEngineProps {
  audienceData: any;
}

const COPY_QUESTIONS = [
  { id: 'tone', label: 'What tone of voice fits your brand?', placeholder: 'e.g. Bold and authoritative, Casual and fun, Premium and sleek...' },
  { id: 'unique_angle', label: 'What makes YOUR product different from competitors?', placeholder: 'e.g. Only one with LED display, smaller than others, 2x more power...' },
  { id: 'social_proof', label: 'Do you have any social proof or testimonials?', placeholder: 'e.g. 10K+ sold, featured on TikTok, 4.9 star reviews...' },
  { id: 'guarantee', label: 'What guarantee or risk-reversal do you offer?', placeholder: 'e.g. 30-day money back, lifetime warranty, free replacement...' },
  { id: 'urgency', label: 'Any scarcity or urgency elements?', placeholder: 'e.g. Limited stock, launch discount, seasonal product...' },
];

export default function CopyEngine({ audienceData }: CopyEngineProps) {
  const [mode, setMode] = useState<'questions' | 'generating' | 'done'>('questions');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [generatedCopy, setGeneratedCopy] = useState({
    headline: '',
    subheadline: '',
    aboveFold: '',
    belowFold: '',
    cta: '',
    socialProof: ''
  });

  const handleGenerate = async () => {
    setMode('generating');
    // This will use the copywriting skill + Anthropic API
    setTimeout(() => {
      setGeneratedCopy({
        headline: 'Dry Your Entire Car In Under 3 Minutes — Without Touching The Paint.',
        subheadline: 'The 130,000 RPM pocket-sized turbine that professional detailers are switching to.',
        aboveFold: 'You know that feeling when you spend 30 minutes hand-drying your car — only to find watermarks and scratches everywhere?\n\nWhat if there was a way to blast every single droplet off your car in under 3 minutes, without ever touching the paint?\n\nIntroducing the TurboJet Pro — the world\'s most powerful cordless air blower, built for people who actually care about their car.',
        belowFold: '✅ 130,000 RPM turbine engine — more powerful than compressed air\n✅ 4 speed settings with LED display\n✅ Cordless & rechargeable — lasts 45+ minutes per charge\n✅ Weighs only 1.2 lbs — fits in your glove box\n✅ Works on cars, bikes, keyboards, workshops\n\nStop wasting money on expensive compressed air. Stop scratching your paint with towels.\n\nThe TurboJet Pro pays for itself after 2 uses.',
        cta: 'Get Yours Before They\'re Gone — 50% OFF Launch Price',
        socialProof: '⭐⭐⭐⭐⭐ "I\'ve tried MetroVac and 3 other blowers. This one is genuinely the best." — Mike R., Professional Detailer'
      });
      setMode('done');
    }, 4000);
  };

  if (!audienceData) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <header className="text-left">
          <div className="text-amber-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            <Pen className="w-4 h-4" /> Step 4
          </div>
          <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
            Copy <span className="text-zinc-600">Engine</span>
          </h1>
        </header>
        <div className="p-20 rounded-[40px] bg-zinc-950 border border-white/5 text-center">
          <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Complete Audience Intel first</p>
          <p className="text-zinc-700 text-xs mt-2">We need to know your audience before writing copy</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="text-left">
        <div className="text-amber-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
          <Pen className="w-4 h-4" /> Step 4
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
          Copy <span className="text-zinc-600">Engine</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl">
          Direct response copywriting that converts visitors into buyers.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {mode === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase italic">Deep Dive Questions</h2>
              <span className="text-[10px] font-black text-zinc-600">{currentQuestion + 1} / {COPY_QUESTIONS.length}</span>
            </div>

            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-amber-500" animate={{ width: `${((currentQuestion + 1) / COPY_QUESTIONS.length) * 100}%` }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentQuestion} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                <label className="text-lg font-black text-white block">{COPY_QUESTIONS[currentQuestion].label}</label>
                <textarea
                  value={answers[COPY_QUESTIONS[currentQuestion].id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [COPY_QUESTIONS[currentQuestion].id]: e.target.value })}
                  placeholder={COPY_QUESTIONS[currentQuestion].placeholder}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-amber-500 focus:outline-none transition-all resize-none"
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="px-8 py-3 rounded-xl bg-white/5 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() => currentQuestion < COPY_QUESTIONS.length - 1 ? setCurrentQuestion(currentQuestion + 1) : handleGenerate()}
                className="px-8 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 flex items-center gap-2"
              >
                {currentQuestion === COPY_QUESTIONS.length - 1 ? (
                  <><Sparkles className="w-3.5 h-3.5" /> Generate Copy</>
                ) : (
                  <>Next <ChevronRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-20 rounded-[40px] bg-zinc-950 border border-white/5 text-center space-y-6">
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
            <h2 className="text-2xl font-black uppercase italic">Writing Direct Response Copy</h2>
            <p className="text-zinc-500 text-sm">Crafting high-converting headlines, body copy, and CTAs...</p>
          </motion.div>
        )}

        {mode === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Above the Fold */}
            <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase text-amber-400 tracking-[0.3em]">Above The Fold</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-zinc-500 hover:bg-white/10 flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-zinc-500 hover:bg-white/10 flex items-center gap-1">
                    <RefreshCcw className="w-3 h-3" /> Regenerate
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white leading-tight">{generatedCopy.headline}</h3>
                <p className="text-lg text-zinc-400 font-medium">{generatedCopy.subheadline}</p>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line pt-4 border-t border-white/5">
                  {generatedCopy.aboveFold}
                </div>
              </div>
            </div>

            {/* Below the Fold */}
            <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase text-amber-400 tracking-[0.3em]">Below The Fold</h2>
                <button className="px-4 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-zinc-500 hover:bg-white/10 flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {generatedCopy.belowFold}
              </div>
            </div>

            {/* CTA + Social Proof */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-[40px] bg-emerald-600/5 border border-emerald-500/20 space-y-4">
                <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Call To Action</div>
                <p className="text-lg font-black text-white">{generatedCopy.cta}</p>
              </div>
              <div className="p-8 rounded-[40px] bg-amber-600/5 border border-amber-500/20 space-y-4">
                <div className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Social Proof</div>
                <p className="text-sm text-zinc-300 italic">{generatedCopy.socialProof}</p>
              </div>
            </div>

            {/* Push to Shopify */}
            <button className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5" /> Push Copy to Shopify Store
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
