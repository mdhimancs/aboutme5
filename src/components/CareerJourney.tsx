import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Building2,
  ChevronLeft,
  Clock,
  Eye,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { CAREER_MILESTONES } from '../data/portfolioData';
import { useHoverScroll } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { SectionBackgroundAura } from './SectionBackgroundAura';

interface CareerJourneyProps {
  theme?: string;
}

export const CareerJourney: React.FC<CareerJourneyProps> = ({ theme = 'apple-dark' }) => {
  const isLight = theme === 'apple-light';
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(CAREER_MILESTONES[0]?.id || 'confidential-sr-dir');
  const [viewMode, setViewMode] = useState<'focus' | 'timeline'>('focus');
  const [expandedId, setExpandedId] = useState<string | null>(CAREER_MILESTONES[0]?.id || null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const { scrollRef: timelineScrollRef, onMouseMove: timelineOnMouseMove, onMouseLeave: timelineOnMouseLeave } = useHoverScroll();

  const getMilestoneYear = (period: string) => {
    const years = period.match(/\d{4}/g);
    if (!years) return '';
    if (years.length === 1) return years[0];
    return `${years[0]}–${years[1]}`;
  };

  const activeMilestone = CAREER_MILESTONES.find(m => m.id === activeMilestoneId) || CAREER_MILESTONES[0];
  const activeIndex = CAREER_MILESTONES.findIndex(m => m.id === activeMilestoneId);

  const handleSelectMilestone = (id: string) => {
    setActiveMilestoneId(id);
    setExpandedId(id);

    if (viewMode === 'timeline') {
      setTimeout(() => {
        const el = document.getElementById(`milestone-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevId = CAREER_MILESTONES[activeIndex - 1].id;
      handleSelectMilestone(prevId);
    }
  };

  const handleNext = () => {
    if (activeIndex < CAREER_MILESTONES.length - 1) {
      const nextId = CAREER_MILESTONES[activeIndex + 1].id;
      handleSelectMilestone(nextId);
    }
  };

  // Keyboard navigation when user is in career journey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const careerEl = document.getElementById('career');
      if (!careerEl) return;
      const rect = careerEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const renderCompanyBadge = (company: string) => {
    if (company === 'Goldman Sachs') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-950/90 text-amber-300 border border-amber-500/40 shadow-xs">
          <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Goldman Sachs</span>
        </span>
      );
    }
    if (company.includes('Computer Associates') || company.includes('Broadcom')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-950/90 text-sky-300 border border-sky-500/40 shadow-xs">
          <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
          <span>CA (Broadcom)</span>
        </span>
      );
    }
    if (company === 'Amrita Technologies') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-xs">
          <Building2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>Amrita Tech</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-950/90 text-purple-300 border border-purple-500/40 shadow-xs">
        <Building2 className="w-3 h-3 text-purple-400 shrink-0" />
        <span>{company}</span>
      </span>
    );
  };

  const getCleanShortRole = (role: string) => {
    const mainTitle = role.split('|')[0].trim();
    return mainTitle
      .replace(' - IAM, Digital Security, Directory', '')
      .replace(' - Identity, Auth & Digital Trust', '');
  };

  return (
    <section 
      id="career" 
      className={`relative overflow-hidden min-h-screen lg:h-screen w-full flex flex-col justify-between pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t transition-colors duration-300 ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      {/* Background Ambient Glows */}
      <SectionBackgroundAura theme={theme} auraLevel={3} />

      {/* Section Header - Compact Padding */}
      <div className="relative text-left space-y-0.5 shrink-0 -mt-4">
        {/* Luminous aura behind heading */}
        <div 
          className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-24 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-blue-400/25 via-sky-300/20 to-indigo-300/20 opacity-80' 
              : 'bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-indigo-500/25 opacity-90'
          }`} 
        />

        <div className="flex items-center justify-between flex-wrap gap-2 mb-0.5">
          <div 
            style={{ fontSize: '11px' }}
            className={`relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold tracking-wider uppercase border backdrop-blur-md ${
            isLight ? 'bg-blue-50/90 border-blue-200 text-blue-700 shadow-2xs' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
          }`}>
            <Briefcase className="w-3 h-3 text-blue-500" />
            <span>21-Year Executive Progression</span>
          </div>
        </div>

        <h2 
          className={`relative text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight transition-all leading-tight ${
          isLight 
            ? 'text-zinc-900 drop-shadow-[0_2px_16px_rgba(59,130,246,0.15)]' 
            : 'text-white drop-shadow-[0_0_24px_rgba(96,165,250,0.35)]'
        }`}>
          Career Journey & Milestones
        </h2>
        <p 
          className={`relative max-w-none text-[11px] font-normal leading-normal whitespace-nowrap ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}
        >
          Directing global cybersecurity, Zero Trust IAM, risk governance, and AI defense across leading Banking & Financial Services and Fortune 100 institutions.
        </p>
      </div>

      {/* 5 High-Impact Metric Cards */}
      <div 
        style={{ paddingBottom: '3pt' }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2 mb-[3pt] shrink-0 w-full mt-1 sm:mt-1.5"
      >
        <div 
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
          className="relative z-10 py-1.5 px-2 rounded-lg border text-center transition-all bg-white opacity-100 border-zinc-200/90 shadow-2xs"
        >
          <div className="text-[10px] sm:text-[10.5px] font-bold text-amber-600 uppercase tracking-wider">Goldman Sachs Tenure</div>
          <div className="text-[11.5px] sm:text-xs font-bold mt-0.5 text-zinc-900">14 Yrs · 4 Promotions</div>
          <div className="text-[9px] text-zinc-500 font-mono">Sr. Analyst ➔ VP ➔ SVP</div>
        </div>

        <div 
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
          className="relative z-10 py-1.5 px-2 rounded-lg border text-center transition-all bg-white opacity-100 border-zinc-200/90 shadow-2xs"
        >
          <div className="text-[10px] sm:text-[10.5px] font-bold text-blue-600 uppercase tracking-wider">Leadership Scale</div>
          <div className="text-[11.5px] sm:text-xs font-bold mt-0.5 text-zinc-900">30+ Global Engineers</div>
          <div className="text-[9px] text-zinc-500 font-mono">SecOps, SOC, IAM & GRC</div>
        </div>

        <div 
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
          className="relative z-10 py-1.5 px-2 rounded-lg border text-center transition-all bg-white opacity-100 border-zinc-200/90 shadow-2xs"
        >
          <div className="text-[10px] sm:text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider">Audit & Compliance</div>
          <div className="text-[11.5px] sm:text-xs font-bold mt-0.5 text-zinc-900">100% Clean Attestations</div>
          <div className="text-[9px] text-zinc-500 font-mono">SOX 404, SOC 2 & ISO 27001</div>
        </div>

        <div 
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
          className="relative z-10 py-1.5 px-2 rounded-lg border text-center transition-all bg-white opacity-100 border-zinc-200/90 shadow-2xs"
        >
          <div className="text-[10px] sm:text-[10.5px] font-bold text-indigo-600 uppercase tracking-wider">Transaction Defense</div>
          <div className="text-[11.5px] sm:text-xs font-bold mt-0.5 text-zinc-900">$100B–$500B+ Flow</div>
          <div className="text-[9px] text-zinc-500 font-mono">$1T+ Tier-1 Clearing Scale</div>
        </div>

        <div 
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
          className="col-span-2 sm:col-span-1 relative z-10 py-1.5 px-2 rounded-lg border text-center transition-all bg-white opacity-100 border-zinc-200/90 shadow-2xs"
        >
          <div className="text-[10px] sm:text-[10.5px] font-bold text-purple-600 uppercase tracking-wider">Privilege Exposure</div>
          <div className="text-[11.5px] sm:text-xs font-bold mt-0.5 text-zinc-900">-98.4% Zero Standing</div>
          <div className="text-[9px] text-zinc-500 font-mono">SailPoint + CyberArk JIT</div>
        </div>
      </div>

      {/* Clickable Horizontal Milestone Timeline Track */}
      <div className="relative shrink-0 w-full mb-2 sm:mb-2.5">
        {/* Timeline Header Bar with View Toggle & Step Counters */}
        <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                Milestone Timeline
              </span>
              <span className={`hidden md:inline-block text-[10.5px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                • Click any milestone node to toggle detailed job descriptions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10.5px] font-semibold ${
              isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <button
                type="button"
                onClick={() => setViewMode('focus')}
                className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                  viewMode === 'focus'
                    ? (isLight ? 'bg-white text-zinc-900 font-bold shadow-2xs' : 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40 shadow-2xs')
                    : (isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-white')
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Focused View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                  viewMode === 'timeline'
                    ? (isLight ? 'bg-white text-zinc-900 font-bold shadow-2xs' : 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40 shadow-2xs')
                    : (isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-white')
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>All Roles</span>
              </button>
            </div>

            {/* Stepper Chevrons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeIndex <= 0}
                className={`p-1 rounded-md border transition-all ${
                  activeIndex <= 0
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : isLight
                      ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 shadow-2xs'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200 shadow-2xs'
                }`}
                title="Previous Role"
                aria-label="Previous Role"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className={`text-[10px] font-mono font-bold px-1 tabular-nums ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                {activeIndex + 1}/{CAREER_MILESTONES.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeIndex >= CAREER_MILESTONES.length - 1}
                className={`p-1 rounded-md border transition-all ${
                  activeIndex >= CAREER_MILESTONES.length - 1
                    ? 'opacity-30 cursor-not-allowed border-transparent'
                    : isLight
                      ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 shadow-2xs'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200 shadow-2xs'
                }`}
                title="Next Role"
                aria-label="Next Role"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Timeline Ribbon with Connecting Line */}
        <div
          ref={timelineScrollRef}
          onMouseMove={timelineOnMouseMove}
          onMouseLeave={timelineOnMouseLeave}
          className="relative flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 pt-0.5 select-none scroll-smooth"
        >
          {CAREER_MILESTONES.map((m) => {
            const isSelected = activeMilestoneId === m.id;
            const yearStr = getMilestoneYear(m.period);

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMilestone(m.id)}
                className={`group relative flex-1 min-w-[135px] sm:min-w-[155px] lg:min-w-0 p-2 sm:p-2.5 rounded-xl border transition-all duration-200 text-left flex flex-col justify-between cursor-pointer focus:outline-none ${
                  isSelected
                    ? isLight
                      ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/25 scale-[1.01]'
                      : 'bg-gradient-to-br from-zinc-950 via-[#042114] to-zinc-950 border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.28)] ring-1 ring-emerald-500/50 scale-[1.01]'
                    : isLight
                      ? 'bg-white/80 hover:bg-white border-zinc-200 hover:border-emerald-300 shadow-2xs'
                      : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-white/10 hover:border-emerald-500/40'
                }`}
              >
                {/* Top Row: Year Tag & Node Indicator */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`font-mono text-[9px] sm:text-[9.5px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap transition-colors ${
                    isSelected
                      ? (isLight ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-500 text-white border-emerald-400')
                      : (isLight ? 'bg-zinc-100 text-zinc-700 border-zinc-200 group-hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-300 border-zinc-700 group-hover:border-zinc-500')
                  }`}>
                    {yearStr}
                  </span>

                  {/* Node Dot */}
                  <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
                    isSelected
                      ? 'bg-emerald-400 border-emerald-300 ring-4 ring-emerald-500/30 scale-110 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : 'bg-zinc-400/80 dark:bg-zinc-600 border-transparent group-hover:bg-emerald-400 group-hover:scale-110'
                  }`} />
                </div>

                {/* Company Name Badge */}
                <div className="mb-0.5">
                  <span className={`text-[10px] sm:text-[10.5px] font-bold tracking-tight truncate block ${
                    m.company === 'Goldman Sachs' 
                      ? 'text-amber-500' 
                      : m.company === 'Confidential'
                        ? 'text-purple-400'
                        : m.company.includes('Broadcom') || m.company.includes('Computer Associates')
                          ? 'text-sky-400'
                          : 'text-emerald-500'
                  }`}>
                    {m.company === 'Computer Associates (Broadcom)' ? 'CA (Broadcom)' : m.company}
                  </span>
                </div>

                {/* Short Role Title */}
                <div className={`text-[11px] sm:text-[11.5px] font-bold leading-tight line-clamp-1 ${
                  isSelected
                    ? (isLight ? 'text-zinc-900 font-extrabold' : 'text-white font-extrabold')
                    : (isLight ? 'text-zinc-700 group-hover:text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-200')
                }`}>
                  {getCleanShortRole(m.role)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Focused Job Description View OR Full Stream View */}
      {viewMode === 'focus' ? (
        <div className="flex-1 min-h-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`border rounded-xl backdrop-blur-xl overflow-hidden shadow-xl transition-all ${
                isLight ? 'border-emerald-500/50 shadow-md' : 'border-emerald-500/40 shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
              }`}
            >
              {/* Top Heading Section - Dark Obsidian & Bottle-Green like Core Competencies */}
              <div className="p-3 sm:p-3.5 bg-gradient-to-br from-zinc-950 via-[#042114] to-zinc-950 text-zinc-100 border-b border-emerald-500/30">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {renderCompanyBadge(activeMilestone.company)}

                      {/* Location and Date Range Row */}
                      <div className="text-[11px] font-medium text-emerald-200/80 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span>{activeMilestone.location}</span>
                        </span>
                        <span className="opacity-40 text-emerald-500">|</span>
                        <span className="inline-flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span>{activeMilestone.period}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quick navigation step tags */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={activeIndex <= 0}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${
                          activeIndex <= 0
                            ? 'opacity-30 cursor-not-allowed border-transparent text-zinc-400'
                            : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 hover:text-white'
                        }`}
                      >
                        <ChevronLeft className="w-3 h-3" />
                        <span className="hidden sm:inline">Prev Role</span>
                      </button>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/80 text-emerald-300">
                        Role {activeIndex + 1} of {CAREER_MILESTONES.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={activeIndex >= CAREER_MILESTONES.length - 1}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${
                          activeIndex >= CAREER_MILESTONES.length - 1
                            ? 'opacity-30 cursor-not-allowed border-transparent text-zinc-400'
                            : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 hover:text-white'
                        }`}
                      >
                        <span className="hidden sm:inline">Next Role</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Role Title */}
                  <h3 className="text-[14px] sm:text-[16px] font-bold tracking-tight text-white leading-snug">
                    {activeMilestone.role}
                  </h3>

                  {/* Category Highlight Badges */}
                  <div className="flex flex-wrap items-center justify-start gap-1 w-full">
                    {activeMilestone.category.split(',').map((catTag, cIdx) => (
                      <span 
                        key={cIdx}
                        className="text-[9.5px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md border whitespace-nowrap shadow-2xs inline-block bg-emerald-900/60 text-emerald-200 border-emerald-500/30"
                      >
                        {catTag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Content Compartment - Light Colored like Core Competencies */}
              <div className="p-3 sm:p-4 bg-zinc-50/95 text-zinc-900 rounded-b-xl shadow-inner space-y-2.5 max-h-[46vh] sm:max-h-[50vh] overflow-y-auto pr-1 sm:pr-2">
                {/* Executive Scope & Architectural Mandate */}
                <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04]">
                  <div className="text-[9.5px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-emerald-600" />
                    <span>Executive Mandate & Architectural Scope</span>
                  </div>
                  <p className="text-xs sm:text-[12.5px] leading-relaxed text-zinc-800">
                    {activeMilestone.summary}
                  </p>
                </div>

                {/* Key Leadership Achievements & Strategic Impact */}
                <div>
                  <div className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Leadership Achievements ({activeMilestone.achievements.length} Deliverables)</span>
                    </span>
                    <span className="text-[9.5px] font-mono text-zinc-500 font-normal">
                      Verified Executive Impact
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {activeMilestone.achievements.map((ach, i) => (
                      <li 
                        key={i} 
                        className="flex items-start space-x-1.5 text-xs sm:text-[12px] leading-relaxed text-zinc-800 bg-white/95 p-2 rounded-lg border border-zinc-200/80 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology, Governance & Frameworks Stack */}
                <div className="pt-2 border-t border-zinc-200">
                  <div className="text-[9.5px] font-bold uppercase tracking-wider mb-1 text-zinc-600">
                    Technology & Governance Frameworks ({activeMilestone.technologies.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeMilestone.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] sm:text-[9.5px] font-semibold px-1.5 py-0.5 rounded border bg-white border-zinc-200 text-zinc-800 shadow-2xs hover:border-emerald-400 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Timeline All Roles Stream View */
        <div 
          ref={listContainerRef}
          className="flex-1 min-h-0 space-y-3 max-h-[56vh] sm:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2"
        >
          {/* Timeline Vertical Track with generous left margin for Year Box */}
          <div className={`relative border-l-2 ${isLight ? 'border-blue-300' : 'border-blue-500/40'} ml-[76px] sm:ml-[88px] space-y-3 py-0.5`}>
            {CAREER_MILESTONES.map((milestone) => {
              const isExpanded = expandedId === milestone.id;
              const isSelected = activeMilestoneId === milestone.id;

              return (
                <div 
                  key={milestone.id} 
                  id={`milestone-${milestone.id}`}
                  className="relative group scroll-mt-4 pl-4 sm:pl-5"
                >
                  {/* Non-Truncated Year Badge Box on Left */}
                  <div className="absolute -left-[76px] sm:-left-[88px] top-1.5 w-[66px] sm:w-[78px] flex justify-end items-center pointer-events-none select-none">
                    <span className={`font-mono text-[9.5px] sm:text-[10px] font-bold tracking-tight px-1.5 sm:px-2 py-0.5 rounded-md border shadow-2xs whitespace-nowrap inline-flex items-center justify-center text-center transition-all ${
                      isSelected
                        ? (isLight ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-emerald-500 text-white border-emerald-400 shadow-sm') 
                        : (isLight ? 'bg-zinc-100 text-zinc-800 border-zinc-300 group-hover:border-zinc-400 group-hover:bg-zinc-200/90' : 'bg-zinc-800/95 text-zinc-200 border-zinc-700 group-hover:border-zinc-500 group-hover:bg-zinc-700/90')
                    }`}>
                      {getMilestoneYear(milestone.period)}
                    </span>
                  </div>

                  {/* Timeline Bullet Node */}
                  <div className={`absolute -left-[7px] top-2 w-3 h-3 rounded-full ${isLight ? 'bg-white' : 'bg-black'} border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500 scale-125 shadow-xs' 
                      : 'border-blue-500/70 group-hover:scale-125 group-hover:bg-blue-500'
                  }`} />

                  {/* Milestone Card */}
                  <div
                    onClick={() => {
                      setActiveMilestoneId(milestone.id);
                      setExpandedId(isExpanded ? null : milestone.id);
                    }}
                    className={`border rounded-xl backdrop-blur-xl transition-all duration-200 cursor-pointer interactive-card overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                        : 'border-emerald-500/40 hover:border-emerald-400/60 shadow-sm'
                    }`}
                  >
                    {/* Top Heading Section - Dark Obsidian & Bottle-Green */}
                    <div className="p-3 sm:p-3.5 bg-gradient-to-br from-zinc-950 via-[#042114] to-zinc-950 text-zinc-100">
                      <div className="flex flex-col gap-1.5">
                        <div className="min-w-0 w-full">
                          {/* Company Badge */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {renderCompanyBadge(milestone.company)}

                            {/* Location and Date Range Row */}
                            <div className="text-[11px] font-medium text-emerald-200/80 flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                <span>{milestone.location}</span>
                              </span>
                              <span className="opacity-40 text-emerald-500">|</span>
                              <span className="inline-flex items-center gap-0.5">
                                <Calendar className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                <span>{milestone.period}</span>
                              </span>
                            </div>
                          </div>

                          {/* Role Title */}
                          <h3 className="text-[14px] sm:text-[15px] font-bold tracking-tight text-white leading-snug">
                            {milestone.role}
                          </h3>
                        </div>

                        {/* Category Highlight Badges */}
                        <div className="flex flex-wrap items-center justify-start gap-1 w-full">
                          {milestone.category.split(',').map((catTag, cIdx) => (
                            <span 
                              key={cIdx}
                              className="text-[9.5px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md border whitespace-nowrap shadow-2xs inline-block bg-emerald-900/60 text-emerald-200 border-emerald-500/30"
                            >
                              {catTag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Content Compartment */}
                    <div className="p-3 sm:p-3.5 bg-zinc-50/95 text-zinc-900 border-t border-emerald-500/25 rounded-b-xl shadow-inner">
                      {/* Key Achievements */}
                      <div className="mb-2">
                        <ul className="space-y-1">
                          {milestone.achievements.map((ach, i) => (
                            <li key={i} className="flex items-start space-x-1.5 text-xs sm:text-[12px] leading-relaxed text-zinc-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Executive Summary */}
                      <p className="text-xs sm:text-[12.5px] leading-relaxed mb-1.5 text-zinc-700">
                        {milestone.summary}
                      </p>

                      {/* Collapsible Tech Stack */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-2 pt-2 border-t border-zinc-200 overflow-hidden"
                          >
                            <div className="pt-1">
                              <div className="text-[9.5px] font-semibold uppercase tracking-wider mb-1 text-zinc-500">
                                Technology & Governance Frameworks:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {milestone.technologies.map((tech, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[9px] font-medium px-1.5 py-0.5 rounded border bg-zinc-100 border-zinc-200 text-zinc-800"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expand/Collapse Footer Toggle */}
                      <div className="flex items-center justify-between pt-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                        <span>{isExpanded ? 'Collapse tech frameworks' : 'Inspect technology frameworks & tools'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
