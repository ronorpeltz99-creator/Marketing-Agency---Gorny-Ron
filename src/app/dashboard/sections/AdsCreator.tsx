'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film, Image as ImageIcon, Upload, Sparkles, Loader2, CheckCircle2,
  X, Play, GripVertical, Shuffle, Type, ChevronRight,
  FolderOpen, Eye, Trash2, Plus, Video, Camera
} from 'lucide-react';

type VideoType = 'hook' | 'broll' | 'standard' | 'cta';
type CreativeType = 'image' | 'video';

interface Creative {
  id: string;
  type: CreativeType;
  subType?: VideoType;
  url: string;
  thumbnail: string;
  approved: boolean;
  order?: number;
}

export default function AdsCreator() {
  const [activeMode, setActiveMode] = useState<'create' | 'library'>('create');
  const [createType, setCreateType] = useState<CreativeType | null>(null);
  const [videoType, setVideoType] = useState<VideoType | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMixing, setIsMixing] = useState(false);

  // Image creation state
  const [competitorImage, setCompetitorImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Video creation state
  const [starterImage, setStarterImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  // Library
  const [videoCreatives, setVideoCreatives] = useState<Creative[]>([]);
  const [staticCreatives, setStaticCreatives] = useState<Creative[]>([]);
  const [pendingVideos, setPendingVideos] = useState<Creative[]>([]);
  const [selectedForMix, setSelectedForMix] = useState<string[]>([]);

  const handleImageUpload = (setter: (url: string) => void) => {
    // Simulated upload
    setter('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23333" width="400" height="400"/><text fill="%23999" x="200" y="200" text-anchor="middle" dy=".3em" font-size="14">Uploaded Image</text></svg>');
  };

  const handleRecreate = async () => {
    if (!competitorImage || !productImage) return;
    setIsGenerating(true);
    // This will call the image recreation model
    setTimeout(() => {
      setGeneratedImage('generated');
      setIsGenerating(false);
    }, 3000);
  };

  const handleGenerateVideo = async () => {
    if (!starterImage || !videoType) return;
    setIsGenerating(true);
    // This will call the video generation model with the appropriate skill
    setTimeout(() => {
      setGeneratedVideo('generated');
      setIsGenerating(false);
    }, 4000);
  };

  const approveImage = () => {
    const newCreative: Creative = {
      id: `static_${Date.now()}`,
      type: 'image',
      url: 'approved-image',
      thumbnail: '',
      approved: true
    };
    setStaticCreatives([...staticCreatives, newCreative]);
    setGeneratedImage(null);
    setCompetitorImage(null);
    setProductImage(null);
    setShowPopup(false);
  };

  const approveVideo = () => {
    if (!videoType) return;
    const newCreative: Creative = {
      id: `video_${Date.now()}`,
      type: 'video',
      subType: videoType,
      url: 'approved-video',
      thumbnail: '',
      approved: true
    };
    setPendingVideos([...pendingVideos, newCreative]);
    setGeneratedVideo(null);
    setStarterImage(null);
    setVideoType(null);
  };

  const handleMix = async () => {
    if (selectedForMix.length === 0) return;
    setIsMixing(true);
    // This will call the video mixing + subtitle service
    setTimeout(() => {
      const mixedVideo: Creative = {
        id: `mixed_${Date.now()}`,
        type: 'video',
        url: 'mixed-final',
        thumbnail: '',
        approved: true
      };
      setVideoCreatives([...videoCreatives, mixedVideo]);
      setSelectedForMix([]);
      setPendingVideos([]);
      setIsMixing(false);
    }, 5000);
  };

  const toggleSelectForMix = (id: string) => {
    if (selectedForMix.includes(id)) {
      setSelectedForMix(selectedForMix.filter(s => s !== id));
    } else {
      setSelectedForMix([...selectedForMix, id]);
    }
  };

  const videoTypeLabels: Record<VideoType, { label: string; color: string; desc: string }> = {
    hook: { label: 'HOOK', color: 'text-red-400 bg-red-500/10 border-red-500/20', desc: 'Attention-grabbing opening shot' },
    broll: { label: 'B-ROLL', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', desc: 'Supporting footage and angles' },
    standard: { label: 'STANDARD', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: 'Main product demonstration' },
    cta: { label: 'CTA', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', desc: 'Call to action closing shot' }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="text-left">
        <div className="text-rose-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
          <Film className="w-4 h-4" /> Step 5
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none uppercase italic">
          Ads <span className="text-zinc-600">Creator</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl">
          Create converting ad creatives — images from competitor references, videos with Hook/B-Roll/Standard/CTA structure.
        </p>
      </header>

      {/* Mode Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveMode('create')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'create' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>
          <Plus className="w-3.5 h-3.5 inline mr-2" /> Create New
        </button>
        <button onClick={() => setActiveMode('library')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'library' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}>
          <FolderOpen className="w-3.5 h-3.5 inline mr-2" /> Creative Library
        </button>
      </div>

      {activeMode === 'create' ? (
        <>
          {/* Format Selection */}
          {!createType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => { setCreateType('image'); setShowPopup(true); }} className="p-12 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-rose-500/30 transition-all text-left group space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-600/10 flex items-center justify-center group-hover:bg-rose-600/20 transition-all">
                  <Camera className="w-8 h-8 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic mb-2">Static Image</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">Recreate a competitor's ad with your product and branding.</p>
                </div>
              </button>

              <button onClick={() => setCreateType('video')} className="p-12 rounded-[40px] bg-zinc-950 border border-white/5 hover:border-indigo-500/30 transition-all text-left group space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-all">
                  <Video className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic mb-2">Video Ad</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">Create Hook, B-Roll, Standard, and CTA clips, then mix them together.</p>
                </div>
              </button>
            </div>
          )}

          {/* Video Type Selection */}
          {createType === 'video' && !videoType && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase italic">Select Video Type</h2>
                <button onClick={() => setCreateType(null)} className="text-zinc-600 hover:text-white text-[10px] font-bold uppercase tracking-widest">← Back</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.keys(videoTypeLabels) as VideoType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setVideoType(type)}
                    className={`p-8 rounded-3xl border transition-all text-left hover:scale-[1.02] ${videoTypeLabels[type].color}`}
                  >
                    <div className="text-2xl font-black uppercase italic mb-2">{videoTypeLabels[type].label}</div>
                    <p className="text-xs opacity-70">{videoTypeLabels[type].desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Video Creation */}
          {createType === 'video' && videoType && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${videoTypeLabels[videoType].color}`}>
                    {videoTypeLabels[videoType].label}
                  </span>
                  <h2 className="text-xl font-black uppercase italic">Video Creator</h2>
                </div>
                <button onClick={() => { setVideoType(null); setStarterImage(null); setGeneratedVideo(null); }} className="text-zinc-600 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upload Starter Image (First Frame)</label>
                <button
                  onClick={() => handleImageUpload(setStarterImage)}
                  className={`w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${starterImage ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 hover:border-indigo-500/30'}`}
                >
                  {starterImage ? (
                    <><CheckCircle2 className="w-8 h-8 text-emerald-400" /><span className="text-xs font-bold text-emerald-400">Image Uploaded</span></>
                  ) : (
                    <><Upload className="w-8 h-8 text-zinc-700" /><span className="text-xs font-bold text-zinc-600">Click to upload starter image</span></>
                  )}
                </button>
              </div>

              {starterImage && !generatedVideo && (
                <button onClick={handleGenerateVideo} disabled={isGenerating} className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating {videoTypeLabels[videoType].label}...</> : <><Sparkles className="w-5 h-5" /> Generate {videoTypeLabels[videoType].label} Video</>}
                </button>
              )}

              {generatedVideo && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="aspect-video rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/30" />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={approveVideo} className="flex-1 py-4 rounded-2xl bg-emerald-500 text-black font-black text-sm uppercase tracking-widest hover:bg-emerald-400 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Approve
                    </button>
                    <button onClick={() => setGeneratedVideo(null)} className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-sm uppercase tracking-widest hover:bg-red-500/20 flex items-center justify-center gap-2">
                      <X className="w-5 h-5" /> Reject
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Pending Videos for Mix */}
          {pendingVideos.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-[40px] bg-zinc-950 border border-indigo-500/20 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase italic">Approved Clips — Ready to Mix</h2>
                <span className="text-[10px] font-black text-indigo-400">{pendingVideos.length} clips</span>
              </div>
              <p className="text-zinc-500 text-xs">Select clips in order — Hook first, then Standard, B-Roll, and CTA.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pendingVideos.map((clip, i) => (
                  <button
                    key={clip.id}
                    onClick={() => toggleSelectForMix(clip.id)}
                    className={`p-6 rounded-3xl border transition-all relative ${selectedForMix.includes(clip.id) ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    {selectedForMix.includes(clip.id) && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white">
                        {selectedForMix.indexOf(clip.id) + 1}
                      </div>
                    )}
                    <Play className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                    <div className={`text-[10px] font-black uppercase text-center ${clip.subType ? videoTypeLabels[clip.subType].color.split(' ')[0] : 'text-white'}`}>
                      {clip.subType ? videoTypeLabels[clip.subType].label : 'Clip'}
                    </div>
                  </button>
                ))}
              </div>

              {selectedForMix.length > 0 && (
                <button onClick={handleMix} disabled={isMixing} className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isMixing ? <><Loader2 className="w-5 h-5 animate-spin" /> Mixing + Adding Subtitles...</> : <><Shuffle className="w-5 h-5" /> Mix {selectedForMix.length} Clips + Auto Subtitles</>}
                </button>
              )}
            </motion.div>
          )}
        </>
      ) : (
        /* Creative Library */
        <div className="space-y-8">
          {/* Video Creatives */}
          <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-black uppercase italic">Video Creatives</h2>
              <span className="text-[10px] font-black text-zinc-600 bg-white/5 px-3 py-1 rounded-full">{videoCreatives.length}</span>
            </div>
            {videoCreatives.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-700 text-xs font-bold">No mixed videos yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {videoCreatives.map((v) => (
                  <div key={v.id} className="aspect-video rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center relative group">
                    <Play className="w-10 h-10 text-white/20" />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 text-[8px] font-black text-white uppercase">Final Mix</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Static Creatives */}
          <div className="p-10 rounded-[40px] bg-zinc-950 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-black uppercase italic">Static Creatives</h2>
              <span className="text-[10px] font-black text-zinc-600 bg-white/5 px-3 py-1 rounded-full">{staticCreatives.length}</span>
            </div>
            {staticCreatives.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-700 text-xs font-bold">No approved images yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {staticCreatives.map((img) => (
                  <div key={img.id} className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/20" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* IMAGE RECREATION POPUP */}
      <AnimatePresence>
        {showPopup && createType === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
            onClick={() => { setShowPopup(false); setCreateType(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl p-10 rounded-[40px] bg-zinc-950 border border-white/10 space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase italic">Recreate Ad</h2>
                <button onClick={() => { setShowPopup(false); setCreateType(null); }} className="text-zinc-600 hover:text-white"><X className="w-6 h-6" /></button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Competitor Image */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Competitor Ad</label>
                  <button
                    onClick={() => handleImageUpload(setCompetitorImage)}
                    className={`w-full aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${competitorImage ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10 hover:border-rose-500/30'}`}
                  >
                    {competitorImage ? (
                      <><CheckCircle2 className="w-8 h-8 text-rose-400" /><span className="text-xs font-bold text-rose-400">Uploaded</span></>
                    ) : (
                      <><Upload className="w-8 h-8 text-zinc-700" /><span className="text-xs font-bold text-zinc-600">Upload competitor ad</span></>
                    )}
                  </button>
                </div>

                {/* Product Image */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Product (White BG preferred)</label>
                  <button
                    onClick={() => handleImageUpload(setProductImage)}
                    className={`w-full aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${productImage ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/30'}`}
                  >
                    {productImage ? (
                      <><CheckCircle2 className="w-8 h-8 text-emerald-400" /><span className="text-xs font-bold text-emerald-400">Uploaded</span></>
                    ) : (
                      <><Upload className="w-8 h-8 text-zinc-700" /><span className="text-xs font-bold text-zinc-600">Upload product image</span></>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Result */}
              {generatedImage && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Generated Ad</div>
                  <div className="aspect-video rounded-3xl bg-white/5 border border-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-emerald-400/30" />
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              {!generatedImage ? (
                <button
                  onClick={handleRecreate}
                  disabled={!competitorImage || !productImage || isGenerating}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Recreating...</> : <><Sparkles className="w-5 h-5" /> Recreate</>}
                </button>
              ) : (
                <div className="flex gap-4">
                  <button onClick={approveImage} className="flex-1 py-4 rounded-2xl bg-emerald-500 text-black font-black text-sm uppercase tracking-widest hover:bg-emerald-400 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Approve
                  </button>
                  <button onClick={() => setGeneratedImage(null)} className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-sm uppercase tracking-widest hover:bg-red-500/20 flex items-center justify-center gap-2">
                    <X className="w-5 h-5" /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
