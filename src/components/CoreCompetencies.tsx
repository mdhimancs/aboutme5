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

  const filteredCategories = selectedFilter === 'all' 
    ? SKILL_CATEGORIES 
    : SKILL_CATEGORIES.filter(cat => cat.title.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <section 
      id="competencies" 
      className={`relative overflow-hidden min-h-screen lg:h-screen w-full flex flex-col justify-between pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      {/* Background Aura Effects */}
      <SectionBackgroundAura theme={theme} auraLevel={3} />

      {/* 1. Header with Badge & Aura */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 shrink-0 -mt-4">
        {/* Luminous aura behind heading */}
        <div 
          className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-24 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-blue-400/25 via-sky-300/20 to-indigo-300/20 opacity-80' 
              : 'bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-indigo-500/25 opacity-90'
          }`} 
        />

        <div className="relative space-y-0.5 max-w-3xl flex-1">
          <div 
            style={{ fontSize: '11px' }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold tracking-wider uppercase border backdrop-blur-md mb-1 ${
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
      <div style={{ height: '50%', width: '100%' }} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 shrink-0 w-full mt-1 sm:mt-1.5">
        {filteredCategories.map((cat, idx) => {
          // Sort skills strictly descending by proficiency % (highest on top to lowest at bottom)
          const sortedSkills = [...cat.skills].sort((a, b) => b.level - a.level);

          return (
            <div
              key={idx}
              className={`rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl transition-all group flex flex-col justify-between h-full border interactive-card ${
                isLight 
                  ? 'bg-white border-zinc-200 shadow-2xs hover:border-zinc-300 hover:shadow-xs' 
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                {/* Card Header with Icon, Title, and Pillar Badge */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${
                      isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-white/[0.05] border-white/10'
                    }`}>
                      {getIcon(cat.iconName)}
                    </div>
                    <h3 className={`text-[12px] sm:text-[12.5px] font-bold tracking-tight leading-snug break-words ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {cat.title}
                    </h3>
                  </div>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 whitespace-nowrap ${
                    isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-white/[0.05] border-white/10 text-zinc-400'
                  }`}>
                    Pillar {idx + 1}
                  </span>
                </div>
 
                {/* Description with aligned best-fit height */}
                <p className={`text-[10px] sm:text-[10.5px] mb-2 leading-relaxed break-words min-h-[28px] sm:min-h-[30px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {cat.description}
                </p>
              </div>
 
              {/* Skills List Sorted Highest % on Top to Lowest at Bottom */}
              <div className={`space-y-1.5 pt-2 border-t ${isLight ? 'border-zinc-100' : 'border-white/5'}`}>
                {sortedSkills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between gap-1.5 text-xs py-0.5">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span 
                        title={skill.name}
                        className={`text-[10.5px] leading-tight truncate ${isLight ? 'text-zinc-800 font-medium' : 'text-zinc-300'}`}
                      >
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      <div className={`w-8 sm:w-10 h-1.5 rounded-full overflow-hidden shrink-0 shimmer-track ${isLight ? 'bg-sky-100/90 border border-sky-200/60' : 'bg-white/10 border border-white/10'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.45)] transition-all duration-500 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-[9.5px] font-semibold text-blue-600 dark:text-blue-400 w-6 text-right tabular-nums shrink-0">
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
