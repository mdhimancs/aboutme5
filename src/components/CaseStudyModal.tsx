import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ShieldCheck, TrendingUp, CheckCircle, Award, Share2, Check, 
  ArrowRight, Layers, FileText, Sparkles, Zap, Cpu, GitMerge, Landmark, Lock, AlertTriangle,
  BookOpen, Info, CheckCircle2, Terminal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ExecutiveCaseStudy } from '../types';
import { incrementStars } from '../lib/stars';

interface CaseStudyModalProps {
  caseStudy: ExecutiveCaseStudy | null;
  onClose: () => void;
  theme?: string;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ caseStudy, onClose, theme = 'apple-light' }) => {
  const isLight = true; // Always light theme as requested
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'briefing' | 'star'>('briefing');
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (caseStudy) {
      incrementStars(`project-${caseStudy.id}`);
    }
    setScrollProgress(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [caseStudy?.id, activeTab]);

  if (!caseStudy) return null;

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const totalHeight = el.scrollHeight - el.clientHeight;
    if (totalHeight <= 0) {
      setScrollProgress(100);
      return;
    }
    const currentProgress = (el.scrollTop / totalHeight) * 100;
    setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Enterprise IAM & Zero Trust':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />,
          badgeClass: 'bg-blue-50 border-blue-200 text-blue-700',
          titleAccent: 'text-blue-700',
        };
      case 'AI Security & Governance':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-600" />,
          badgeClass: 'bg-purple-50 border-purple-200 text-purple-700',
          titleAccent: 'text-purple-700',
        };
      case 'Threat Defense & SOC':
        return {
          icon: <Zap className="w-3.5 h-3.5 text-amber-600" />,
          badgeClass: 'bg-amber-50 border-amber-200 text-amber-700',
          titleAccent: 'text-amber-700',
        };
      case 'Cloud & Identity Security':
        return {
          icon: <Cpu className="w-3.5 h-3.5 text-cyan-600" />,
          badgeClass: 'bg-cyan-50 border-cyan-200 text-cyan-700',
          titleAccent: 'text-cyan-700',
        };
      case 'M&A & Enterprise Modernization':
        return {
          icon: <GitMerge className="w-3.5 h-3.5 text-emerald-600" />,
          badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          titleAccent: 'text-emerald-700',
        };
      case 'Board Governance & Crisis Command':
        return {
          icon: <Landmark className="w-3.5 h-3.5 text-indigo-600" />,
          badgeClass: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          titleAccent: 'text-indigo-700',
        };
      default:
        return {
          icon: <Lock className="w-3.5 h-3.5 text-blue-600" />,
          badgeClass: 'bg-blue-50 border-blue-200 text-blue-700',
          titleAccent: 'text-blue-700',
        };
    }
  };

  const catTheme = getCategoryTheme(caseStudy.category);
  const progressPercent = Math.round(scrollProgress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-zinc-900">
        
        {/* Top Slim Reading Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-zinc-200 z-30 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-100 ease-out" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-2 text-xs font-medium text-blue-700">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${catTheme.badgeClass}`}>
              {catTheme.icon}
              <span>{caseStudy.category}</span>
            </span>
            <span className="text-zinc-400">•</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-emerald-50 border-emerald-200 text-emerald-700 font-bold">
              {caseStudy.status}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
              {progressPercent}% read
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 rounded-full transition-colors text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full transition-colors text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-5 sm:p-10 overflow-y-auto space-y-6 bg-white"
        >
          {/* Header & Scale Badge */}
          <div className="space-y-3">
            <div className={`text-[11px] font-mono font-bold tracking-wide uppercase flex items-center gap-1.5 ${catTheme.titleAccent}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Defense Briefing & Program Transformation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-zinc-900">
              {caseStudy.title}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-600 font-normal">
              {caseStudy.subtitle}
            </p>

            {/* Enterprise Scale Banner */}
            <div className="text-xs font-mono flex items-center gap-2.5 pt-1 text-zinc-700 bg-blue-50/70 p-3 rounded-xl border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span><strong>Operational Scale & Scope:</strong> {caseStudy.businessScale}</span>
            </div>
          </div>

          {caseStudy.imageUrl && (
            <div className="w-full h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
              <img src={caseStudy.imageUrl} alt={caseStudy.imageAlt || caseStudy.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}

          {/* Key Impact Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-4 bg-zinc-50 rounded-2xl border border-zinc-200">
            {caseStudy.impactMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-zinc-900">
                  {metric.label}
                </div>
                {metric.desc && (
                  <div className="text-[10.5px] leading-snug text-zinc-600">
                    {metric.desc}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tab Selector: Full Briefing vs Structured STAR Breakdown */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <button
              onClick={() => setActiveTab('briefing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'briefing'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Architectural Briefing</span>
            </button>
            <button
              onClick={() => setActiveTab('star')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'star'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Executive STAR Breakdown</span>
            </button>
          </div>

          {/* Tab 1: Full Briefing Markdown with Sentence-Level Graphics */}
          {activeTab === 'briefing' && caseStudy.fullBriefingMarkdown && (
            <div className="prose max-w-none text-zinc-700 text-sm sm:text-base leading-relaxed space-y-6 pt-2">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-8 mb-4 tracking-tight flex items-center gap-2.5 border-b pb-3 border-zinc-200" {...props}>
                      <span className="p-1.5 rounded-xl bg-blue-100 text-blue-700 shadow-sm"><BookOpen className="w-5 h-5" /></span>
                      <span>{props.children}</span>
                    </h1>
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-8 mb-3 tracking-tight flex items-center gap-2" {...props}>
                      <span className="text-indigo-600"><Layers className="w-5 h-5" /></span>
                      <span>{props.children}</span>
                    </h2>
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold text-zinc-900 mt-6 mb-2 flex items-center gap-2" {...props}>
                      <span className="text-emerald-600"><Sparkles className="w-4 h-4" /></span>
                      <span>{props.children}</span>
                    </h3>
                  ),
                  p: ({ node, ...props }) => <p className="mb-4 text-zinc-700 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="space-y-2 mb-4 pl-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="space-y-2 mb-4 pl-1 list-decimal list-inside text-zinc-700" {...props} />,
                  li: ({ node, ...props }) => (
                    <li className="flex items-start gap-2.5 text-zinc-700 my-1.5" {...props}>
                      <span className="mt-1 flex-shrink-0 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></span>
                      <span>{props.children}</span>
                    </li>
                  ),
                  strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="my-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50/95 to-indigo-50/70 border-l-4 border-blue-600 border-t border-r border-b border-blue-100 text-zinc-800 shadow-sm flex items-start gap-3">
                      <span className="text-blue-600 mt-0.5 flex-shrink-0"><Info className="w-5 h-5" /></span>
                      <div className="italic" {...props} />
                    </blockquote>
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full text-left border-collapse border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => <th className="bg-zinc-100 p-3 text-zinc-900 font-semibold border-b border-zinc-200" {...props} />,
                  td: ({ node, ...props }) => <td className="p-3 border-b border-zinc-100 text-zinc-700" {...props} />,
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <div className="my-6 rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-900 text-zinc-100 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700 text-xs text-zinc-300 font-mono">
                          <span>{match ? match[1].toUpperCase() : 'CODE'}</span>
                          <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code className="bg-zinc-100 border border-zinc-200 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {caseStudy.fullBriefingMarkdown}
              </ReactMarkdown>
            </div>
          )}

          {/* Tab 2: STAR Framework Breakdown */}
          {activeTab === 'star' && (
            <div className="space-y-4">
              {/* Situation / Challenge */}
              <div className="p-4 rounded-2xl border bg-red-50/60 border-red-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>1. Situation & Enterprise Risk Exposure</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-800">
                  {caseStudy.challenge}
                </p>
              </div>

              {/* Task & Executive Strategy */}
              <div className="p-4 rounded-2xl border bg-blue-50/60 border-blue-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>2. Task & Strategic Transformation Pillars</span>
                </div>
                <ul className="space-y-2">
                  {caseStudy.strategy.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800">
                      <span className="mt-0.5 shrink-0 text-blue-600"><CheckCircle2 className="w-4 h-4" /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action / Architecture Highlights */}
              <div className="p-4 rounded-2xl border bg-indigo-50/60 border-indigo-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>3. Action & Core Architecture Highlights</span>
                </div>
                <ul className="space-y-2">
                  {caseStudy.architectureHighlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800">
                      <span className="mt-0.5 shrink-0 text-indigo-600"><CheckCircle2 className="w-4 h-4" /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results & Business Outcomes */}
              <div className="p-4 rounded-2xl border bg-emerald-50/60 border-emerald-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>4. Measurable Business Outcome & Financial ROI</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mb-3 text-zinc-800">
                  {caseStudy.businessOutcome}
                </p>
                <div className="text-xs font-semibold p-3 rounded-xl border bg-emerald-100/60 border-emerald-300 text-emerald-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div><strong>Financial & Audit Impact:</strong> {caseStudy.financialAndAuditRoi}</div>
                </div>
              </div>
            </div>
          )}

          {/* Leadership Role Box */}
          <div className="p-4 rounded-2xl border flex items-start gap-3 bg-zinc-50 border-zinc-200 text-zinc-900 shadow-sm">
            <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Executive Leadership Role</div>
              <div className="text-xs sm:text-sm font-medium">{caseStudy.leadershipRole}</div>
            </div>
          </div>

          {/* Tags Footer */}
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-200">
            {caseStudy.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border bg-zinc-100 border-zinc-200 text-zinc-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
