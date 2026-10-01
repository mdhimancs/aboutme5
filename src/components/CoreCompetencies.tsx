import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Network, 
  Brain, 
  FileCheck, 
  Cpu, 
  Target,
  Server,
  Database,
  Sparkles,
  Layers
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { StarsCounter } from './StarsCounter';
import { SectionBackgroundAura } from './SectionBackgroundAura';

interface CoreCompetenciesProps {
  theme?: string;
}

export const CoreCompetencies: React.FC<CoreCompetenciesProps> = ({ theme = 'apple-dark' }) => {
  const isLight = theme === 'apple-light';
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-3.5 h-3.5 text-blue-500" />;
      case 'Lock':
        return <Lock className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Network':
        return <Network className="w-3.5 h-3.5 text-sky-500" />;
      case 'FileCheck':
        return <FileCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Brain':
        return <Brain className="w-3.5 h-3.5 text-purple-500" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-amber-500" />;
      case 'Server':
        return <Server className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Database':
        return <Database className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getHueColor = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return 'from-blue-500/20';
      case 'Lock':
        return 'from-indigo-500/20';
      case 'Network':
        return 'from-sky-500/20';
      case 'FileCheck':
        return 'from-emerald-500/20';
      case 'Brain':
        return 'from-purple-500/20';
      case 'Cpu':
        return 'from-amber-500/20';
      case 'Server':
        return 'from-indigo-400/20';
      case 'Database':
        return 'from-purple-400/20';
      default:
        return 'from-emerald-500/20';
    }
  };

  const filteredCategories = selectedFilter === 'all' 
    ? SKILL_CATEGORIES 
    : SKILL_CATEGORIES.filter(cat => cat.title.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <section 
      id="competencies" 
      className={`relative overflow-hidden min-h-screen lg:h-screen w-full flex flex-col justify-start pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      {/* Background Aura Effects */}
      <SectionBackgroundAura theme={theme} auraLevel={3} />

      {/* 1. Header with Badge & Aura */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1 shrink-0 -mt-4">
        {/* Luminous aura behind heading */}
        <div 
          className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-24 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-blue-400/25 via-sky-300/20 to-indigo-300/20 opacity-80' 
              : 'bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-indigo-500/25 opacity-90'
          }`} 
          />

        <div className="relative space-y-0 max-w-3xl flex-1">
          <div 
            style={{ fontSize: '11px' }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold tracking-wider uppercase border backdrop-blur-md mb-0.5 ${
            isLight ? 'bg-blue-50/90 border-blue-200 text-blue-700 shadow-sm' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
          }`}>
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span>Strategic Mastery & Core Competencies</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-all ${
            isLight 
              ? 'text-zinc-900 drop-shadow-[0_2px_16px_rgba(59,130,246,0.22)]' 
              : 'text-white drop-shadow-[0_0_24px_rgba(96,165,250,0.40)]'
          }`}>
            Core Competencies & Strategic Pillars
          </h2>
          <p 
            style={{ fontSize: '11px' }}
            className={`text-[11px] font-normal leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}
          >
            Enterprise architecture, Zero Trust identity, cloud defense, and AI governance.
          </p>
        </div>
        <div className={`relative text-[11px] font-semibold px-3 py-0.5 rounded-full border self-start sm:self-auto shrink-0 ${
          isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-800' : 'bg-white/[0.05] border-white/10 text-zinc-300'
        }`}>
          6 Strategic Pillars
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 shrink-0 w-full mt-1.5 sm:mt-2">
        {filteredCategories.map((cat, idx) => {
          // Sort skills strictly descending by proficiency % (highest on top to lowest at bottom)
          const sortedSkills = [...cat.skills].sort((a, b) => b.level - a.level);

          return (
            <div
              key={idx}
              className="relative rounded-2xl backdrop-blur-xl transition-all group flex flex-col justify-between h-full border border-emerald-500/30 bg-gradient-to-br from-zinc-950 via-[#042114] to-zinc-950 shadow-xl hover:border-emerald-400/60 hover:shadow-2xl overflow-hidden interactive-card"
            >
              {/* Subtle Top Hue Effect */}
              <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b ${getHueColor(cat.iconName)} to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="relative z-10 p-2 sm:p-2.5 text-zinc-100">
                {/* Card Header with Icon, Title, and Pillar Badge */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="p-1 rounded-md border border-emerald-500/40 bg-emerald-950/80 shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-inner">
                      {getIcon(cat.iconName)}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight leading-snug break-words text-white">
                      {cat.title}
                    </h3>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/40 bg-emerald-900/50 text-emerald-300 shrink-0 mt-0.5 whitespace-nowrap shadow-xs">
                    Pillar {idx + 1}
                  </span>
                </div>
 
                {/* Description with 1-point reduced font and word wrap */}
                <p className="text-[9.5px] sm:text-[10px] leading-relaxed break-words whitespace-normal text-zinc-300">
                  {cat.description}
                </p>
              </div>
 
              {/* Skills List - Light Colored Below Part with increased font */}
              <div className="space-y-2 p-3.5 sm:p-4 bg-zinc-50/95 text-zinc-900 border-t border-emerald-500/25 rounded-b-2xl shadow-inner">
                {sortedSkills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between gap-2.5 text-xs py-0.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 shadow-xs" />
                      <span 
                        title={skill.name}
                        className="text-xs sm:text-[13px] font-medium leading-tight truncate text-zinc-900"
                      >
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                      <div className="w-10 sm:w-14 h-2 rounded-full overflow-hidden shrink-0 bg-zinc-200 border border-zinc-300">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-xs transition-all duration-500 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 w-8 text-right tabular-nums shrink-0">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
