import React, { useState, useEffect, useCallback } from 'react';
import { Award, Briefcase, Layers, RotateCcw, Sparkles, CheckCircle2, ShieldCheck, BadgeCheck } from 'lucide-react';

interface MilestonesHighlightsCounterProps {
  theme?: string;
  className?: string;
}

interface CounterItem {
  id: string;
  target: number;
  suffix: string;
  label: string;
  subtitle: string;
  highlight: string;
  icon: React.ReactNode;
  colorScheme: 'blue' | 'emerald' | 'amber';
}

const COUNTER_DATA: CounterItem[] = [
  {
    id: 'experience',
    target: 21,
    suffix: '+',
    label: 'Years of Experience',
    subtitle: '2005–2026 · Banking & Tech Defense',
    highlight: 'Goldman Sachs & Tech Tier-1',
    icon: <Briefcase className="w-4 h-4" />,
    colorScheme: 'blue'
  },
  {
    id: 'projects',
    target: 50,
    suffix: '+',
    label: 'Projects Delivered',
    subtitle: 'Enterprise IAM, ZTNA & Cloud Enclaves',
    highlight: '120+ Banking Systems Architected',
    icon: <Layers className="w-4 h-4" />,
    colorScheme: 'emerald'
  },
  {
    id: 'certifications',
    target: 12,
    suffix: '+',
    label: 'Elite Certifications',
    subtitle: 'CISSP, CISM, AWS Sec, SC-100 & CCSP',
    highlight: 'ISACA, (ISC)², AWS & Microsoft',
    icon: <BadgeCheck className="w-4 h-4" />,
    colorScheme: 'amber'
  }
];

export const MilestonesHighlightsCounter: React.FC<MilestonesHighlightsCounterProps> = ({ 
  theme = 'apple-dark',
  className = ''
}) => {
  const isLight = theme === 'apple-light';
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    experience: 0,
    projects: 0,
    certifications: 0
  });
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [animationKey, setAnimationKey] = useState<number>(0);

  const startAnimation = useCallback(() => {
    // Respect user's motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCounts({
        experience: 21,
        projects: 50,
        certifications: 12
      });
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    const duration = 1800; // ms
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Smooth ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCounts({
        experience: Math.round(easeProgress * 21),
        projects: Math.round(easeProgress * 50),
        certifications: Math.round(easeProgress * 12)
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const cancel = startAnimation();
    return () => {
      if (cancel) cancel();
    };
  }, [animationKey, startAnimation]);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto my-1.5 sm:my-2 px-1 ${className}`}>
      {/* Outer Executive Container with Micro-border & Depth */}
      <div 
        className={`relative rounded-2xl p-2.5 sm:p-3.5 border transition-all duration-300 backdrop-blur-xl ${
          isLight
            ? 'bg-gradient-to-b from-white/95 via-white/90 to-blue-50/40 border-zinc-200/90 shadow-md shadow-zinc-200/50'
            : 'bg-gradient-to-b from-zinc-950/95 via-zinc-950/85 to-[#041a12]/30 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Subtle Ambient Glow behind counter card */}
        <div 
          className={`absolute -inset-1 rounded-2xl blur-xl pointer-events-none transition-all duration-500 ${
            isLight
              ? 'bg-gradient-to-r from-blue-400/10 via-emerald-300/10 to-indigo-300/10 opacity-60'
              : 'bg-gradient-to-r from-blue-500/15 via-emerald-500/10 to-indigo-500/15 opacity-50'
          }`} 
        />

        {/* Top Header Row with Title and Replay Interactive Trigger */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-2 sm:mb-2.5 px-1 border-b pb-1.5 border-zinc-200/60 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <div className={`p-1 rounded-md ${isLight ? 'bg-blue-500/10 text-blue-600' : 'bg-blue-500/15 text-blue-400'}`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <h3 className={`text-[11.5px] sm:text-[12.5px] font-extrabold tracking-tight uppercase ${
              isLight ? 'text-zinc-900' : 'text-zinc-100'
            }`}>
              Milestones & Key Highlights
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReplay}
              title="Replay counter animation"
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all duration-200 border cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border-zinc-200 shadow-2xs'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10 shadow-2xs'
              }`}
            >
              <RotateCcw className={`w-2.5 h-2.5 ${isAnimating ? 'animate-spin text-blue-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">{isAnimating ? 'Counting...' : 'Replay'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Counter Columns */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {COUNTER_DATA.map((item) => {
            const currentCount = counts[item.id] ?? 0;
            
            // Accent styling per metric
            let badgeBg = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            let numberColor = isLight ? 'text-zinc-900' : 'text-white';
            let glowBorder = isLight ? 'hover:border-blue-300' : 'hover:border-blue-500/40';

            if (item.colorScheme === 'emerald') {
              badgeBg = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
              glowBorder = isLight ? 'hover:border-emerald-300' : 'hover:border-emerald-500/40';
            } else if (item.colorScheme === 'amber') {
              badgeBg = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
              glowBorder = isLight ? 'hover:border-amber-300' : 'hover:border-amber-500/40';
            }

            return (
              <div
                key={item.id}
                onClick={handleReplay}
                className={`group relative p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isLight 
                    ? `bg-white/95 border-zinc-200/90 shadow-xs hover:shadow-md ${glowBorder}` 
                    : `bg-zinc-900/60 border-white/8 hover:bg-zinc-900/80 shadow-md ${glowBorder}`
                }`}
              >
                {/* Micro Header with Icon & Micro-Highlight */}
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className={`p-1.5 rounded-lg border shrink-0 ${badgeBg} group-hover:scale-105 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className={`text-[9px] sm:text-[9.5px] font-mono font-medium truncate ${
                    isLight ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    {item.highlight}
                  </span>
                </div>

                {/* Animated Value */}
                <div className="my-0.5">
                  <div className="flex items-baseline gap-0.5">
                    <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums transition-colors ${numberColor}`}>
                      {currentCount}
                    </span>
                    <span className={`text-base sm:text-lg font-bold ${
                      item.colorScheme === 'blue' 
                        ? 'text-blue-500' 
                        : item.colorScheme === 'emerald' 
                          ? 'text-emerald-500' 
                          : 'text-amber-500'
                    }`}>
                      {item.suffix}
                    </span>
                  </div>

                  {/* Primary Label */}
                  <h4 className={`text-[12px] sm:text-[13px] font-bold tracking-tight leading-tight mt-0.5 ${
                    isLight ? 'text-zinc-900' : 'text-zinc-100'
                  }`}>
                    {item.label}
                  </h4>
                </div>

                {/* Subtitle / Descriptive Context */}
                <p className={`text-[10px] sm:text-[10.5px] leading-snug line-clamp-1 mt-0.5 ${
                  isLight ? 'text-zinc-600' : 'text-zinc-400'
                }`}>
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
