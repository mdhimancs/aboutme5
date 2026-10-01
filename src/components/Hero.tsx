import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Github, Linkedin, Mail, Shield, Award, Cpu, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SectionBackgroundAura } from './SectionBackgroundAura';

interface HeroProps {
  onOpenContact: () => void;
  onExploreBlog: () => void;
  theme?: string;
}

type HighlightCategory = 'executive' | 'defense' | 'scale' | 'ai';

interface HighlightPreset {
  id: HighlightCategory;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  stats: Array<{ value: string; label: string; sublabel: string }>;
  footprints: string[];
}

const HIGHLIGHT_PRESETS: HighlightPreset[] = [
  {
    id: 'executive',
    label: 'Executive Leadership',
    tagline: '21+ years defense track record, board governance & 5M+ identities protected',
    icon: <Award className="w-3.5 h-3.5" />,
    stats: [
      { value: "21+ Yrs", label: "Executive Track Record", sublabel: "Defense & IAM Leadership" },
      { value: "5M+", label: "Identities Protected", sublabel: "Workforce, Cloud & Non-Human" },
      { value: "0 Findings", label: "Audit Deficiencies", sublabel: "SOX 404 & GRC (3+ Yrs)" },
      { value: "-98.4%", label: "Privileged Exposure", sublabel: "Zero Standing Privilege" },
      { value: "Fortune 100", label: "Global Enterprise Scale", sublabel: "Financial & Tech Tier-1" }
    ],
    footprints: [
      "Audit Committee Reporting & Zero Trust Quantification",
      "Multi-Million Dollar CapEx / OpEx Defense Stewardship",
      "Global SecOps (SOC), IAM & GRC Team Orchestration"
    ]
  },
  {
    id: 'defense',
    label: 'Zero Trust Defense',
    tagline: 'NIST 800-207 architecture, phishing-resistant MFA & Tier-0 active directory',
    icon: <Shield className="w-3.5 h-3.5" />,
    stats: [
      { value: "NIST 800-207", label: "Zero Trust Architecture", sublabel: "Micro-Segmented Fabric" },
      { value: "100%", label: "Phishing-Resistant MFA", sublabel: "FIDO2 & Hardware Keys" },
      { value: "45+", label: "Strategic Publications", sublabel: "Cyber & Tech Thought Leadership" },
      { value: "-70%", label: "Threat Exposure Window", sublabel: "Continuous Posture Check" },
      { value: "Tier-0", label: "Active Directory Enclaves", sublabel: "Forest & Kerberos Hardened" }
    ],
    footprints: [
      "Zero Standing Privilege (ZSP) & Just-In-Time (JIT) Workflows",
      "Cryptographic Key Management, Hardware HSM & Mutual TLS",
      "Micro-segmentation Across Low-Latency Trading Enclaves"
    ]
  },
  {
    id: 'scale',
    label: 'Scale & Capital',
    tagline: '$18.5M modernization budget, 14-year Goldman Sachs tenure & 30+ staff',
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    stats: [
      { value: "$18.5M", label: "Modernization Budget", sublabel: "3-Year Strategic CapEx/OpEx" },
      { value: "14 Yrs", label: "Goldman Sachs Tenure", sublabel: "4 Executive Promotions" },
      { value: "30+ Staff", label: "Global Engineering Team", sublabel: "SecOps, IAM, GRC & Cloud" },
      { value: "99.99%", label: "Core Enclave Uptime", sublabel: "Mission-Critical Resilience" },
      { value: "100%", label: "Clean Audit Track", sublabel: "SOX 404, SOC 2 & ISO 27001" }
    ],
    footprints: [
      "CISO / dyCISO Target Operating Model Strategy",
      "Architecture Review Board (ARB) Technology Governance",
      "Strategic RFP Leadership & Multi-Million Tool Consolidation"
    ]
  },
  {
    id: 'ai',
    label: 'AI Risk & Governance',
    tagline: 'Enterprise LLM guardrails, model isolation, shadow AI discovery & EU AI Act',
    icon: <Cpu className="w-3.5 h-3.5" />,
    stats: [
      { value: "GenAI Guardrails", label: "Enterprise LLM Defense", sublabel: "Prompt Injection & Data Shield" },
      { value: "Agentic Trust", label: "Autonomous AI Policy", sublabel: "Non-Human Identity Governance" },
      { value: "100% Visible", label: "Shadow AI Discovery", sublabel: "Inventory & Risk Scorecards" },
      { value: "Zero Data Leak", label: "Model Isolation", sublabel: "Secure Private RAG Enclaves" },
      { value: "EU AI Act", label: "Algorithmic Compliance", sublabel: "Governance & Ethics Frameworks" }
    ],
    footprints: [
      "Automated Non-Human Identity (NHI) Token & Key Governance",
      "Real-time LLM Output Redaction & Prompt Injection Mitigation",
      "Enterprise AI Model Risk Management (MRM) Attestation"
    ]
  }
];

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onExploreBlog, theme = 'apple-light' }) => {
  const isLight = theme === 'apple-light';
  const [activeHighlightId, setActiveHighlightId] = useState<HighlightCategory>('executive');

  const currentPreset = HIGHLIGHT_PRESETS.find(p => p.id === activeHighlightId) || HIGHLIGHT_PRESETS[0];

  return (
    <section 
      id="overview" 
      className={`relative min-h-screen lg:h-screen w-full flex flex-col justify-between pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      {/* Background Aura Effects */}
      <SectionBackgroundAura theme={theme} />

      {/* 1. Static Executive Header */}
      <div 
        className="relative flex items-center justify-start shrink-0 mb-4 sm:mb-5.5"
      >
        {/* Subtle luminous aura behind header */}
        <div 
          className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-20 sm:h-24 rounded-full blur-2xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-blue-400/20 via-sky-300/15 to-indigo-300/15 opacity-80' 
              : 'bg-gradient-to-r from-blue-500/25 via-cyan-400/15 to-indigo-500/20 opacity-90'
          }`} 
        />

        {/* Strategic Overview Pill */}
        <div 
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold uppercase tracking-wider border backdrop-blur-md ${
            isLight ? 'bg-blue-50/90 border-blue-200 text-blue-700 shadow-sm' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
          }`}
          style={{ fontSize: '11px', height: '22.8171px' }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-500" />
          <span>Strategic Executive Overview</span>
        </div>
      </div>

      {/* 2. Main Centered Content */}
      <div className="relative w-full mx-auto text-center space-y-1 sm:space-y-1.5 px-2 sm:px-4 my-auto shrink-0 py-2 sm:py-3">

        {/* Aura behind main headline */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-28 sm:h-36 rounded-full blur-3xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-blue-400/25 via-sky-300/20 to-indigo-300/20 opacity-80' 
              : 'bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-indigo-500/25 opacity-90'
          }`} 
        />

        {/* Main Headline */}
        <div className="relative space-y-[7px] max-w-5xl mx-auto -translate-y-[4%]">
          <h1 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.14] transition-all ${
              isLight 
                ? 'text-zinc-900 drop-shadow-[0_2px_18px_rgba(59,130,246,0.22)]' 
                : 'text-white drop-shadow-[0_0_28px_rgba(96,165,250,0.40)]'
            }`}
          >
            <span className="block"><span className={`text-transparent bg-clip-text ${isLight ? 'bg-gradient-to-r from-blue-700 via-cyan-700 to-indigo-800' : 'bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300'}`}>Enterprise Cyber Defense</span>, <span className={`text-transparent bg-clip-text font-extrabold ${isLight ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-zinc-950 drop-shadow-[0_1px_2px_rgba(59,130,246,0.3)]' : 'bg-gradient-to-r from-sky-300 via-blue-200 to-white drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]'}`}>Zero Trust IAM</span></span>
            <span className="block mt-[2.8px] sm:mt-[4px]">& AI Risk Resilience.</span>
          </h1>
          <p 
            style={{ paddingBottom: '49px' }}
            className={`w-full max-w-4xl mx-auto text-[11px] font-medium leading-relaxed px-1 sm:px-2 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}
          >
            {PERSONAL_INFO.tagline}
          </p>
        </div>

        {/* Executive Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 pt-0.5">
          <a
            href="#projects"
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 sm:px-6 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] ${
              isLight ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' : 'bg-white text-black hover:bg-zinc-200 shadow-white/10'
            }`}
          >
            <span>Strategic Case Studies</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-white/80' : 'text-zinc-600'}`} />
          </a>

          <a
            href="#career"
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 sm:px-6 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md transition-all ${
              isLight ? 'bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-sm' : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 hover:border-white/25'
            }`}
          >
            <span>21 Years- Leadership</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>

        {/* Intuitive Executive Lens Perspective Command Bar */}
        <div className="pt-2 sm:pt-2.5 flex flex-col items-center justify-center w-full">
          {/* Context Header Label */}
          <div className="flex items-center justify-center gap-2 mb-1.5 select-none flex-wrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            </span>
            <span className={`text-[10px] font-mono tracking-widest uppercase font-bold ${
              isLight ? 'text-zinc-800' : 'text-blue-400'
            }`}>
              EXECUTIVE LENS
            </span>
            <span className="text-[10px] opacity-35 font-mono">•</span>
            <span className={`text-[10.5px] font-medium ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Filter metrics by architectural focus:
            </span>
          </div>

          {/* Segmented Control Bar with Clear Affordances */}
          <div 
            role="tablist"
            aria-label="Executive perspective lenses"
            className={`relative inline-flex flex-wrap items-center justify-center p-1 rounded-2xl sm:rounded-full border backdrop-blur-2xl transition-all shadow-md ${
              isLight 
                ? 'bg-zinc-100/95 border-zinc-200/90 shadow-zinc-200/60' 
                : 'bg-zinc-950/90 border-white/15 shadow-[0_6px_28px_rgba(0,0,0,0.65)] ring-1 ring-white/5'
            }`}
          >
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
              {HIGHLIGHT_PRESETS.map((preset) => {
                const isSelected = activeHighlightId === preset.id;
                return (
                  <button
                    key={preset.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveHighlightId(preset.id)}
                    className={`relative inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isSelected
                        ? isLight
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/35 ring-1 ring-blue-500'
                          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] border border-cyan-400/40 ring-1 ring-cyan-400/30'
                        : isLight
                          ? 'text-zinc-700 hover:text-zinc-950 hover:bg-white/80'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                    title={`Switch view to ${preset.label} perspective`}
                  >
                    <span className={isSelected ? 'text-white' : (isLight ? 'text-blue-600' : 'text-blue-400')}>
                      {preset.icon}
                    </span>
                    <span>{preset.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.9)] animate-pulse hidden sm:inline-block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Active Lens Feedback Subtitle (Instant Clarity Callout) */}
          <div className="mt-1 h-5 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPreset.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className={`inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium transition-colors ${
                  isLight ? 'text-zinc-600' : 'text-zinc-400'
                }`}
              >
                <span className={`font-semibold ${isLight ? 'text-blue-600' : 'text-cyan-300'}`}>
                  Showing {currentPreset.label}:
                </span>
                <span className="truncate max-w-[280px] sm:max-w-none">{currentPreset.tagline}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Highlight Stats Grid */}
        <div 
          style={{ paddingBottom: '3pt' }}
          className="relative pt-1.5 sm:pt-2 w-full max-w-5xl mx-auto px-1 sm:px-2"
        >
          {/* Luminous Glow Aura directly behind the stats boxes */}
          <div 
            className={`absolute -inset-2 rounded-3xl blur-xl sm:blur-2xl pointer-events-none transition-all duration-700 ${
              isLight 
                ? 'bg-gradient-to-r from-blue-400/10 via-cyan-300/8 to-indigo-400/10 opacity-25' 
                : 'bg-gradient-to-r from-blue-600/12 via-indigo-500/10 to-cyan-500/12 opacity-30'
            }`} 
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeHighlightId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 w-full"
            >
              {currentPreset.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`relative z-10 px-3 py-2.5 sm:py-3 rounded-2xl backdrop-blur-md transition-all duration-300 group border flex flex-col justify-center items-center text-center shadow-lg ${
                    isLight 
                      ? 'bg-white/95 border-blue-200/90 hover:border-blue-500/80 shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.03] hover:-translate-y-0.5' 
                      : 'bg-zinc-950/80 border-white/15 hover:border-cyan-400/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] hover:scale-[1.03] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Individual Box Inner Hover Glow */}
                  <div className={`absolute -inset-0.5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    isLight ? 'bg-gradient-to-tr from-blue-400/25 via-indigo-300/20 to-sky-400/25' : 'bg-gradient-to-tr from-blue-500/35 via-cyan-400/25 to-indigo-500/35'
                  }`} />

                  <div className={`relative z-10 text-sm sm:text-base lg:text-lg font-extrabold tracking-tight transition-colors truncate w-full ${isLight ? 'text-zinc-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'}`}>
                    {stat.value}
                  </div>
                  <div className={`relative z-10 text-[10px] sm:text-[10.5px] font-semibold mt-0.5 leading-snug line-clamp-1 ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    {stat.label}
                  </div>
                  <div className={`relative z-10 text-[9px] font-medium leading-tight opacity-75 mt-0.5 line-clamp-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {stat.sublabel}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{ height: '3pt', width: '100%' }} />

        {/* Dynamic Executive Footprint Line */}
        <div className="pt-1 min-h-[24px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHighlightId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-1 text-[10.5px] sm:text-[11px] font-medium text-zinc-500"
            >
              {currentPreset.footprints.map((footprint, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">•</span>}
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{footprint}</span>
                  </span>
                </React.Fragment>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Static Executive Footer */}
      <div className={`pt-2 mt-1.5 border-t shrink-0 ${isLight ? 'border-zinc-200 text-zinc-600' : 'border-white/10 text-zinc-400'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs py-0.5">
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4">
            <span className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-white'}`}>{PERSONAL_INFO.name}</span>
            <span className="text-[10px] font-bold opacity-40">Executive Portfolio Vault</span>
            
            {/* Light Grey Separator */}
            <div className={`h-3 w-px ${isLight ? 'bg-zinc-300' : 'bg-white/20'}`} />

            {/* Social & Contact Icons */}
            <div className="flex items-center gap-x-4 sm:gap-x-5 pl-1">
              <a 
                href={PERSONAL_INFO.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`hover:text-blue-500 transition-colors p-0.5 ${isLight ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
                title="GitHub Profile"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a 
                href={PERSONAL_INFO.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`hover:text-blue-500 transition-colors p-0.5 ${isLight ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-500" />
              </a>
              <button 
                onClick={onOpenContact} 
                className={`hover:text-blue-500 transition-colors p-0.5 ${isLight ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
                title="Get in Touch via Email"
              >
                <Mail className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

