import React from 'react';
import { BookOpen, Heart, Users, Quote } from 'lucide-react';
import { StarsCounter } from './StarsCounter';
import { SectionBackgroundAura } from './SectionBackgroundAura';

interface PhilosophyProps {
  theme?: string;
  onNavigate?: (sectionId: string) => void;
}

export const Philosophy: React.FC<PhilosophyProps> = ({ theme = 'apple-dark' }) => {
  const isLight = theme === 'apple-light' || theme === 'light';

  return (
    <section 
      id="philosophy" 
      className={`relative min-h-screen lg:h-screen w-full flex flex-col justify-between pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t transition-colors duration-500 ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      {/* Soothing Ambient Atmospheric Aura Effects */}
      <SectionBackgroundAura theme={theme} auraLevel={3} />

      <div className="relative w-full max-w-[1400px] mx-auto flex flex-col flex-1 justify-center space-y-4 sm:space-y-5">
        
        {/* Header */}
        <div className="relative text-left space-y-1.5 shrink-0 -mt-4">
          {/* Luminous aura behind heading */}
          <div 
            className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-24 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all ${
              isLight 
                ? 'bg-gradient-to-r from-blue-400/25 via-sky-300/20 to-indigo-300/20 opacity-80' 
                : 'bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-indigo-500/25 opacity-90'
            }`} 
          />

          <div 
            style={{ fontSize: '11px' }}
            className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold tracking-wider uppercase border backdrop-blur-md mb-1 shadow-xs ${
            isLight 
              ? 'bg-blue-50/90 border-blue-200 text-blue-700' 
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.18)]'
          }`}>
            <Heart className="w-3.5 h-3.5 text-blue-500" />
            <span>Leadership Heritage & Gratitude</span>
          </div>

          <h2 className={`relative text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-all text-left ${
            isLight 
              ? 'text-zinc-900 drop-shadow-[0_2px_16px_rgba(59,130,246,0.18)]' 
              : 'text-white drop-shadow-[0_0_24px_rgba(96,165,250,0.35)]'
          }`}>
            Philosophy & Gratitude
          </h2>
          <p 
            style={{ fontSize: '11px', paddingBottom: '6px' }}
            className={`relative max-w-3xl font-normal text-left text-[11px] leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}
          >
            An executive journey grounded in intellectual humility, relentless curiosity and profound gratitude.
          </p>
        </div>

        <div className={`py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-xl border flex items-center gap-3 shrink-0 transition-all duration-300 backdrop-blur-sm -mt-2 sm:-mt-3 ${
          isLight 
            ? 'bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white/90 border-blue-200/80 text-zinc-900 shadow-xs' 
            : 'bg-gradient-to-r from-blue-950/25 via-zinc-900/60 to-indigo-950/20 border-white/10 text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
        }`}>
          <div className={`p-1.5 rounded-lg shrink-0 ${isLight ? 'bg-blue-500/10 text-blue-600' : 'bg-blue-500/15 text-blue-400'}`}>
            <Quote className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-[12.5px] italic font-serif leading-relaxed tracking-wide">
            "Self-discovery through selfless pursuit of knowledge is the way to illumination." — <span className="font-semibold not-italic text-blue-500">Buddha</span>
          </p>
        </div>

        {/* 3 Refined Pillars Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 shrink-0"
          style={{ paddingTop: '6px' }}
        >
          {/* Pillar 1 */}
          <div className={`p-4 sm:p-4.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white/95 border-zinc-200/80 hover:border-blue-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md' 
              : 'bg-zinc-900/60 backdrop-blur-md border-white/10 hover:border-blue-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-blue-500">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm sm:text-[14.5px] font-semibold tracking-tight ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    Intellectual Foundation
                  </h3>
                </div>
                <StarsCounter pageId="philosophy-pillar-1" isLight={isLight} compact />
              </div>
              <p className={`text-[13.5px] sm:text-[15px] leading-relaxed font-serif italic ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                True wisdom lies in acknowledging our knowledge is but a drop in an infinite ocean. Inspired by Stoic equanimity and existential inquiry, growth thrives at the intersection of disciplined action and radical curiosity.
              </p>
            </div>
            <div className={`text-[10.5px] font-mono mt-3 pt-2.5 border-t tracking-wide flex items-center justify-between ${isLight ? 'text-zinc-500 border-zinc-100' : 'text-zinc-400 border-white/5'}`}>
              <span>Stoicism • Humility</span>
              <span className="text-[9px] uppercase opacity-75">Pillar I</span>
            </div>
          </div>
 
          {/* Pillar 2 */}
          <div className={`p-4 sm:p-4.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white/95 border-zinc-200/80 hover:border-rose-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md' 
              : 'bg-zinc-900/60 backdrop-blur-md border-white/10 hover:border-rose-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-rose-500">
                  <div className="p-1.5 rounded-lg bg-rose-500/10">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm sm:text-[14.5px] font-semibold tracking-tight ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    Five Generations
                  </h3>
                </div>
                <StarsCounter pageId="philosophy-pillar-2" isLight={isLight} compact />
              </div>
              <p className={`text-[13.5px] sm:text-[15px] leading-relaxed font-serif italic ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Deepest gratitude to near and extended family—elders, young ones, and contemporaries spanning 5 overlapping generations for their enduring foundation, unconditional love, and companionship through all tides.
              </p>
            </div>
            <div className={`text-[10.5px] font-mono mt-3 pt-2.5 border-t tracking-wide flex items-center justify-between ${isLight ? 'text-zinc-500 border-zinc-100' : 'text-zinc-400 border-white/5'}`}>
              <span>Heritage • Enduring Love</span>
              <span className="text-[9px] uppercase opacity-75">Pillar II</span>
            </div>
          </div>
 
          {/* Pillar 3 */}
          <div className={`p-4 sm:p-4.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
            isLight 
              ? 'bg-white/95 border-zinc-200/80 hover:border-emerald-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md' 
              : 'bg-zinc-900/60 backdrop-blur-md border-white/10 hover:border-emerald-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-emerald-500">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className={`text-sm sm:text-[14.5px] font-semibold tracking-tight ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    Mentors & Community
                  </h3>
                </div>
                <StarsCounter pageId="philosophy-pillar-3" isLight={isLight} compact />
              </div>
              <p className={`text-[13.5px] sm:text-[15px] leading-relaxed font-serif italic ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Enduring appreciation to academic guides, institutional leaders at Goldman Sachs, and the global cybersecurity open-source research community whose collective brilliance illuminates the defense craft.
              </p>
            </div>
            <div className={`text-[10.5px] font-mono mt-3 pt-2.5 border-t tracking-wide flex items-center justify-between ${isLight ? 'text-zinc-500 border-zinc-100' : 'text-zinc-400 border-white/5'}`}>
              <span>Mentorship • Open Source</span>
              <span className="text-[9px] uppercase opacity-75">Pillar III</span>
            </div>
          </div>
        </div>
 
        {/* Sign-off & Disclaimer */}
        <div 
          className="space-y-2.5 shrink-0"
          style={{ paddingTop: '8px' }}
        >
          {/* French Sign-off with delicate styling */}
          <div className="text-center space-y-1 py-0.5">
            <p className={`font-serif italic text-base sm:text-lg tracking-wide ${isLight ? 'text-zinc-800' : 'text-zinc-100'}`}>
              À la prochaine, Prenez soin de vous ... Au revoir !
            </p>
            <p className={`text-xs italic tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              (Until next time, take care of yourself ... Goodbye!)
            </p>
          </div>
 
          {/* Disclaimer box with refined readability */}
          <div 
            className={`p-3 sm:p-3.5 rounded-xl border backdrop-blur-xs transition-colors ${
              isLight 
                ? 'bg-zinc-100/80 border-zinc-200/90 text-zinc-700' 
                : 'bg-white/[0.03] border-white/8 text-zinc-400'
            }`}
          >
            <h4 className={`text-[11px] font-semibold mb-1 tracking-wide uppercase ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>
              Disclaimer & Notice
            </h4>
            <p className={`text-[10px] sm:text-[10.5px] leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              The insights shared across this platform represent personal architectural reflections and intellectual exploration. Ideas presented are personal and subject to iterative evolution. Any resemblances to other works are purely coincidental or inspirational. Intellectual Property and credits belong to their respective original owners. No infringement is intended; this content is for informational and educational purposes only. Brevities are human.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
