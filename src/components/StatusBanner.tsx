import React, { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare, X } from 'lucide-react';

interface StatusBannerProps {
  theme?: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ theme = 'apple-light' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isLight = theme === 'apple-light' || theme === 'solarized';

  if (!isVisible) return null;

  return (
    <div className={`relative z-[100] w-full py-2.5 px-6 sm:px-14 flex items-center justify-center transition-all duration-500 animate-in slide-in-from-top fill-mode-forwards ${
      isLight 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'bg-[#090d16] border-b border-blue-500/20 text-blue-50 shadow-2xl'
    }`}>
      <div className="max-w-[1400px] w-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-xl ${
            isLight ? 'bg-white/15' : 'bg-blue-500/10 border border-blue-400/20'
          }`}>
            <RefreshCw className={`w-4 h-4 ${isLight ? 'text-white' : 'text-blue-400'} animate-spin-slow`} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 overflow-hidden">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
              isLight ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
            }`}>
              Status Update
            </span>
            <p className="text-[11.5px] sm:text-[13px] font-bold tracking-tight leading-tight truncate opacity-95">
              The website is updated continously, if you are unable to access the website, you may wait for the website to complete maintenance or alternatively you may also ping me.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isLight ? 'bg-white/10 border border-white/20' : 'bg-blue-500/10 text-blue-300 border border-blue-400/10'
          }`}>
            <MessageSquare className="w-3 h-3" />
            <span>Direct Access Channel Active</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
              isLight ? 'hover:bg-white/20 text-white' : 'hover:bg-white/10 text-blue-200'
            }`}
            aria-label="Dismiss Status Update"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Custom slow spin for executive feel */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
