import React, { useState } from 'react';
import { 
  Menu, X, ArrowRight, Github, Linkedin, Mail, Sliders, Shield, Swords, Music, 
  ChevronLeft, ChevronRight, Lock, ShieldCheck, 
  LayoutDashboard, UserCheck, Target, Briefcase, Layers, BookOpen, Coffee, Brain, Archive 
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { MusicPlayer } from './MusicPlayer';
import { UserTelemetry } from './UserTelemetry';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenInterfaceOptions: () => void;
  onOpenSuperAdmin: () => void;
  activeSection: string;
  theme?: string;
  onNavigate?: (sectionId: string) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenContact, 
  onOpenInterfaceOptions, 
  onOpenSuperAdmin,
  activeSection, 
  theme = 'apple-light',
  onNavigate,
  isSidebarCollapsed = false,
  onToggleSidebar
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = theme === 'apple-light';
  const { user, isAuthorized, isAdmin, setGateModalOpen } = useAuth();

  const navLinks = [
    { id: 'overview', name: 'Overview', href: '#overview', num: '1', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'bio', name: 'Executive Bio', href: '#bio', num: '2', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'competencies', name: 'Competencies', href: '#competencies', num: '3', icon: <Target className="w-4 h-4" /> },
    { id: 'career', name: 'Career Journey', href: '#career', num: '4', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'projects', name: 'Case Studies', href: '#projects', num: '5', icon: <Layers className="w-4 h-4" /> },
    { id: 'blog', name: 'Publications', href: '#blog', num: '6', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'offkeyboard', name: 'Off Keyboard', href: '#offkeyboard', num: '7', icon: <Coffee className="w-4 h-4" /> },
    { id: 'philosophy', name: 'Philosophy', href: '#philosophy', num: '8', icon: <Brain className="w-4 h-4" /> },
    { id: 'archive', name: 'Archives', href: '#archive', num: '9', icon: <Archive className="w-4 h-4" /> },
  ];

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      {/* Desktop Left Sidebar (Navigation Plane) */}
      <aside 
        style={{
          width: isSidebarCollapsed ? '72px' : '295px',
          paddingLeft: isSidebarCollapsed ? '12px' : '32px',
          paddingRight: isSidebarCollapsed ? '12px' : '28px',
          paddingTop: '30px',
          paddingBottom: '20px',
          marginTop: '0px',
          marginLeft: '0px',
          marginRight: '0px'
        }}
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-50 flex-col border-r backdrop-blur-2xl transition-all duration-300 ease-in-out no-scrollbar ${
          isSidebarCollapsed ? 'items-center' : ''
        } ${
          isLight
            ? 'bg-white/90 border-zinc-200 text-zinc-900 shadow-sm'
            : 'bg-[#050507]/90 border-white/10 text-white shadow-2xl'
        }`}
      >
        {/* Top: Name & Logo */}
        <div className="shrink-0 relative w-full">
          <div className={`flex items-center gap-1.5 w-full ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <a
              href="#overview"
              onClick={(e) => handleLinkClick(e, 'overview')}
              className={`flex items-center group cursor-pointer min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl ${isSidebarCollapsed ? 'justify-center p-1' : 'space-x-3 flex-1'}`}
              title="Overview"
            >
              {/* Enhanced Luminous Executive Cybersecurity Crest */}
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#0284c7] via-[#1d4ed8] to-[#0a1224] flex items-center justify-center text-white shadow-[0_0_24px_rgba(37,99,235,0.45)] ring-1 ring-cyan-400/40 border border-white/30 flex-shrink-0 relative overflow-hidden group-hover:scale-105 group-hover:shadow-[0_0_32px_rgba(56,189,248,0.75)] group-hover:border-cyan-300/60 transition-all duration-300">
                {/* Specular Radial Core Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.4),transparent_65%)] pointer-events-none" />
                
                {/* Upper Glass Specular Arc */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

                {/* Razor-Sharp Crossed Swords Accent in Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-45 z-0">
                  <Swords className="w-8 h-8 text-cyan-200 transform scale-110" strokeWidth={1.8} />
                </div>

                {/* High-Clarity Vector Shield Crest in Foreground (Larger) */}
                <svg viewBox="0 0 32 32" className="w-[30.4px] h-[30.4px] relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]" fill="none">
                  <defs>
                    <linearGradient id="navShieldLeft" x1="6" y1="3" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#38bdf8"/>
                      <stop offset="100%" stopColor="#1e40af"/>
                    </linearGradient>
                    <linearGradient id="navShieldRight" x1="16" y1="3" x2="26" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#60a5fa"/>
                      <stop offset="100%" stopColor="#1d4ed8"/>
                    </linearGradient>
                  </defs>
                  {/* Dual Facet 3D Cybersecurity Shield */}
                  <path d="M16 3 L6 7.5 C6 16 10.5 23.5 16 28.5 C21.5 23.5 26 16 26 7.5 Z" fill="url(#navShieldLeft)" stroke="#38bdf8" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M16 3 L26 7.5 C26 16 21.5 23.5 16 28.5 Z" fill="url(#navShieldRight)" stroke="#38bdf8" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              </div>

              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-[15px] font-sans font-bold tracking-tight block truncate ${isLight ? 'text-zinc-900 drop-shadow-[0_1px_6px_rgba(0,0,0,0.12)]' : 'text-white drop-shadow-[0_1px_8px_rgba(255,255,255,0.2)]'}`}>
                      {PERSONAL_INFO.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-500 font-semibold tracking-tight truncate leading-tight mt-0.5">
                    Cybersecurity & IAM • Data & AI
                  </span>
                </div>
              )}
            </a>
          </div>

          {/* Horizontal Divider Line with Adjoining Collapse Icon */}
          <div className="relative mt-6 w-full flex items-center">
            {/* The horizontal divider line spanning across the pane */}
            <div className={`h-px flex-1 ${isLight ? 'bg-gradient-to-r from-transparent via-zinc-200 to-zinc-300' : 'bg-gradient-to-r from-transparent via-white/10 to-white/20'}`} />

            {/* Line segment reaching the outer border */}
            <div 
              className={`h-px ${isLight ? 'bg-zinc-300' : 'bg-white/20'}`}
              style={{
                width: isSidebarCollapsed ? '12px' : '28px',
                marginRight: isSidebarCollapsed ? '-12px' : '-28px'
              }}
            />

            {/* Collapsing Icon Adjoining Directly to the Horizontal Line */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                title={isSidebarCollapsed ? "Expand navigation pane (Ctrl+B)" : "Collapse navigation pane (Ctrl+B)"}
                aria-label={isSidebarCollapsed ? "Expand navigation pane" : "Collapse navigation pane"}
                style={{
                  right: isSidebarCollapsed ? '-26px' : '-42px',
                }}
                className={`absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-7 h-7 rounded-full border shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-700 hover:text-blue-600 shadow-zinc-300/80 hover:border-blue-400'
                    : 'bg-[#121217] border-white/25 text-zinc-200 hover:text-white shadow-black/90 hover:border-blue-500/60'
                }`}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Center: Navigation Links & Social Icons vertically aligned to top */}
        <div className="flex-1 flex flex-col justify-start pt-6 pb-2 min-h-0 w-full overflow-y-auto no-scrollbar">
          <nav className={`space-y-1.5 w-full ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`} aria-label="Main Navigation">
            {!isSidebarCollapsed && (
              <div className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 pl-4 pr-2.5 mb-2 flex items-center justify-between" aria-hidden="true">
                <span>Navigation</span>
              </div>
            )}
            <div className={`space-y-1 ${isSidebarCollapsed ? 'flex flex-col items-center w-full' : 'w-full'}`} role="menu">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    role="menuitem"
                    onClick={(e) => handleLinkClick(e, link.id)}
                    title={isSidebarCollapsed ? link.name : undefined}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const next = document.querySelectorAll('[data-nav-link]')[index + 1] as HTMLElement;
                        if (next) next.focus();
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prev = document.querySelectorAll('[data-nav-link]')[index - 1] as HTMLElement;
                        if (prev) prev.focus();
                      }
                    }}
                    data-nav-link
                    className={`flex items-center rounded-xl text-xs sm:text-[12.5px] font-medium transition-all duration-150 group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                      isSidebarCollapsed ? 'justify-center p-2 w-10' : 'justify-between pl-3 pr-2.5 py-1.5 w-[80%] text-left'
                    } ${
                      isActive
                        ? isLight
                          ? 'bg-blue-50/90 text-blue-600 font-semibold shadow-xs'
                          : 'bg-white/10 text-white font-semibold shadow-xs'
                        : isLight
                          ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/90 focus-visible:bg-zinc-100/90'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] focus-visible:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`shrink-0 transition-colors ${isActive ? 'text-blue-500' : isLight ? 'text-zinc-400 group-hover:text-zinc-700' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                        {link.icon}
                      </span>
                      {!isSidebarCollapsed && (
                        <span className="whitespace-nowrap tracking-tight truncate">{link.name}</span>
                      )}
                    </div>
                    {!isSidebarCollapsed ? (
                      isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0 ml-1" aria-hidden="true" />
                      )
                    ) : (
                      <div className={`rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'w-2 h-2 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' 
                          : isLight ? 'w-1.5 h-1.5 bg-zinc-300 group-hover:bg-zinc-500' : 'w-1.5 h-1.5 bg-zinc-600 group-hover:bg-zinc-400'
                      }`} aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Social Links placed just below nav links */}
          <div className="mt-8 shrink-0 w-full">
            <div className={`flex flex-col space-y-1 w-full ${isSidebarCollapsed ? 'items-center' : ''}`} aria-label="Connect & Contact">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center rounded-xl text-xs font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                  isSidebarCollapsed ? 'justify-center p-2 w-10' : 'space-x-2.5 py-1.5 pl-3.5 pr-2.5 w-[80%]'
                } ${
                  isLight ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/90 focus-visible:bg-zinc-100/90' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] focus-visible:bg-white/[0.06]'
                }`}
                title="GitHub Profile"
                aria-label="Visit GitHub Profile"
              >
                <Github className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">GitHub</span>}
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center rounded-xl text-xs font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                  isSidebarCollapsed ? 'justify-center p-2 w-10' : 'space-x-2.5 py-1.5 pl-3.5 pr-2.5 w-[80%]'
                } ${
                  isLight ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/90 focus-visible:bg-zinc-100/90' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] focus-visible:bg-white/[0.06]'
                }`}
                title="LinkedIn Profile"
                aria-label="Visit LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">LinkedIn</span>}
              </a>
              <button
                onClick={onOpenContact}
                className={`flex items-center rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                  isSidebarCollapsed ? 'justify-center p-2 w-10' : 'space-x-2.5 py-1.5 pl-3.5 pr-2.5 w-[80%] text-left'
                } ${
                  isLight ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/90 focus-visible:bg-zinc-100/90' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] focus-visible:bg-white/[0.06]'
                }`}
                title="Get in Touch via Email"
                aria-label="Open contact form"
              >
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Get in Touch</span>}
              </button>
              <button
                onClick={onOpenSuperAdmin}
                className={`flex items-center rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                  isSidebarCollapsed ? 'justify-center p-2 w-10' : 'space-x-2.5 py-1.5 pl-3.5 pr-2.5 w-[80%] text-left'
                } ${
                  isLight ? 'text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200' : 'text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20'
                }`}
                title="Super Admin Console"
                aria-label="Open Super Admin Console"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" aria-hidden="true" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap font-bold">Admin Console</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright & Status */}
        <div className="mt-auto shrink-0 space-y-2 pt-2 w-full">
          {!isSidebarCollapsed && (
            <>
              <div className={`h-px w-full ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`} aria-hidden="true" />
              
              <div className="flex flex-col space-y-0.5 px-4 pb-1">
                <div className={`text-[10px] font-medium leading-normal ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  <span className="font-bold text-blue-500">{PERSONAL_INFO.name}</span> • © 2011 - 2026
                </div>
                <div className={`text-[9.5px] font-semibold flex items-center gap-1 leading-normal ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <Shield className="w-2.5 h-2.5" aria-hidden="true" />
                  <span className="truncate">Registered Security Architect™</span>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Desktop Top Right Floating Bar */}
      <div 
        className={`hidden md:flex fixed top-4 right-6 z-50 items-center gap-1.5 px-2 py-1 rounded-full border shadow-sm backdrop-blur-md transition-all ${
          isLight
            ? 'bg-[#f4f4f6]/95 border-zinc-300/90 text-zinc-800 shadow-xs'
            : 'bg-[#18181b]/95 border-zinc-700/80 text-zinc-200 shadow-md'
        }`}
        style={{ marginLeft: '0px', marginRight: '147px' }}
      >
        {/* Theme Options */}
        <button
          onClick={onOpenInterfaceOptions}
          className={`flex items-center space-x-1 transition-colors px-1.5 py-0.5 rounded-full ${
            isLight 
              ? 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/70' 
              : 'text-zinc-300 hover:text-white hover:bg-white/10'
          }`}
          title="Theme & Interface Options"
        >
          <Sliders className="w-3 h-3 text-blue-500" />
          <span className="text-[9.5px] font-bold tracking-tight">Themes</span>
        </button>
        <div className={`w-[1px] h-3 ${isLight ? 'bg-zinc-300' : 'bg-white/20'}`} />
        <MusicPlayer theme={theme} />
        <div className={`w-[1px] h-3 ${isLight ? 'bg-zinc-300' : 'bg-white/20'}`} />
        <UserTelemetry theme={theme} />
        <div className={`w-[1px] h-3 ${isLight ? 'bg-zinc-300' : 'bg-white/20'}`} />
        <button
          onClick={() => setGateModalOpen(true)}
          className={`flex items-center space-x-1 transition-colors px-2 py-0.5 rounded-full cursor-pointer ${
            user && isAuthorized
              ? (isLight ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30')
              : (isLight ? 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/70' : 'text-zinc-300 hover:text-white hover:bg-white/10')
          }`}
          title={user ? `Firebase Identity: ${user.email}` : "Firebase Authentication & Clearance"}
        >
          {user && isAuthorized ? (
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
          ) : (
            <Lock className="w-3 h-3 text-amber-500" />
          )}
          <span className="text-[9.5px] font-bold tracking-tight">
            {user ? (isAdmin ? 'Admin' : 'Verified') : 'Sign In'}
          </span>
        </button>
      </div>


      {/* Mobile Top Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 backdrop-blur-xl border-b transition-all ${
        isLight ? 'bg-white/90 border-zinc-200 text-zinc-900' : 'bg-[#000000]/90 border-white/10 text-white'
      }`}>
        <a 
          href="#overview" 
          onClick={(e) => handleLinkClick(e, 'overview')}
          className="flex items-center space-x-2.5 pl-2"
        >
          <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#0284c7] via-[#1d4ed8] to-[#0a1224] flex items-center justify-center text-white shadow-[0_0_16px_rgba(37,99,235,0.45)] ring-1 ring-cyan-400/40 border border-white/30 flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.4),transparent_65%)] pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-45 z-0">
              <Swords className="w-7 h-7 text-cyan-200" strokeWidth={1.8} />
            </div>
            <svg viewBox="0 0 32 32" className="w-[26.6px] h-[26.6px] relative z-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]" fill="none">
              <path d="M16 3 L6 7.5 C6 16 10.5 23.5 16 28.5 C21.5 23.5 26 16 26 7.5 Z" fill="#38bdf8" stroke="#38bdf8" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M16 3 L26 7.5 C26 16 21.5 23.5 16 28.5 Z" fill="#1d4ed8" stroke="#38bdf8" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`font-semibold text-xs sm:text-sm truncate ${isLight ? 'drop-shadow-[0_1px_5px_rgba(0,0,0,0.1)]' : 'drop-shadow-[0_1px_6px_rgba(255,255,255,0.2)]'}`}>{PERSONAL_INFO.name}</span>
            </div>
            <span className="text-[9px] text-blue-500 font-semibold tracking-tight truncate">Cybersecurity & IAM • Data & AI</span>
          </div>
        </a>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenInterfaceOptions}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight 
                ? 'bg-[#f4f4f6] border-zinc-300 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/70' 
                : 'bg-[#18181b] border-zinc-700 text-zinc-300 hover:text-white'
            }`}
            title="Themes"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
          </button>
          <div className={`p-0.5 rounded-lg border ${
            isLight ? 'bg-[#f4f4f6] border-zinc-300' : 'bg-[#18181b] border-zinc-700'
          }`}>
            <MusicPlayer theme={theme} isMobile={true} />
          </div>
          <UserTelemetry theme={theme} isMobile={true} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-full border ${isLight ? 'bg-[#f4f4f6] border-zinc-300 text-zinc-700 hover:bg-zinc-200/70' : 'bg-white/5 border-white/10 text-zinc-300'}`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 z-40 pt-16 px-6 backdrop-blur-2xl space-y-4 animate-in fade-in duration-200 ${
          isLight ? 'bg-white/95 text-zinc-900' : 'bg-[#0a0a0c]/95 text-white'
        }`}>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, link.id);
                }}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-[16px] font-medium w-[80%] ${
                  activeSection === link.id
                    ? (isLight ? 'bg-blue-50 text-blue-600 font-semibold' : 'bg-white/10 text-white font-semibold')
                    : (isLight ? 'hover:bg-zinc-100 text-zinc-800' : 'hover:bg-white/5 text-zinc-200')
                }`}
              >
                <span>{link.name}</span>
                {activeSection === link.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-zinc-200 dark:border-white/10 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
