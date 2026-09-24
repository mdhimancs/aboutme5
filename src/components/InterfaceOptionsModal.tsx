import React, { useState } from 'react';
import { X, Palette, Layout, Type, Check, Sparkles } from 'lucide-react';

export type ThemeMode = 'apple-dark' | 'apple-light' | 'obsidian' | 'terminal' | 'emerald-matrix' | 'solarized';
export type AccentColor = 'blue' | 'skyblue' | 'navy' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan' | 'copper' | 'platinum';
export type FontStyle = 'inter' | 'jakarta' | 'outfit' | 'serif' | 'mono';

interface InterfaceOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentAccent: AccentColor;
  onAccentChange: (accent: AccentColor) => void;
  currentFont: FontStyle;
  onFontChange: (font: FontStyle) => void;
  onOpenFontShowcase?: () => void;
}

export const InterfaceOptionsModal: React.FC<InterfaceOptionsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  currentAccent,
  onAccentChange,
  currentFont,
  onFontChange,
  onOpenFontShowcase,
}) => {
  if (!isOpen) return null;

  const isLight = currentTheme === 'apple-light';

  const themes: { id: ThemeMode; name: string; desc: string; preview: string }[] = [
    { id: 'apple-light', name: 'Apple Studio Light', desc: 'Clean, high-contrast light mode (Default)', preview: 'bg-white border-zinc-300 text-zinc-900' },
    { id: 'apple-dark', name: 'Apple Midnight Dark', desc: 'Sleek frosted dark mode inspired by macOS Sequoia', preview: 'bg-[#000000] border-zinc-700 text-white' },
    { id: 'obsidian', name: 'Cyber Obsidian', desc: 'Deep violet gradient ambiance with glowing highlights', preview: 'bg-[#06030d] border-purple-500/40 text-purple-200' },
    { id: 'emerald-matrix', name: 'Emerald Matrix', desc: 'High-contrast executive mint & deep slate combination', preview: 'bg-[#041210] border-emerald-500/40 text-emerald-200' },
    { id: 'solarized', name: 'Solarized Executive', desc: 'Warm titanium cream backdrop with rich navy accents', preview: 'bg-[#fbf7ee] border-amber-300 text-zinc-900' },
    { id: 'terminal', name: 'Hacker Terminal', desc: 'Monochrome matrix feel with high-contrast green', preview: 'bg-black border-emerald-500/50 text-emerald-400' },
  ];

  const accents: { id: AccentColor; name: string; hex: string }[] = [
    { id: 'blue', name: 'Sapphire Blue', hex: '#0f52ba' },
    { id: 'skyblue', name: 'Sky Blue', hex: '#38bdf8' },
    { id: 'navy', name: 'Navy Blue', hex: '#1e3a8a' },
    { id: 'emerald', name: 'Executive Mint', hex: '#34d399' },
    { id: 'violet', name: 'Soft Lavender', hex: '#a78bfa' },
    { id: 'amber', name: 'Bright Brick Red', hex: '#ef4444' },
    { id: 'rose', name: 'Soft Rose Gold', hex: '#fda4af' },
    { id: 'cyan', name: 'Sky Cyan', hex: '#06b6d4' },
    { id: 'copper', name: 'Bottle Green', hex: '#065f46' },
    { id: 'platinum', name: 'Silver Titanium', hex: '#94a3b8' },
  ];

  const fonts: { id: FontStyle; name: string; desc: string }[] = [
    { id: 'inter', name: 'Inter (Sans-Serif)', desc: 'Balanced geometric proportions for seamless readability' },
    { id: 'jakarta', name: 'Plus Jakarta Sans', desc: 'Sleek, modern executive typography for tech leadership' },
    { id: 'outfit', name: 'Outfit (Geometric)', desc: 'High-impact geometric sans with distinct character' },
    { id: 'serif', name: 'Executive Serif', desc: 'Classic editorial serif for executive publications' },
    { id: 'mono', name: 'JetBrains (Monospace)', desc: 'Developer-first terminal & cyber defense aesthetic' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-4xl border rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-5 space-y-3.5 transition-all ${
        isLight
          ? 'bg-[#f4f4f6] border-zinc-300 text-zinc-900'
          : 'bg-[#0a0a0c] border-white/10 text-white'
      }`}>
        <div className="flex items-center justify-between border-b pb-2.5 border-zinc-200/60">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Interface Customizer
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Tailor theme surface mode, accent color palette, and executive typography.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight ? 'text-zinc-600 hover:text-zinc-950 bg-zinc-200/80' : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Themes - 3 Columns Horizontal Grid */}
        <div className="space-y-1.5">
          <label className={`text-[10.5px] font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            <Layout className="w-3 h-3" />
            <span>Theme & Surface Mode</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {themes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => onThemeChange(t.id)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? (isLight ? 'border-blue-600 bg-blue-50 shadow-xs' : 'border-blue-500 bg-blue-500/10 shadow-lg')
                      : (isLight ? 'border-zinc-200 bg-white hover:border-zinc-300' : 'border-white/10 bg-white/[0.02] hover:border-white/20')
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[11px] font-bold truncate ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                      {t.name}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-blue-500 shrink-0 ml-1" />}
                  </div>
                  <p className={`text-[9.5px] leading-snug line-clamp-2 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accent Colors - 6 Columns Horizontal Grid */}
        <div className="space-y-1.5">
          <label className={`text-[10.5px] font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            <Sparkles className="w-3 h-3" />
            <span>Accent Color Palette</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-5 gap-1.5">
            {accents.map((acc) => {
              const isSelected = currentAccent === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => onAccentChange(acc.id)}
                  className={`p-1.5 px-2 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                    isSelected
                      ? (isLight ? 'border-zinc-800 bg-white shadow-xs font-bold' : 'border-white bg-white/10 font-bold')
                      : (isLight ? 'border-zinc-200 bg-white hover:bg-zinc-100' : 'border-white/10 bg-white/[0.02] hover:bg-white/5')
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs accent-swatch" 
                    style={{ backgroundColor: acc.hex }} 
                  />
                  <span className={`text-[11px] truncate ${isLight ? 'text-zinc-900' : 'text-white'}`}>{acc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography - 4 Columns Horizontal Grid */}
        <div className="space-y-1.5">
          <label className={`text-[10.5px] font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            <Type className="w-3 h-3" />
            <span>Typography Mode</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {fonts.map((f) => {
              const isSelected = currentFont === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => onFontChange(f.id)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? (isLight ? 'border-blue-600 bg-blue-50' : 'border-blue-500 bg-blue-500/10')
                      : (isLight ? 'border-zinc-200 bg-white hover:border-zinc-300' : 'border-white/10 bg-white/[0.02] hover:border-white/20')
                  }`}
                >
                  <div className={`text-[11px] font-bold truncate ${isLight ? 'text-zinc-900' : 'text-white'}`}>{f.name}</div>
                  <div className={`text-[9.5px] mt-0.5 leading-tight line-clamp-1 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action */}
        <div className={`pt-2 border-t flex items-center justify-between gap-2 ${isLight ? 'border-zinc-200' : 'border-white/10'}`}>
          {onOpenFontShowcase ? (
            <button
              onClick={onOpenFontShowcase}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Explore Top 56 Fonts</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer"
          >
            Apply Interface Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
