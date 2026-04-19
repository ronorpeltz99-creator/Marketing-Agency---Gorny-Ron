'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Upload, FileText, MessageSquare, CheckCircle2, Loader2,
  ChevronRight, Users, Heart, Sparkles, Send, X, Plus
} from 'lucide-react';

interface AudienceData {
  productName: string;
  targetAudience: string;
  niche: string;
  desires: string[];
  painPoints: string[];
  demographics: string;
}

interface AudienceIntelProps {
  onAudienceIdentified: (data: AudienceData) => void;
  audienceData: AudienceData | null;
}

const QUESTIONS = [
  { id: 'product_name', label: 'What is the name of your product?', placeholder: 'e.g. TurboJet 130K RPM Portable Air Blower' },
  { id: 'product_desc', label: 'Describe what the product does in 1-2 sentences', placeholder: 'e.g. A powerful cordless air blower that dries cars in under 3 minutes...' },
  { id: 'target_audience', label: 'Who is the ideal customer? Be specific.', placeholder: 'e.g. Car detailers aged 25-45, PC builders, tech enthusiasts...' },
  { id: 'niche', label: 'What niche / market does this product belong to?', placeholder: 'e.g. Auto detailing, tech gadgets, home tools...' },
  { id: 'main_desire', label: 'What is the #1 desire this product fulfills?', placeholder: 'e.g. Save time drying their car without watermarks...' },
  { id: 'pain_points', label: 'What problems does your audience face WITHOUT this product?', placeholder: 'e.g. Expensive compressed air, towel scratches, time wasted...' },
  { id: 'competitors', label: 'Name 1-3 competitors or similar products you know of', placeholder: 'e.g. MetroVac, Crossgun, generic Amazon blowers...' },
  { id: 'price_range', label: 'What price range are customers willing to pay?', placeholder: 'e.g. $40-$80 for this type of product' },
];

export default function AudienceIntel({ onAudienceIdentified, audienceData }: AudienceIntelProps) {
  const [mode, setMode] = useState<'choose' | 'upload' | 'questions' | 'analyzing' | 'done'>('choose');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeData();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const analyzeData = async () => {
    setMode('analyzing');
    // This will call the AI analysis skill
    setTimeout(() => {
      const result: AudienceData = {
        productName: answers.product_name || 'Product',
        targetAudience: answers.target_audience || 'General audience',
        niche: answers.niche || 'E-commerce',
        desires: [answers.main_desire || 'Quality product'],
        painPoints: (answers.pain_points || '').split(',').map(s => s.trim()),
        demographics: 'Male 25-45, income $50K+, urban areas'
      };
      onAudienceIdentified(result);
      setMode('done');
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="text-left">
        <div className="text-purple-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
          <Target className="w-4 h-4" /> Step 3
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
          Audience <span className="text-zinc-600">Intel</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl">
          Identify exactly who your product is for and what drives them to buy.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('upload')}
              className="p-12 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-purple-500/30 transition-all text-left group space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-600/10 flex items-center justify-center group-hover:bg-purple-600/20 transition-all">
                <Upload className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic mb-2">Upload Brief</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Upload a document that explains your product, target audience, niche, and key selling points.
                </p>
              </div>
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                Upload File <ChevronRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={() => setMode('questions')}
              className="p-12 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-indigo-500/30 transition-all text-left group space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-all">
                <MessageSquare className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic mb-2">Answer Questions</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Answer a series of targeted questions and we'll build the audience profile for you.
                </p>
              </div>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                Start Questionnaire <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </motion.div>
        )}

        {mode === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase italic">Upload Product Brief</h2>
              <button onClick={() => setMode('choose')} className="text-zinc-600 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div
              className="border-2 border-dashed border-white/10 rounded-3xl p-16 text-center hover:border-purple-500/30 transition-all cursor-pointer"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
              />
              {uploadedFile ? (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 text-purple-400 mx-auto" />
                  <p className="text-white font-bold">{uploadedFile.name}</p>
                  <p className="text-zinc-500 text-xs">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-zinc-700 mx-auto" />
                  <p className="text-zinc-500 font-bold">Drop your file here or click to browse</p>
                  <p className="text-zinc-700 text-xs">PDF, DOC, TXT, or MD</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <button onClick={analyzeData} className="w-full py-5 rounded-2xl bg-purple-600 text-white font-black text-sm uppercase tracking-widest hover:bg-purple-500 transition-all flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5" /> Analyze Document
              </button>
            )}
          </motion.div>
        )}

        {mode === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase italic">Questionnaire</h2>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-zinc-600">{currentQuestion + 1} / {QUESTIONS.length}</span>
                <button onClick={() => setMode('choose')} className="text-zinc-600 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Current Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <label className="text-lg font-black text-white block">
                  {QUESTIONS[currentQuestion].label}
                </label>
                <textarea
                  value={answers[QUESTIONS[currentQuestion].id] || ''}
                  onChange={(e) => handleAnswer(QUESTIONS[currentQuestion].id, e.target.value)}
                  placeholder={QUESTIONS[currentQuestion].placeholder}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-indigo-500 focus:outline-none transition-all resize-none"
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="px-8 py-3 rounded-xl bg-white/5 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 flex items-center gap-2"
              >
                {currentQuestion === QUESTIONS.length - 1 ? (
                  <><Sparkles className="w-3.5 h-3.5" /> Analyze</>
                ) : (
                  <>Next <ChevronRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-20 rounded-[40px] bg-zinc-950 border border-white/5 text-center space-y-6">
            <Loader2 className="w-16 h-16 text-indigo-400 mx-auto animate-spin" />
            <h2 className="text-2xl font-black uppercase italic">Analyzing Audience</h2>
            <p className="text-zinc-500 text-sm">Identifying target audience, desires, and pain points...</p>
          </motion.div>
        )}

        {mode === 'done' && audienceData && (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-10 rounded-[40px] bg-zinc-950 border border-emerald-500/20 space-y-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-black uppercase italic">Audience Identified</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                <Users className="w-6 h-6 text-indigo-400" />
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Target Audience</div>
                <p className="text-sm font-bold text-white">{audienceData.targetAudience}</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                <Target className="w-6 h-6 text-purple-400" />
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Niche</div>
                <p className="text-sm font-bold text-white">{audienceData.niche}</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                <Heart className="w-6 h-6 text-rose-400" />
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Core Desires</div>
                <div className="space-y-1">
                  {audienceData.desires.map((d, i) => (
                    <p key={i} className="text-xs font-medium text-zinc-300">{d}</p>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setMode('choose')} className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300">
              ← Re-analyze
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
