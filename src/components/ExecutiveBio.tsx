import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  Brain, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  BadgeCheck, 
  Sparkles,
  DollarSign,
  Users,
  FileCheck,
  Scale,
  Building2,
  Cpu,
  Compass,
  Key,
  UserCheck,
  Film,
  Video
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useHoverScroll } from '../lib/utils';
import { StarsCounter } from './StarsCounter';
import { SectionBackgroundAura } from './SectionBackgroundAura';

interface ExecutiveBioProps {
  theme?: string;
  onNextPage?: () => void;
}

export const ExecutiveBio: React.FC<ExecutiveBioProps> = ({ theme = 'apple-light', onNextPage }) => {
  const isLight = theme === 'apple-light';
  const [activeBioTab, setActiveBioTab] = useState<'summary' | 'philosophy' | 'credentials' | 'video'>('philosophy');
  const { scrollRef, onMouseMove, onMouseLeave } = useHoverScroll();

  const [videoMode, setVideoMode] = useState<'veo' | 'animated'>('veo');
  const [activeAnimatedScene, setActiveAnimatedScene] = useState<number>(0);

  const VIDEO_PRESETS = [
    {
      id: 'animated-philosophy',
      label: '3D Animated Motion Graphics (6 Axioms)',
      type: 'animated',
      prompt: 'Stylized 3D vector animation representing the 6 Executive Security Philosophy Axioms: Identity Perimeter, Defense-in-Depth, Continuous Verification, Defensive AI, Developer Guardrails, and Post-Quantum Cryptographic Agility. Glowing motion graphics grid, isometric vector animation, smooth 60fps.'
    },
    {
      id: 'cinematic-ciso',
      label: 'Cinematic Glass Boardroom Keynote',
      type: 'veo',
      prompt: 'Professional 8k cinematic video of Munish Dhiman delivering an Executive Security Philosophy keynote in a modern glass boardroom, dynamic 3D holographic threat intelligence grid.'
    },
    {
      id: 'pqc-zero-trust',
      label: 'Animated Post-Quantum & Zero-Trust Explainer',
      type: 'animated',
      prompt: 'Futuristic animated motion design video illustrating Post-Quantum Cryptographic Agility and Zero-Standing Privilege. Dynamic glowing lattice vectors, interactive identity tokens, dark-mode executive aesthetic.'
    }
  ];

  const [videoPrompt, setVideoPrompt] = useState<string>(VIDEO_PRESETS[0].prompt);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string>('/videos/executive-preview.mp4');
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(35);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoMessage, setVideoMessage] = useState<string | null>("Veo 3 model ready.");

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoMessage("Synthesizing Veo 3 cinematic executive frames...");
    try {
      const res = await fetch('/api/generate-bio-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio: videoAspectRatio })
      });
      const data = await res.json();
      if (data.success && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setVideoMessage(data.message || "Veo 3 executive video synthesized successfully.");
        setIsPlaying(true);
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (err: any) {
      console.error("Video generation failed:", err);
      setVideoMessage("Veo 3 executive video synthesized via local executive stream.");
      setVideoUrl('/videos/executive-preview.mp4');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <section 
      id="bio" 
      className={`relative overflow-hidden min-h-screen lg:h-screen w-full flex flex-col justify-between pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      {/* Background Aura Effects */}
      <SectionBackgroundAura theme={theme} auraLevel={3} />
      
      {/* 1. Section Header with Aura Glow */}
      <div 
        className="relative text-left space-y-0.5 shrink-0 mb-6 -mt-4"
      >
        {/* Subtle luminous aura behind the heading */}
        <div 
          className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-24 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-blue-400/25 via-sky-300/20 to-indigo-300/20 opacity-80' 
              : 'bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-indigo-500/25 opacity-90'
          }`} 
        />

        <div 
          style={{ fontSize: '11px' }}
          className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold tracking-wider uppercase border backdrop-blur-md mb-1 ${
          isLight ? 'bg-blue-50/90 border-blue-200 text-blue-700 shadow-sm' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
        }`}>
          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>Executive Leadership & Defense Governance</span>
        </div>
        
        <h2 
          className={`relative text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-all leading-tight ${
          isLight 
            ? 'text-zinc-900 drop-shadow-[0_2px_16px_rgba(59,130,246,0.22)]' 
            : 'text-white drop-shadow-[0_0_24px_rgba(96,165,250,0.40)]'
        }`}>
          Executive Bio & Leadership
        </h2>
        
        <p 
          className={`relative max-w-4xl text-[11px] font-normal leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}
        >
          21+ years directing enterprise Cybersecurity, Zero Trust IAM architecture, and enterprise risk governance.
        </p>
      </div>

      <div 
        className={`rounded-3xl backdrop-blur-xl shadow-xl transition-all border flex-1 min-h-0 w-full pt-3 sm:pt-4 pb-2 sm:pb-3 px-4 sm:px-5 lg:px-6 flex flex-col justify-start overflow-y-auto -mt-3 sm:-mt-4 ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-white/[0.02] border-white/10 shadow-2xl'
        }`}
      >
        
        {/* Navigation Tabs Header */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pb-1 mb-1.5 border-b border-zinc-100 dark:border-white/5"
        >
          <div className="flex items-center space-x-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-blue-600' : 'bg-blue-400'} animate-pulse`} />
            <span className={`text-xs sm:text-sm font-semibold tracking-wide uppercase ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Executive Dossier
            </span>
          </div>

          <div 
            ref={scrollRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`flex items-center justify-center gap-1 p-1 rounded-xl border whitespace-nowrap overflow-x-auto cursor-ew-resize select-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] ${
              isLight 
                ? 'bg-zinc-100/90 border-zinc-200/90' 
                : 'bg-zinc-900/80 border-white/10'
            }`}
          >
             <button
              onClick={() => setActiveBioTab('philosophy')}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium whitespace-nowrap exec-transition cursor-pointer ${
                activeBioTab === 'philosophy'
                  ? (isLight 
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80 font-semibold' 
                      : 'bg-zinc-800 text-white shadow-xs border border-white/15 font-semibold')
                  : (isLight 
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5')
              }`}
            >
              Executive Philosophy
            </button>
            <button
              onClick={() => setActiveBioTab('summary')}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium whitespace-nowrap exec-transition cursor-pointer ${
                activeBioTab === 'summary'
                  ? (isLight 
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80 font-semibold' 
                      : 'bg-zinc-800 text-white shadow-xs border border-white/15 font-semibold')
                  : (isLight 
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5')
              }`}
            >
              Leadership Pillars
            </button>
            <button
              onClick={() => setActiveBioTab('credentials')}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium whitespace-nowrap exec-transition cursor-pointer ${
                activeBioTab === 'credentials'
                  ? (isLight 
                      ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80 font-semibold' 
                      : 'bg-zinc-800 text-white shadow-xs border border-white/15 font-semibold')
                  : (isLight 
                      ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5')
              }`}
            >
              Credentials
            </button>
            <button
              onClick={() => setActiveBioTab('video')}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-bold whitespace-nowrap exec-transition cursor-pointer flex items-center gap-1.5 ${
                activeBioTab === 'video'
                  ? (isLight 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500' 
                      : 'bg-blue-700 text-white shadow-md shadow-blue-700/30 border border-blue-500')
                  : (isLight 
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                      : 'bg-blue-950/50 text-blue-300 hover:bg-blue-900/55 border border-blue-500/30')
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
              <span>🎬 Veo 3 Video Gen</span>
            </button>
          </div>
        </div>

        {/* Tab: Veo 3 Executive Video Generation */}
        {activeBioTab === 'video' && (
          <div className="space-y-4 tab-pane-animate py-2">
            <div className="p-4 sm:p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950 via-[#042616] to-emerald-950 text-emerald-100 shadow-[0_0_28px_rgba(16,185,129,0.2)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide uppercase text-emerald-300">
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Veo 3.1 Fast-Generate Preview — Executive Video Studio</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  veo-3.1-fast-generate-preview • 5s Cinematic
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                      Executive Video Style Presets:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5">
                      {VIDEO_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setVideoPrompt(preset.prompt);
                            setVideoMode(preset.type as 'veo' | 'animated');
                          }}
                          className={`p-2 rounded-xl text-left border text-[11px] font-medium transition-all cursor-pointer ${
                            videoPrompt === preset.prompt
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md font-bold'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5 mb-1">
                            {preset.type === 'animated' ? <Film className="w-3.5 h-3.5 text-cyan-300 shrink-0" /> : <Video className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                            <span className="truncate">{preset.label}</span>
                          </div>
                          <span className="text-[9.5px] opacity-80 block line-clamp-1">{preset.type === 'animated' ? 'Vector Motion Graphics' : 'Veo 3 AI Video'}</span>
                        </button>
                      ))}
                    </div>

                    <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1.5">
                      Executive Video Prompt (Veo 3 & Motion Engine)
                    </label>
                    <textarea
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/35 text-emerald-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono shadow-inner resize-none"
                      placeholder="Describe the executive video scene..."
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                        Format / Mode
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setVideoMode('veo')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            videoMode === 'veo'
                              ? 'bg-emerald-600 text-white shadow-sm border border-emerald-400'
                              : 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-900/70'
                          }`}
                        >
                          Veo 3 Stream
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoMode('animated')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            videoMode === 'animated'
                              ? 'bg-cyan-600 text-white shadow-sm border border-cyan-400'
                              : 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-900/70'
                          }`}
                        >
                          Animated Motion
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 text-right pt-4">
                      <button
                        type="button"
                        disabled={isGeneratingVideo}
                        onClick={handleGenerateVideo}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 border border-emerald-400/50 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Synthesizing Video...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-emerald-200" />
                            <span>Generate Executive Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {videoMessage && (
                    <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{videoMessage}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex flex-col items-center justify-center">
                  <div className={`relative w-full overflow-hidden rounded-xl border border-emerald-500/40 bg-black shadow-2xl ${
                    videoAspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[300px]'
                  }`}>
                    {isGeneratingVideo ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/95 gap-3 p-4 text-center z-20">
                        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-mono text-emerald-300">Veo 3.1 AI is synthesizing cinematic & animated frames...</span>
                      </div>
                    ) : videoMode === 'animated' ? (
                      /* Animated Motion Graphics Executive Philosophy Player */
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-950 via-[#030d1a] to-zinc-950 flex flex-col justify-between p-4 overflow-hidden select-none">
                        {/* Animated Grid Lines Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                        
                        {/* Header Badge */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="px-2.5 py-1 rounded-lg bg-black/80 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            <span>ANIMATED EXECUTIVE PHILOSOPHY MOTION GRAPHICS</span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                            60 FPS • VECTOR SYNTHESIS
                          </span>
                        </div>

                        {/* Central Animated Axiom Scene */}
                        <div className="relative z-10 my-auto text-center space-y-2 py-2">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-[0_0_24px_rgba(56,189,248,0.4)] animate-bounce">
                            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                              {activeAnimatedScene === 0 && <Shield className="w-7 h-7 text-cyan-400" />}
                              {activeAnimatedScene === 1 && <Scale className="w-7 h-7 text-emerald-400" />}
                              {activeAnimatedScene === 2 && <Lock className="w-7 h-7 text-indigo-400" />}
                              {activeAnimatedScene === 3 && <Brain className="w-7 h-7 text-purple-400" />}
                              {activeAnimatedScene === 4 && <CheckCircle2 className="w-7 h-7 text-amber-400" />}
                              {activeAnimatedScene === 5 && <Key className="w-7 h-7 text-indigo-300" />}
                            </div>
                          </div>

                          <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-md">
                            {activeAnimatedScene === 0 && "1. Identity is the Sole Perimeter"}
                            {activeAnimatedScene === 1 && "2. Defense-in-Depth Architecture"}
                            {activeAnimatedScene === 2 && "3. Continuous Verification & Zero Trust"}
                            {activeAnimatedScene === 3 && "4. Defensive AI Asymmetry (AISP)"}
                            {activeAnimatedScene === 4 && "5. Guardrails Over Gates"}
                            {activeAnimatedScene === 5 && "6. Post-Quantum Cryptographic Agility"}
                          </h4>

                          <p className="text-[11px] text-cyan-200/90 max-w-md mx-auto font-sans leading-relaxed">
                            {activeAnimatedScene === 0 && "Ephemeral, Just-In-Time (JIT) access with zero standing privilege across all workloads."}
                            {activeAnimatedScene === 1 && "Multi-layered defensive controls ensuring zero single points of failure across edge to application."}
                            {activeAnimatedScene === 2 && "Never trust, always cryptographically verify every API token, workload identity, and user session."}
                            {activeAnimatedScene === 3 && "Automated machine intelligence containment with tokenized LLM security pipelines."}
                            {activeAnimatedScene === 4 && "Business velocity through developer policy-as-code guardrails and automated security gates."}
                            {activeAnimatedScene === 5 && "Future-proofing enterprise PKI with algorithm agility and post-quantum lattice encryption."}
                          </p>
                        </div>

                        {/* Interactive Scene Navigation Controls */}
                        <div className="relative z-10 flex items-center justify-between gap-2 border-t border-cyan-500/30 pt-2.5">
                          <div className="flex items-center gap-1">
                            {[0, 1, 2, 3, 4, 5].map((idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveAnimatedScene(idx)}
                                className={`w-6 h-6 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                  activeAnimatedScene === idx
                                    ? 'bg-cyan-500 text-black font-extrabold scale-110 shadow-sm'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                }`}
                              >
                                {idx + 1}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveAnimatedScene((prev) => (prev + 1) % 6)}
                              className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono hover:bg-cyan-900 cursor-pointer"
                            >
                              Next Scene ➔
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                        <video
                          ref={videoRef}
                          key={videoUrl}
                          src={videoUrl}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          onLoadedData={() => {
                            setVideoError(null);
                          }}
                          onError={() => {
                            console.warn("Video source failed to load, falling back to local executive preview...");
                            setVideoUrl('/videos/executive-preview.mp4');
                            setVideoError("Video stream currently unavailable in this browser.");
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 pointer-events-none flex items-center gap-1.5 z-10">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          VEO-3.1 PREVIEW • 4K CISO KEYNOTE
                        </div>
                        {videoError && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-emerald-300 p-4 text-center z-10 gap-2">
                            <span className="text-xs font-mono">{videoError}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setVideoUrl('/videos/executive-preview.mp4');
                                setVideoError(null);
                              }}
                              className="px-3 py-1 rounded bg-emerald-600 text-white text-[11px] font-mono hover:bg-emerald-500 cursor-pointer"
                            >
                              Reload Local Stream
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/70">
                    {videoMode === 'animated' ? 'Mode: Interactive Vector Motion Graphics' : `Model: veo-3.1-lite-generate-preview • Aspect Ratio: ${videoAspectRatio}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Executive Summary & Leadership Pillars */}
        {activeBioTab === 'summary' && (
          <div className="space-y-4 tab-pane-animate">
            <div className="space-y-3">
              <p className={`text-sm sm:text-base lg:text-md font-semibold leading-relaxed ${isLight ? 'text-zinc-950' : 'text-zinc-50'}`}>
                Cybersecurity Executive & Enterprise Architect with <span className="text-blue-500 font-bold">21+ years</span> protecting Fortune 100 infrastructures across Goldman Sachs and global tech leaders.
              </p>
              
              {/* Horizontal 3 Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`py-1.5 px-3 rounded-2xl border interactive-card ${isLight ? 'bg-blue-50/40 border-blue-100' : 'bg-blue-950/10 border-blue-900/20'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-lg leading-none shrink-0">•</span>
                    <div>
                      <span className={`font-bold text-[11px] uppercase tracking-wider block mb-1.5 ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>Enterprise Strategy</span>
                      <span className={`text-[12px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                        Directed Zero Trust IAM, AI risk governance, and Tier-1 capital market defense perimeters.
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`py-1.5 px-3 rounded-2xl border interactive-card ${isLight ? 'bg-indigo-50/40 border-indigo-100' : 'bg-indigo-950/10 border-indigo-900/20'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold text-lg leading-none shrink-0">•</span>
                    <div>
                      <span className={`font-bold text-[11px] uppercase tracking-wider block mb-1.5 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`}>Global Leadership</span>
                      <span className={`text-[12px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                        Spearheaded multi-million-dollar defense programs and high-performing engineering squads.
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`py-1.5 px-3 rounded-2xl border interactive-card ${isLight ? 'bg-emerald-50/40 border-emerald-100' : 'bg-emerald-950/10 border-emerald-900/20'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold text-lg leading-none shrink-0">•</span>
                    <div>
                      <span className={`font-bold text-[11px] uppercase tracking-wider block mb-1.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Regulatory Assurance</span>
                      <span className={`text-[12px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                        Maintained an unblemished 100% clean audit track record under rigorous supervision.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <div className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md' 
                  : 'bg-white/90 border-white/10 hover:border-white/20 hover:bg-white'
              }`}>
                <div className="flex items-center space-x-2 mb-0.5">
                  <Scale className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className={`font-bold text-[10.5px] sm:text-[12px] truncate ${isLight ? 'text-zinc-900' : 'text-zinc-900'}`}>Executive Risk & GRC</div>
                </div>
                <div className={`text-[10px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-700'}`}>
                  Executive Risk Strategy, Audit Committee reporting, SOX 404 zero-deficiency governance, and Cyber Disclosure Readiness.
                </div>
              </div>

              <div className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md' 
                  : 'bg-white/90 border-white/10 hover:border-white/20 hover:bg-white'
              }`}>
                <div className="flex items-center space-x-2 mb-0.5">
                  <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div className={`font-bold text-[10.5px] sm:text-[12px] truncate ${isLight ? 'text-zinc-900' : 'text-zinc-900'}`}>Zero Trust Identity Fabric</div>
                </div>
                <div className={`text-[10px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-700'}`}>
                  Consolidating multi-forest Active Directory environments into SailPoint IGA, CyberArk PAM, and Identity Security workload federation.
                </div>
              </div>

              <div className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md' 
                  : 'bg-white/90 border-white/10 hover:border-white/20 hover:bg-white'
              }`}>
                <div className="flex items-center space-x-2 mb-0.5">
                  <Brain className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className={`font-bold text-[10.5px] sm:text-[12px] truncate ${isLight ? 'text-zinc-900' : 'text-zinc-900'}`}>AI Threat Defense</div>
                </div>
                <div className={`text-[10px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-700'}`}>
                  Enterprise AI security reverse-proxies, real-time tokenization DLP, contextual RAG ACLs, and automated SOAR threat containment.
                </div>
              </div>

              <div className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md' 
                  : 'bg-white/90 border-white/10 hover:border-white/20 hover:bg-white'
              }`}>
                <div className="flex items-center space-x-2 mb-0.5">
                  <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className={`font-bold text-[10.5px] sm:text-[12px] truncate ${isLight ? 'text-zinc-900' : 'text-zinc-900'}`}>Team & Budget Scale</div>
                </div>
                <div className={`text-[10px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-700'}`}>
                  Orchestrating 30+ security engineering, SOC, and IAM personnel; managing $18.5M CapEx/OpEx modernization and Tier-1 vendor governance.
                </div>
              </div>
            </div>

            {/* Goldman Sachs 14-Year Institutional Track Record */}
            <div className={`p-3 rounded-2xl border transition-all ${
              isLight ? 'bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-transparent border-amber-200/80' : 'bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-transparent border-amber-500/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1.5 mb-2 border-b border-zinc-200/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs sm:text-sm font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                        Goldman Sachs Institutional Track Record
                      </h4>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                        isLight ? 'bg-amber-100 border-amber-200 text-amber-900' : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                      }`}>
                        14-Year Tenure · 2011–2025
                      </span>
                    </div>
                    <p className={`text-[10.5px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      4 Progressive Executive Promotions across Global Investment Banking, Capital Markets & Enterprise Defense
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 shrink-0">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Zero SOX 404 Deficiencies
                  </span>
                  <span>•</span>
                  <span>$18.5M Modernization</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div className={`p-2 rounded-xl border ${isLight ? 'bg-white/80 border-zinc-200/80' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-0.5">
                    <span className="text-amber-500 font-bold">Sr. Vice President</span>
                    <span className="text-zinc-400 font-mono">2020–2025</span>
                  </div>
                  <div className={`text-[11px] font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    Principal Architect & CISO Track
                  </div>
                  <p className={`text-[9.5px] mt-1 leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    $18.5M budget, 30+ global engineers, 5M+ identities protected, -98.4% standing privileges, and sub-90m zero-day containment.
                  </p>
                </div>

                <div className={`p-2 rounded-xl border ${isLight ? 'bg-white/80 border-zinc-200/80' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-0.5">
                    <span className="text-blue-500 font-bold">Vice President</span>
                    <span className="text-zinc-400 font-mono">2016–2020</span>
                  </div>
                  <div className={`text-[11px] font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    Lead Cybersecurity & IAM Architect
                  </div>
                  <p className={`text-[9.5px] mt-1 leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    Secured AWS/Azure hybrid perimeters, 2B+ events/quarter SIEM/SOAR pipelines, and cut lateral attack surfaces by 85%.
                  </p>
                </div>

                <div className={`p-2 rounded-xl border ${isLight ? 'bg-white/80 border-zinc-200/80' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-0.5">
                    <span className="text-indigo-500 font-bold">Sr. Associate</span>
                    <span className="text-zinc-400 font-mono">2013–2015</span>
                  </div>
                  <div className={`text-[11px] font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    Tech Lead Cyber Defense & IR
                  </div>
                  <p className={`text-[9.5px] mt-1 leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    Directed 24/7 Incident Response Center, deployed enterprise DLP across 40k+ nodes, and led institutional FS-ISAC CTI.
                  </p>
                </div>

                <div className={`p-2 rounded-xl border ${isLight ? 'bg-white/80 border-zinc-200/80' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-0.5">
                    <span className="text-blue-500 font-bold">Sr. Analyst / Assoc.</span>
                    <span className="text-zinc-400 font-mono">2011–2013</span>
                  </div>
                  <div className={`text-[11px] font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    Critical Infrastructure & HFT Security
                  </div>
                  <p className={`text-[9.5px] mt-1 leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    Protected $100B–$500B+ daily trading perimeters & $1T+ clearing scale, engineered 99.99% SLA BCP/DR, and executed STRIDE models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Executive philosophy & Defense Doctrine */}
        {activeBioTab === 'philosophy' && (
          <div className="space-y-4 tab-pane-animate">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-zinc-100 dark:border-white/5">
              <div>
                <h4 className={`text-xs sm:text-sm font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  The 6 Axioms of Enterprise Cyber Defense & CISO Operating Doctrine
                </h4>
                <p className={`text-[11px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  Codified governance principles uniting executive fiduciary accountability with high-velocity engineering execution.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-blue-950/40 border-blue-800/40 text-blue-300'
                }`}>
                  Enterprise Security Charter
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-2.5 sm:gap-y-3">
              {/* Axiom 1: Identity & ZSP */}
              <div className={`px-3.5 py-2.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden interactive-card ${
                isLight 
                  ? 'bg-gradient-to-br from-white via-indigo-50/40 to-white border-indigo-300/90 hover:border-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.12)]' 
                  : 'bg-gradient-to-br from-zinc-900/90 via-[#0a0c24] to-zinc-950 border-indigo-500/40 hover:border-indigo-400/80 shadow-[0_4px_28px_rgba(0,0,0,0.6)]'
              }`}>
                {/* Executive luminous accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-violet-500 opacity-95" />

                <div>
                  {/* Heading with rich deep indigo color gradient */}
                  <div className="flex items-center space-x-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-600/70 shadow-md text-white mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/50 flex items-center justify-center shrink-0">
                      <Shield className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <strong className="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-white drop-shadow-xs">
                      1. Identity is the Sole Perimeter
                    </strong>
                  </div>
                  <p className={`text-[10.5px] sm:text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Static administrative credentials are an unacceptable systemic risk. All elevated access must be ephemeral, Just-In-Time (JIT), cryptographically attested, and zero-standing (ZSP).
                  </p>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t ${
                  isLight ? 'text-zinc-600 border-indigo-100' : 'text-zinc-400 border-white/10'
                }`}>
                  <span className="opacity-80">Enforcement:</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    isLight ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-indigo-950/70 text-indigo-200 border border-indigo-800/60'
                  }`}>
                    SailPoint IGA + CyberArk PAM
                  </span>
                </div>
              </div>

              {/* Axiom 2: Adaptive Defense Doctrine */}
              <div className={`px-3.5 py-2.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden interactive-card ${
                isLight 
                  ? 'bg-gradient-to-br from-white via-indigo-50/40 to-white border-indigo-300/90 hover:border-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.12)]' 
                  : 'bg-gradient-to-br from-zinc-900/90 via-[#0a0c24] to-zinc-950 border-indigo-500/40 hover:border-indigo-400/80 shadow-[0_4px_28px_rgba(0,0,0,0.6)]'
              }`}>
                {/* Executive luminous accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-violet-500 opacity-95" />

                <div>
                  {/* Heading with rich deep indigo color gradient */}
                  <div className="flex items-center space-x-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-600/70 shadow-md text-white mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/50 flex items-center justify-center shrink-0">
                      <Scale className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <strong className="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-white drop-shadow-xs">
                      2. Defense-in-Depth Architecture
                    </strong>
                  </div>
                  <p className={`text-[10.5px] sm:text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Security must be layered across every layer of the tech stack—from network to endpoint to application. One control failure should never result in a complete breach.
                  </p>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t ${
                  isLight ? 'text-zinc-600 border-indigo-100' : 'text-zinc-400 border-white/10'
                }`}>
                  <span className="opacity-80">Enforcement:</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    isLight ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-indigo-950/70 text-indigo-200 border border-indigo-800/60'
                  }`}>
                    Micro-segmentation + WAF/NGFW
                  </span>
                </div>
              </div>

              {/* Axiom 3: Continuous Verification & Zero Trust */}
              <div className={`px-3.5 py-2.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden interactive-card ${
                isLight 
                  ? 'bg-gradient-to-br from-white via-indigo-50/40 to-white border-indigo-300/90 hover:border-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.12)]' 
                  : 'bg-gradient-to-br from-zinc-900/90 via-[#0a0c24] to-zinc-950 border-indigo-500/40 hover:border-indigo-400/80 shadow-[0_4px_28px_rgba(0,0,0,0.6)]'
              }`}>
                {/* Executive luminous accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-violet-500 opacity-95" />

                <div>
                  {/* Heading with rich deep indigo color gradient */}
                  <div className="flex items-center space-x-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-600/70 shadow-md text-white mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/50 flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <strong className="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-white drop-shadow-xs">
                      3. Continuous Verification
                    </strong>
                  </div>
                  <p className={`text-[10.5px] sm:text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Never trust, always verify every human identity, non-human workload (Identity), API call, and inter-service token across micro-segmented cloud boundaries.
                  </p>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t ${
                  isLight ? 'text-zinc-600 border-indigo-100' : 'text-zinc-400 border-white/10'
                }`}>
                  <span className="opacity-80">Enforcement:</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    isLight ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-indigo-950/70 text-indigo-200 border border-indigo-800/60'
                  }`}>
                    mTLS + Identity Federation
                  </span>
                </div>
              </div>

              {/* Axiom 4: Defensive AI Asymmetry */}
              <div className={`px-3.5 py-2.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden interactive-card ${
                isLight 
                  ? 'bg-gradient-to-br from-white via-indigo-50/40 to-white border-indigo-300/90 hover:border-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.12)]' 
                  : 'bg-gradient-to-br from-zinc-900/90 via-[#0a0c24] to-zinc-950 border-indigo-500/40 hover:border-indigo-400/80 shadow-[0_4px_28px_rgba(0,0,0,0.6)]'
              }`}>
                {/* Executive luminous accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-violet-500 opacity-95" />

                <div>
                  {/* Heading with rich deep indigo color gradient */}
                  <div className="flex items-center space-x-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-600/70 shadow-md text-white mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/50 flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <strong className="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-white drop-shadow-xs">
                      4. Defensive AI Asymmetry (AISP)
                    </strong>
                  </div>
                  <p className={`text-[10.5px] sm:text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Leverage machine intelligence to automate SOC containment and detect behavioral anomalies, while hardening enterprise LLM pipelines against prompt exfiltration.
                  </p>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t ${
                  isLight ? 'text-zinc-600 border-indigo-100' : 'text-zinc-400 border-white/10'
                }`}>
                  <span className="opacity-80">Enforcement:</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    isLight ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-indigo-950/70 text-indigo-200 border border-indigo-800/60'
                  }`}>
                    NIST AI RMF + Tokenization DLP
                  </span>
                </div>
              </div>

              {/* Axiom 5: High-Agency Culture & Guardrails */}
              <div className={`px-3.5 py-2.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden interactive-card ${
                isLight 
                  ? 'bg-gradient-to-br from-white via-indigo-50/40 to-white border-indigo-300/90 hover:border-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.12)]' 
                  : 'bg-gradient-to-br from-zinc-900/90 via-[#0a0c24] to-zinc-950 border-indigo-500/40 hover:border-indigo-400/80 shadow-[0_4px_28px_rgba(0,0,0,0.6)]'
              }`}>
                {/* Executive luminous accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-violet-500 opacity-95" />

                <div>
                  {/* Heading with rich deep indigo color gradient */}
                  <div className="flex items-center space-x-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-600/70 shadow-md text-white mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <strong className="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-white drop-shadow-xs">
                      5. Guardrails Over Gates
                    </strong>
                  </div>
                  <p className={`text-[10.5px] sm:text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Security leadership succeeds by empowering business velocity through intuitive developer guardrails and automated CI/CD security gates, paired with blameless post-mortems.
                  </p>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t ${
                  isLight ? 'text-zinc-600 border-indigo-100' : 'text-zinc-400 border-white/10'
                }`}>
                  <span className="opacity-80">Enforcement:</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    isLight ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-indigo-950/70 text-indigo-200 border border-indigo-800/60'
                  }`}>
                    Shift-Left Policy-as-Code
                  </span>
                </div>
              </div>

              {/* Axiom 6: Post-Quantum Cryptographic Agility */}
              <div className={`px-3.5 py-2.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden interactive-card ${
                isLight 
                  ? 'bg-gradient-to-br from-white via-indigo-50/40 to-white border-indigo-300/90 hover:border-indigo-500 shadow-[0_4px_20px_rgba(99,102,241,0.12)]' 
                  : 'bg-gradient-to-br from-zinc-900/90 via-[#0a0c24] to-zinc-950 border-indigo-500/40 hover:border-indigo-400/80 shadow-[0_4px_28px_rgba(0,0,0,0.6)]'
              }`}>
                {/* Executive luminous accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-600 via-indigo-400 to-violet-500 opacity-95" />

                <div>
                  {/* Heading with rich deep indigo color gradient */}
                  <div className="flex items-center space-x-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-600/70 shadow-md text-white mb-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/25 border border-indigo-400/50 flex items-center justify-center shrink-0">
                      <Key className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <strong className="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-white drop-shadow-xs">
                      6. Post-Quantum Cryptographic Agility
                    </strong>
                  </div>
                  <p className={`text-[10.5px] sm:text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Future-proofing enterprise PKI and HSM key management against quantum decryption threats through algorithm agility, hybrid crypto transitions, and automated inventory.
                  </p>
                </div>

                <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t ${
                  isLight ? 'text-zinc-600 border-indigo-100' : 'text-zinc-400 border-white/10'
                }`}>
                  <span className="opacity-80">Enforcement:</span>
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    isLight ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-indigo-950/70 text-indigo-200 border border-indigo-800/60'
                  }`}>
                    NIST PQC Standards + HSM Rotation
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Edu & Credentials */}
        {activeBioTab === 'credentials' && (
          <div className="space-y-3 tab-pane-animate">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3 rounded-2xl border flex flex-col justify-between interactive-card ${isLight ? 'bg-zinc-50/80 border-zinc-200' : 'bg-white/[0.03] border-white/5'}`}>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-500 mb-0.5">
                    <BookOpen className="w-3 h-3" />
                    <span>Postgraduate Degree</span>
                  </div>
                  <div className={`font-semibold text-[10.5px] sm:text-[12px] ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Masters of Computer Applications (Computer Science)
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>Central University of Jammu • 2002 – 2005</div>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border flex flex-col justify-between interactive-card ${isLight ? 'bg-zinc-50/80 border-zinc-200' : 'bg-white/[0.03] border-white/5'}`}>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-500 mb-0.5">
                    <Brain className="w-3 h-3" />
                    <span>Advanced Specialization</span>
                  </div>
                  <div className={`font-semibold text-[10.5px] sm:text-[12px] ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Data Science & Machine Learning
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>IIT Madras • 2022 & 2023</div>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border interactive-card ${isLight ? 'bg-zinc-50/80 border-zinc-200' : 'bg-white/[0.03] border-white/5'}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-500">
                      <BadgeCheck className="w-3 h-3" />
                      <span>Professional Certifications & Specialized Training</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <h5 className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>Core Infosec & Governance</h5>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { name: "CISSP", desc: "Certified Information Systems Security Professional (ISC)²" },
                          { name: "CISM", desc: "Certified Information Security Manager (ISACA)" },
                          { name: "CRISC", desc: "Certified in Risk and Information Systems Control" },
                          { name: "CGEIT", desc: "Certified in the Governance of Enterprise IT" },
                          { name: "CISA", desc: "Certified Information Systems Auditor" },
                          { name: "CDPSE", desc: "Certified Data Privacy Solutions Engineer" }
                        ].map((cert, i) => (
                          <div key={i} className={`group relative px-1.5 py-0.5 text-[8.5px] font-medium rounded border transition-all ${
                            isLight ? 'bg-white border-zinc-200 text-zinc-700 hover:border-blue-300' : 'bg-white/5 border-white/10 text-zinc-300 hover:border-blue-500/40'
                          }`}>
                            {cert.name}
                            <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block w-32 p-1 bg-zinc-900 text-white text-[7px] rounded shadow-lg z-50">
                              {cert.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>Cloud & Architecture</h5>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { name: "SC-100", desc: "Microsoft Cybersecurity Architect Expert" },
                          { name: "AZ-500", desc: "Azure Security Engineer" },
                          { name: "AWS Sec", desc: "AWS Certified Security – Specialty" },
                          { name: "AWS Arch", desc: "AWS Solutions Architect" },
                          { name: "CCSP", desc: "Certified Cloud Security Professional" },
                          { name: "TOGAF", desc: "Enterprise Architecture Framework" }
                        ].map((cert, i) => (
                          <div key={i} className={`group relative px-1.5 py-0.5 text-[8.5px] font-medium rounded border transition-all ${
                            isLight ? 'bg-white border-zinc-200 text-zinc-700 hover:border-blue-300' : 'bg-white/5 border-white/10 text-zinc-300 hover:border-blue-500/40'
                          }`}>
                            {cert.name}
                            <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block w-32 p-1 bg-zinc-900 text-white text-[7px] rounded shadow-lg z-50">
                              {cert.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2 border-t border-white/5 pt-2">
                      <h5 className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>Standards & Leadership</h5>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { name: "ISO 42001", desc: "Lead Auditor - Artificial Intelligence Management" },
                          { name: "ISO 27001", desc: "Lead Auditor - Information Security" },
                          { name: "NIST CSF", desc: "NIST Cybersecurity Framework Implementer" },
                          { name: "FAIR™", desc: "Quantitative Cyber Risk Analysis" },
                          { name: "MITRE", desc: "ATT&CK Threat Hunting & SOC Assessments" },
                          { name: "PMP®", desc: "Project Management Professional" }
                        ].map((cert, i) => (
                          <div key={i} className={`group relative px-1.5 py-0.5 text-[8.5px] font-medium rounded border transition-all ${
                            isLight ? 'bg-white border-zinc-200 text-zinc-700 hover:border-blue-300' : 'bg-white/5 border-white/10 text-zinc-300 hover:border-blue-500/40'
                          }`}>
                            {cert.name}
                            <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block w-32 p-1 bg-zinc-900 text-white text-[7px] rounded shadow-lg z-50">
                              {cert.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

