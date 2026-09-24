import React from 'react';

interface SectionBackgroundAuraProps {
  theme?: string;
  auraLevel?: 1 | 2 | 3 | 4 | 5;
}

export const SectionBackgroundAura: React.FC<SectionBackgroundAuraProps> = ({ 
  theme = 'apple-light',
  auraLevel = 3
}) => {
  const isLight = theme === 'apple-light' || theme === 'solarized';

  // Scale blur and opacity by level 1 to 5
  const blurClass = {
    1: 'blur-[90px] sm:blur-[120px]',
    2: 'blur-[110px] sm:blur-[150px]',
    3: 'blur-[130px] sm:blur-[180px]',
    4: 'blur-[140px] sm:blur-[190px]',
    5: 'blur-[160px] sm:blur-[220px]'
  }[auraLevel] || 'blur-[130px] sm:blur-[180px]';

  const gradientClass = isLight
    ? {
        1: 'bg-gradient-to-tr from-blue-400/8 via-cyan-300/6 to-indigo-400/6',
        2: 'bg-gradient-to-tr from-blue-400/12 via-cyan-300/10 to-indigo-400/10',
        3: 'bg-gradient-to-tr from-blue-400/16 via-cyan-300/14 to-indigo-400/14',
        4: 'bg-gradient-to-tr from-blue-400/20 via-cyan-300/18 to-indigo-400/18',
        5: 'bg-gradient-to-tr from-blue-400/26 via-cyan-300/24 to-indigo-400/24'
      }[auraLevel]
    : {
        1: 'bg-gradient-to-tr from-blue-600/10 via-indigo-500/8 to-cyan-500/8',
        2: 'bg-gradient-to-tr from-blue-600/15 via-indigo-500/14 to-cyan-500/12',
        3: 'bg-gradient-to-tr from-blue-600/20 via-indigo-500/18 to-cyan-500/16',
        4: 'bg-gradient-to-tr from-blue-600/25 via-indigo-500/22 to-cyan-500/20',
        5: 'bg-gradient-to-tr from-blue-600/32 via-indigo-500/28 to-cyan-500/26'
      }[auraLevel];

  return (
    <>
      {/* Central Ambient Aura Gradient */}
      <div 
        className={`fixed inset-0 w-full h-full ${blurClass} pointer-events-none transition-all duration-700 ${gradientClass}`}
      />
      {/* Bottom-Right Soft Corner Orb */}
      <div 
        className={`fixed bottom-0 right-0 w-1/2 h-1/2 rounded-full blur-[100px] sm:blur-[140px] translate-x-1/4 translate-y-1/4 pointer-events-none ${
          isLight ? 'bg-indigo-500/12' : 'bg-indigo-600/16'
        }`} 
      />
      {/* Top-Left Soft Corner Orb */}
      <div 
        className={`fixed top-0 left-0 w-1/2 h-1/2 rounded-full blur-[90px] sm:blur-[130px] -translate-x-1/4 -translate-y-1/4 pointer-events-none ${
          isLight ? 'bg-sky-400/6' : 'bg-indigo-600/6'
        }`} 
      />
    </>
  );
};
