/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExecutiveBio } from './components/ExecutiveBio';
import { CoreCompetencies } from './components/CoreCompetencies';
import { CareerJourney } from './components/CareerJourney';
import { TechnicalBlog } from './components/TechnicalBlog';
import { OffKeyboard } from './components/OffKeyboard';
import { Archive } from './components/Archive';
import { Projects } from './components/Projects';
import { Philosophy } from './components/Philosophy';
import { ContactModal } from './components/ContactModal';
import { GateModal } from './components/GateModal';
import { ExecutiveVaultGateModal } from './components/ExecutiveVaultGateModal';
import { DenyListBlockScreen } from './components/DenyListBlockScreen';
import { useAuth } from './context/AuthContext';
import { InterfaceOptionsModal, ThemeMode, AccentColor, FontStyle } from './components/InterfaceOptionsModal';
import { SuperAdminConsoleModal } from './components/SuperAdminConsoleModal';
import { ExecutiveFontsShowcaseModal, TOP_56_EXECUTIVE_FONTS } from './components/ExecutiveFontsShowcaseModal';
import { ChevronUp, ChevronDown, Clock, AlertTriangle, X } from 'lucide-react';
import { motion } from 'motion/react';

const SECTIONS = ['overview', 'bio', 'competencies', 'career', 'projects', 'blog', 'offkeyboard', 'philosophy', 'archive'] as const;
type SectionId = typeof SECTIONS[number];

const SECTION_LABELS: Record<SectionId, string> = {
  overview: 'Overview',
  bio: 'Executive Bio',
  competencies: 'Competencies',
  career: 'Career Journey',
  projects: 'Case Studies',
  blog: 'Publications',
  offkeyboard: 'Off Keyboard',
  philosophy: 'Philosophy',
  archive: 'Archives & Patents'
};

interface SnapSectionProps {
  id: SectionId;
  children: React.ReactNode;
}

const SnapSection: React.FC<SnapSectionProps> = ({ id, children }) => {
  return (
    <div id={id} className="snap-section w-full">
      <motion.div
        initial={{ opacity: 0.1, scale: 0.98, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0.1, scale: 0.98, y: -24 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function App() {
  const { 
    isDenied, 
    denyReason, 
    clientIp, 
    user,
    vaultModalOpen, 
    setVaultModalOpen, 
    targetRoadmap,
    jwtSessionInfo,
    jwtExpiredAlert,
    dismissJwtAlert
  } = useAuth();

  const [contactOpen, setContactOpen] = useState(false);
  const [interfaceModalOpen, setInterfaceModalOpen] = useState(false);
  const [fontsShowcaseOpen, setFontsShowcaseOpen] = useState(false);
  const [customFontFamily, setCustomFontFamily] = useState<string | null>(null);
  const [superAdminOpen, setSuperAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [scrollProgress, setScrollProgress] = useState(0);

  const [theme, setTheme] = useState<ThemeMode>('apple-light');
  const [accent, setAccent] = useState<AccentColor>('blue');
  const [font, setFont] = useState<FontStyle>('inter');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('executive_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('executive_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const activeIndex = Math.max(0, SECTIONS.indexOf(activeSection));

  // Navigate to target section smoothly
  const navigateToSection = useCallback((sectionId: SectionId) => {
    const el = document.getElementById(sectionId);
    if (el && containerRef.current) {
      isTransitioningRef.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      window.history.pushState(null, '', `#${sectionId}`);
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 700);
    }
  }, []);

  // Handle initial hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as SectionId;
    if (hash && SECTIONS.includes(hash)) {
      setTimeout(() => {
        navigateToSection(hash);
      }, 300);
    }
  }, [navigateToSection]);

  // Sync activeSection with URL hash on scroll
  useEffect(() => {
    if (activeSection) {
      window.history.replaceState(null, '', `#${activeSection}`);
    }
  }, [activeSection]);

  const navigateToIndex = useCallback((index: number) => {
    if (index >= 0 && index < SECTIONS.length) {
      navigateToSection(SECTIONS[index]);
    }
  }, [navigateToSection]);

  const handleNextPage = useCallback(() => {
    if (activeIndex < SECTIONS.length - 1) {
      navigateToIndex(activeIndex + 1);
    }
  }, [activeIndex, navigateToIndex]);

  const handlePrevPage = useCallback(() => {
    if (activeIndex > 0) {
      navigateToIndex(activeIndex - 1);
    }
  }, [activeIndex, navigateToIndex]);

  // Sync active section based on scroll position in scroll container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const totalScroll = container.scrollHeight - container.clientHeight;
      if (totalScroll > 0) {
        setScrollProgress(container.scrollTop / totalScroll);
      }

      if (isTransitioningRef.current) return;
      const scrollPosition = container.scrollTop + container.clientHeight / 2;

      for (const section of SECTIONS) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Wheel interception for discrete page-down / page-up navigation stops
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use a ref to store the last scroll time to prevent rapid-fire switching
    let lastScrollTime = 0;
    const SCROLL_COOLDOWN = 600; // ms

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if modifier keys are pressed or modals are open
      if (e.ctrlKey || e.metaKey || e.altKey || contactOpen || interfaceModalOpen) return;

      const now = Date.now();
      if (now - lastScrollTime < SCROLL_COOLDOWN) {
        if (isTransitioningRef.current) e.preventDefault();
        return;
      }

      // Check if event originated inside a scrollable sub-element or an interactive control
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'SELECT' || target?.closest('.no-scroll-hijack')) {
        return;
      }

      const scrollableChild = target?.closest('.overflow-y-auto, .overflow-auto') as HTMLElement | null;

      if (scrollableChild) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableChild;
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;

        // If inner element can scroll further in that direction, let it scroll naturally
        if (isScrollingDown && scrollTop + clientHeight < scrollHeight - 5) {
          return;
        }
        if (isScrollingUp && scrollTop > 5) {
          return;
        }
      }

      // If already animating, prevent standard jump
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      // Threshold check for wheel intensity - lowered to 15 for better sensitivity
      if (Math.abs(e.deltaY) > 15) {
        e.preventDefault();
        lastScrollTime = now;
        if (e.deltaY > 0) {
          handleNextPage();
        } else {
          handlePrevPage();
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    // Also listen on the document to capture scroll events even when mouse is over sidebar or other non-container areas
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [handleNextPage, handlePrevPage]);

  // Keyboard navigation for page-down / page-up / arrow keys / space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea, or if modals are open
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        contactOpen ||
        interfaceModalOpen
      ) {
        return;
      }

      if (e.key === 'PageDown' || e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey)) {
        // Special check: if Alt is held, allow browser default behaviors if any
        if (e.altKey) return;
        
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey)) {
        if (e.altKey) return;
        
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateToIndex(SECTIONS.length - 1);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, navigateToIndex, handleToggleSidebar]);

  // Security: Content protection removed per user request to allow copying/cutting/selecting
  useEffect(() => {
    // Keep standard browser behavior for contextmenu, copy, cut, drag, and save/view source
  }, []);

  // Touch swipe support for mobile stops
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartYRef.current - touchEndY;

    // Check if swipe distance is significant (> 45px)
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    touchStartYRef.current = null;
  };

  // Apply dynamic accent color variables and font families to document root
  useEffect(() => {
    const root = document.documentElement;
    if (accent === 'skyblue') { // Radiant Sky Blue
      root.style.setProperty('--accent-color', '#38bdf8');
      root.style.setProperty('--accent-hover', '#0ea5e9');
      root.style.setProperty('--accent-bg', '#f0f9ff');
      root.style.setProperty('--accent-border', '#bae6fd');
      root.style.setProperty('--accent-text', '#0284c7');
    } else if (accent === 'navy') { // Imperial Navy Blue
      root.style.setProperty('--accent-color', '#2563eb');
      root.style.setProperty('--accent-hover', '#1e40af');
      root.style.setProperty('--accent-bg', '#eff6ff');
      root.style.setProperty('--accent-border', '#93c5fd');
      root.style.setProperty('--accent-text', '#1e3a8a');
    } else if (accent === 'emerald') { // Executive Mint
      root.style.setProperty('--accent-color', '#34d399');
      root.style.setProperty('--accent-hover', '#10b981');
      root.style.setProperty('--accent-bg', '#ecfdf5');
      root.style.setProperty('--accent-border', '#a7f3d0');
      root.style.setProperty('--accent-text', '#059669');
    } else if (accent === 'violet') { // Soft Lavender
      root.style.setProperty('--accent-color', '#a78bfa');
      root.style.setProperty('--accent-hover', '#8b5cf6');
      root.style.setProperty('--accent-bg', '#f5f3ff');
      root.style.setProperty('--accent-border', '#ddd6fe');
      root.style.setProperty('--accent-text', '#7c3aed');
    } else if (accent === 'amber') { // Bright Brick Red
      root.style.setProperty('--accent-color', '#ef4444');
      root.style.setProperty('--accent-hover', '#dc2626');
      root.style.setProperty('--accent-bg', '#fef2f2');
      root.style.setProperty('--accent-border', '#fecaca');
      root.style.setProperty('--accent-text', '#b91c1c');
    } else if (accent === 'rose') { // Soft Rose Gold (1 shade lighter)
      root.style.setProperty('--accent-color', '#fda4af');
      root.style.setProperty('--accent-hover', '#fb7185');
      root.style.setProperty('--accent-bg', '#fff1f2');
      root.style.setProperty('--accent-border', '#fecdd3');
      root.style.setProperty('--accent-text', '#e11d48');
    } else if (accent === 'cyan') { // Sky Cyan
      root.style.setProperty('--accent-color', '#38bdf8');
      root.style.setProperty('--accent-hover', '#0ea5e9');
      root.style.setProperty('--accent-bg', '#f0f9ff');
      root.style.setProperty('--accent-border', '#bae6fd');
      root.style.setProperty('--accent-text', '#0284c7');
    } else if (accent === 'copper') { // Bottle Green
      root.style.setProperty('--accent-color', '#065f46');
      root.style.setProperty('--accent-hover', '#064e3b');
      root.style.setProperty('--accent-bg', '#ecfdf5');
      root.style.setProperty('--accent-border', '#6ee7b7');
      root.style.setProperty('--accent-text', '#047857');
    } else if (accent === 'platinum') { // Silver Titanium
      root.style.setProperty('--accent-color', '#94a3b8');
      root.style.setProperty('--accent-hover', '#64748b');
      root.style.setProperty('--accent-bg', '#f8fafc');
      root.style.setProperty('--accent-border', '#e2e8f0');
      root.style.setProperty('--accent-text', '#475569');
    } else { // Sapphire Blue default
      root.style.setProperty('--accent-color', '#0f52ba');
      root.style.setProperty('--accent-hover', '#0d47a1');
      root.style.setProperty('--accent-bg', '#eff6ff');
      root.style.setProperty('--accent-border', '#93c5fd');
      root.style.setProperty('--accent-text', '#0f52ba');
    }
  }, [accent]);

  // Auto-collapse customizer modal after 30 seconds
  useEffect(() => {
    if (!interfaceModalOpen) return;

    const timer = setTimeout(() => {
      setInterfaceModalOpen(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, [interfaceModalOpen]);

  // Compute theme background & text styles
  const getThemeClass = () => {
    switch (theme) {
      case 'apple-light':
        return 'bg-[#fcfcfd] text-zinc-900';
      case 'solarized':
        return 'bg-[#fbf7ee] text-zinc-900';
      case 'emerald-matrix':
        return 'bg-[#041210] text-[#a7f3d0]';
      case 'obsidian':
        return 'bg-[#06030d] text-[#e2d9fc]';
      case 'terminal':
        return 'bg-black text-[#00ff66] font-mono';
      case 'apple-dark':
      default:
        return 'bg-[#000000] text-[#f5f5f7]';
    }
  };

  const getFontClass = () => {
    if (customFontFamily) return '';
    switch (font) {
      case 'jakarta':
        return 'font-["Plus_Jakarta_Sans",sans-serif]';
      case 'outfit':
        return 'font-["Outfit",sans-serif]';
      case 'serif':
        return 'font-["Playfair_Display",serif]';
      case 'mono':
        return 'font-["JetBrains_Mono",monospace]';
      case 'inter':
      default:
        return 'font-["Inter",sans-serif]';
    }
  };

  const isLight = theme === 'apple-light' || theme === 'solarized';

  if (isDenied) {
    return (
      <DenyListBlockScreen 
        clientIp={clientIp} 
        reason={denyReason} 
        identifier={user?.email || undefined} 
      />
    );
  }

  return (
    <div 
      style={{ fontFamily: customFontFamily || undefined }}
      className={`h-screen w-screen overflow-hidden transition-colors duration-500 theme-${theme} accent-${accent} ${getThemeClass()} ${getFontClass()}`}
    >
      <Navbar
        onOpenContact={() => setContactOpen(true)}
        onOpenInterfaceOptions={() => setInterfaceModalOpen(true)}
        onOpenSuperAdmin={() => setSuperAdminOpen(true)}
        activeSection={activeSection}
        theme={theme}
        onNavigate={(id) => navigateToSection(id as SectionId)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      
      {/* Main Snap Scroll Container */}
      <div 
        ref={containerRef}
        id="main-scroll-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (interfaceModalOpen) setInterfaceModalOpen(false);
        }}
        style={{ marginLeft: isSidebarCollapsed ? '72px' : '295px' }}
        className="h-screen overflow-y-auto scroll-container select-text transition-[margin] duration-300 ease-in-out relative"
      >
        {/* Atmospheric Top Scroll Progress Bar */}
        <div className="sticky top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-100 ease-out shadow-[0_0_16px_rgba(59,130,246,0.8)]"
            style={{ width: `${scrollProgress * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-12 bg-white/40 blur-sm transition-all duration-100 ease-out -translate-y-1/2"
            style={{ left: `calc(${scrollProgress * 100}% - 24px)` }}
          />
        </div>

        <main className="w-full">
          {/* Stop 1: Overview */}
          <SnapSection id="overview">
            <Hero 
              onOpenContact={() => setContactOpen(true)} 
              onExploreBlog={() => navigateToSection('blog')} 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 2: Executive Bio */}
          <SnapSection id="bio">
            <ExecutiveBio 
              theme={theme} 
              onNextPage={handleNextPage}
            />
          </SnapSection>

          {/* Stop 3: Core Technical Competencies */}
          <SnapSection id="competencies">
            <CoreCompetencies 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 4: Career Journey */}
          <SnapSection id="career">
            <CareerJourney 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 5: Case Studies (Projects) */}
          <SnapSection id="projects">
            <Projects 
              theme={theme} 
            />
          </SnapSection>
          
          {/* Stop 6: Technical Blog */}
          <SnapSection id="blog">
            <TechnicalBlog 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 7: Off Keyboard */}
          <SnapSection id="offkeyboard">
            <OffKeyboard 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 8: Philosophy */}
          <SnapSection id="philosophy">
            <Philosophy 
              theme={theme} 
              onNavigate={(id) => navigateToSection(id as SectionId)}
            />
          </SnapSection>
          
          {/* Stop 9: Archives & Patents + Integrated Footer */}
          <SnapSection id="archive">
            <Archive 
              theme={theme} 
              onOpenContact={() => setContactOpen(true)}
              onScrollToTop={() => navigateToIndex(0)}
            />
          </SnapSection>
        </main>
      </div>

      {/* Floating Page Stop Navigation Controller & Indicator */}
      <div className="fixed bottom-3 sm:bottom-3.5 right-3.5 sm:right-4 z-40 flex items-center">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
          isLight ? 'bg-white/90 border-zinc-200 text-zinc-900 shadow-zinc-200/50' : 'bg-zinc-950/80 border-white/15 text-white shadow-black/80'
        }`}>
          {/* Stop Dots */}
          <div className="hidden sm:flex items-center gap-1 px-0.5">
            {SECTIONS.map((sec, idx) => (
              <button
                key={sec}
                onClick={() => navigateToIndex(idx)}
                title={`Jump to ${SECTION_LABELS[sec]}`}
                className={`transition-all rounded-full ${
                  activeSection === sec
                    ? 'w-3.5 h-1.5 bg-blue-500'
                    : `w-1.5 h-1.5 ${isLight ? 'bg-zinc-300 hover:bg-zinc-500' : 'bg-white/25 hover:bg-white/50'}`
                }`}
              />
            ))}
          </div>

          <div className={`hidden sm:block h-3 w-[1px] ${isLight ? 'bg-zinc-200' : 'bg-white/15'}`} />

          {/* Current Stop Number */}
          <div className="flex items-center gap-1 text-xs font-semibold px-0.5">
            <span className="font-mono text-blue-500 tabular-nums">{activeIndex + 1}</span>
            <span className="text-[10px] opacity-40">/</span>
            <span className="text-[10px] opacity-60 font-mono">{SECTIONS.length}</span>
          </div>

          {/* Page Up / Page Down Action Buttons */}
          <div className="flex items-center gap-0.5 pl-0.5">
            <button
              onClick={handlePrevPage}
              disabled={activeIndex === 0}
              title="Page Up / Previous Stop (↑ or PgUp)"
              className={`p-0.5 rounded-full border transition-all ${
                activeIndex === 0
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : (isLight ? 'hover:bg-zinc-100 border-zinc-200 active:scale-95' : 'hover:bg-white/10 border-white/10 active:scale-95')
              }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={activeIndex === SECTIONS.length - 1}
              title="Page Down / Next Stop (↓ or PgDn)"
              className={`p-0.5 rounded-full border transition-all ${
                activeIndex === SECTIONS.length - 1
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : (isLight ? 'hover:bg-zinc-100 border-zinc-200 active:scale-95' : 'hover:bg-white/10 border-white/10 active:scale-95')
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8-Hour Search Partner Link Expiration Warning */}
      {jwtExpiredAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] bg-red-950/95 border border-red-500/50 text-red-200 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-white block mb-0.5">Time-Bound Search Partner Link Expired</span>
            <p className="leading-relaxed text-red-300">{jwtExpiredAlert}</p>
          </div>
          <button 
            type="button"
            onClick={dismissJwtAlert}
            className="p-1 text-red-400 hover:text-white rounded-lg hover:bg-red-900/50 transition-colors cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Secure 2-Hour JWT Active Session Indicator */}
      {jwtSessionInfo?.active && (
        <div className="fixed top-3.5 left-4 sm:left-auto sm:right-28 z-40 max-w-md flex flex-col gap-1 px-3.5 py-2 rounded-2xl bg-blue-950/90 border border-blue-500/40 text-blue-200 shadow-2xl backdrop-blur-md text-[11px] font-mono">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-white">Partner Access ({jwtSessionInfo.hoursRemaining ?? 2}h left)</span>
            </div>
            <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 font-bold border border-blue-400/30">JWT 2-Hour</span>
          </div>
          <p className="text-[10px] text-blue-300 leading-tight">
            Note: Current session is valid for 2 hours (up to 4 hours maximum) and will auto expire. Access needs to be requested again after expiration.
          </p>
        </div>
      )}

      <ContactModal theme={theme} isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <GateModal />
      <ExecutiveVaultGateModal
        isOpen={vaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
        targetRoadmap={targetRoadmap}
        onUnlocked={() => {
          if (targetRoadmap?.action) {
            targetRoadmap.action();
          }
        }}
      />
      <InterfaceOptionsModal
        isOpen={interfaceModalOpen}
        onClose={() => setInterfaceModalOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        currentAccent={accent}
        onAccentChange={setAccent}
        currentFont={font}
        onFontChange={(f) => { setFont(f); setCustomFontFamily(null); }}
        onOpenFontShowcase={() => {
          setInterfaceModalOpen(false);
          setFontsShowcaseOpen(true);
        }}
      />
      <ExecutiveFontsShowcaseModal
        isOpen={fontsShowcaseOpen}
        onClose={() => setFontsShowcaseOpen(false)}
        currentFont={customFontFamily || font}
        onSelectFont={(fontFamily) => {
          setCustomFontFamily(fontFamily);
          setFontsShowcaseOpen(false);
        }}
      />
      <SuperAdminConsoleModal
        isOpen={superAdminOpen}
        onClose={() => setSuperAdminOpen(false)}
        theme={theme}
      />
    </div>
  );
}
