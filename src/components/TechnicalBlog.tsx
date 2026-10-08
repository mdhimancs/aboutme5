import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Scale, Sparkles, Lock, Unlock, ArrowUpRight, FileText, KeyRound } from 'lucide-react';
import { BLOG_POSTS } from '../data/portfolioData';
import { BlogPost } from '../types';
import { BlogPostModal } from './BlogPostModal';
import { useHoverScroll } from '../lib/utils';
import { trackAssetInteraction } from '../lib/analytics';
import { useAuth } from '../context/AuthContext';
import { StarsCounter } from './StarsCounter';
import { SectionBackgroundAura } from './SectionBackgroundAura';

interface TechnicalBlogProps {
  theme?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Publications' },
  { id: 'Industry Trends', label: 'Industry Trends' },
  { id: 'PQC & Cryptography', label: 'PQC & Cryptography' },
  { id: 'Executive Risk & GRC', label: 'Executive Risk & GRC' },
  { id: 'engineering', label: 'Architects & Engineering' },
  { id: 'AI Security Governance', label: 'AI Security Governance' },
  { id: 'IAM & Zero Trust', label: 'IAM & Zero Trust' },
  { id: 'Cybersecurity', label: 'Cybersecurity' },
  { id: 'Cloud', label: 'Cloud Architecture' },
  { id: 'Data Science', label: 'Data Science' },
];

export const TechnicalBlog: React.FC<TechnicalBlogProps> = ({ theme = 'apple-light' }) => {
  const isLight = theme === 'apple-light';
  const { 
    gateItem, 
    user, 
    isAdmin, 
    isAuthorized, 
    currentUserEntry,
    isItemLocked, 
    isSectionLocked, 
    toggleSectionLock, 
    toggleItemLock,
    setGateModalOpen
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const { scrollRef, onMouseMove, onMouseLeave } = useHoverScroll();

  const isSectionGated = isSectionLocked('publications');

  // Top CISO executive flagship whitepapers
  const executiveFlagshipPosts = BLOG_POSTS.filter(p => 
    p.id === 'bp-2026-fair-model' || 
    p.id === 'bp-2025-sec-disclosure' || 
    p.id === 'bp-2025-genai-sec' || 
    p.id === 'bp-2025-nhi-identities'
  );

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || 
                            post.category.toLowerCase() === selectedCategory.toLowerCase() ||
                            (selectedCategory === 'PQC & Cryptography' && (post.category === 'PQC & Cryptography' || post.tags.some(t => ['PQC', 'Quantum', 'Cryptography', 'NIST FIPS 203'].includes(t)))) ||
                            (selectedCategory === 'engineering' && (['IAM & Zero Trust', 'AI Security Governance', 'Cloud', 'PQC & Cryptography'].includes(post.category) || post.tags.some(t => ['Identity Federation', 'Tokenization', 'FIDO2', 'PQC'].includes(t)))) ||
                            (selectedCategory === 'Cloud' && (post.category.toLowerCase().includes('cloud') || post.category === 'Azure')) ||
                            (selectedCategory === 'IAM & Zero Trust' && (post.category === 'IAM' || post.category === 'IAM & Zero Trust'));

    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section 
      id="blog" 
      className={`relative overflow-hidden min-h-screen lg:h-screen w-full flex flex-col justify-between pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      {/* Background Aura Effects */}
      <SectionBackgroundAura theme={theme} auraLevel={3} />

      {/* Section Header */}
      <div className="relative w-full space-y-0.5 mb-2 sm:mb-2.5 shrink-0 text-left -mt-4">
        {/* Luminous aura behind heading */}
        <div 
          className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-24 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-blue-400/25 via-sky-300/20 to-indigo-300/20 opacity-80' 
              : 'bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-indigo-500/25 opacity-90'
          }`} 
        />

        <div 
          style={{ fontSize: '11px' }}
          className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold tracking-wider uppercase border backdrop-blur-md mb-1 ${
          isLight ? 'bg-blue-50/90 border-blue-200 text-blue-700 shadow-sm' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>Enterprise Cyber Strategy & Risk Governance · WHITEPAPERS & Playbooks</span>
        </div>
        <div className="relative flex flex-wrap items-center gap-3">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-all ${
            isLight 
              ? 'text-zinc-900 drop-shadow-[0_2px_16px_rgba(59,130,246,0.22)]' 
              : 'text-white drop-shadow-[0_0_24px_rgba(96,165,250,0.40)]'
          }`}>
            Publications - Solution Design & Architecture
          </h2>
          <div className="inline-flex items-center gap-2">
            <span 
              onClick={isSectionGated ? () => setGateModalOpen(true) : undefined}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                isSectionGated ? 'cursor-pointer hover:opacity-85' : ''
              } ${
              isSectionGated 
                ? (isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')
                : (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')
            }`}>
              {isSectionGated ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{isSectionGated ? 'Request Access' : 'Public Access'}</span>
            </span>
            {isAdmin && (
              <button
                type="button"
                onClick={() => toggleSectionLock('publications')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                  isLight 
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' 
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                }`}
                title="Toggle publications section lock"
              >
                <span>{isSectionGated ? 'Unlock Section' : 'Lock Section'}</span>
              </button>
            )}
          </div>
        </div>
        <p 
          style={{ fontSize: '11px' }}
          className={`relative max-w-4xl text-[11px] font-normal leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}
        >
          Playbooks on Cyber Risk, Identity Architecture, AI Security and Regulatory Disclosure.
        </p>
        <div style={{ height: '2pt', width: '100%' }} />
      </div>

      {/* 2-Column Publications Layout: Left Featured Executive Briefings (33%) | Right All Publications (67%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 flex-1 min-h-0 w-full overflow-hidden mt-1 sm:mt-2">
        
        {/* Left Column: Featured Executive Briefings (Reduced by 10% to col-span-4) */}
        <div className="lg:col-span-4 flex flex-col min-h-0 h-full">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-200/80 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                Featured Briefings
              </h3>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1.5 scrollbar-thin max-h-[calc(100vh-250px)]">
            {executiveFlagshipPosts.map((post) => {
              const locked = isItemLocked(post.id, 'publications');
              const hasSpecificClearance = currentUserEntry?.scope === 'specific' && currentUserEntry.allowedItems?.includes(post.id);

              return (
                <div
                  key={post.id}
                  onClick={() => {
                    gateItem(post.id, 'publications', post.title, () => {
                      setActivePost(post);
                      trackAssetInteraction(post.id, post.title, 'Whitepaper');
                    });
                  }}
                  className={`group relative flex flex-col justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer interactive-card ${
                    isLight
                      ? 'bg-white border-zinc-200/80 hover:border-blue-500 hover:shadow-lg shadow-sm'
                      : 'bg-zinc-950/60 border-white/10 hover:border-blue-400/50 hover:bg-zinc-900/60 shadow-lg'
                  }`}
                >
                  <div className="space-y-1.5 font-sans">
                    <div className="flex items-center justify-between text-[10px] font-semibold flex-wrap gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full border font-medium ${
                          isLight 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'bg-blue-950/50 border-blue-800/60 text-blue-300'
                        }`}>
                          {post.category}
                        </span>
                        {hasSpecificClearance && (
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[8px] font-bold border uppercase tracking-wider ${
                            isLight 
                              ? 'bg-purple-50 border-purple-200 text-purple-700' 
                              : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                          }`}>
                            <KeyRound className="w-2.5 h-2.5 text-purple-400" />
                            <span>Clearance Granted</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(post.date).toLocaleDateString('default', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 className={`text-xs sm:text-[13px] font-bold leading-snug group-hover:text-blue-500 transition-colors line-clamp-2 ${
                      isLight ? 'text-zinc-900' : 'text-white'
                    }`}>
                      {post.title}
                    </h4>

                    <p className={`text-[10.5px] leading-relaxed line-clamp-2 ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-[11px]">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isLight ? 'bg-zinc-100 text-zinc-600' : 'bg-white/5 text-zinc-400'
                        }`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <StarsCounter pageId={`blog-${post.id}`} isLight={isLight} compact />
                      <div className="inline-flex items-center gap-1 font-semibold text-blue-500 group-hover:translate-x-0.5 transition-transform text-xs">
                        <span>Read</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: All Publications (Increased by 10% to col-span-8) */}
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-200/80 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                All Publications
              </h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border inline-flex items-center gap-1 shadow-2xs ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
              }`}>
                <FileText className="w-3 h-3 text-blue-500" />
                <span>{BLOG_POSTS.length} Articles</span>
              </span>
            </div>
          </div>

          {/* Controls Bar: Category Filter Pills */}
          <div style={{ width: '755.358px' }} className="shrink-0 mb-2">
            <div 
              ref={scrollRef}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none cursor-ew-resize select-none w-full"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-1.5 py-0.5 rounded-lg text-[8px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                      : isLight
                        ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border border-zinc-200/60'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {selectedCategory !== 'all' && (
              <div className="flex items-center justify-end pt-1 text-[10px] font-mono text-zinc-500">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Clear filter "{selectedCategory}" ✕
                </button>
              </div>
            )}
          </div>

          {/* Scrollable Timeline Publications with Word Wrap */}
          <div 
            style={{ width: '750.274px', paddingRight: '2px' }}
            className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin max-h-[calc(100vh-270px)] relative"
          >
            <div className="w-full space-y-4">
              {Array.from(new Set(filteredPosts.map(p => new Date(p.date).getFullYear()))).sort((a, b) => b - a).map(year => (
                <div key={year} className="relative pb-3">
                  {/* Sticky Year Header */}
                  <div className={`sticky top-0 z-20 flex items-center gap-2 py-1 mb-2 backdrop-blur-md ${
                    isLight ? 'bg-[#fcfcfd]/90' : 'bg-black/90'
                  }`}>
                    <div className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border shadow-xs whitespace-nowrap shrink-0 ${
                      isLight ? 'bg-white border-blue-200 text-blue-900' : 'bg-zinc-900 border-blue-800/80 text-blue-300'
                    }`}>
                      {year}
                    </div>
                    <div className={`h-[1px] flex-1 ${isLight ? 'bg-gradient-to-r from-blue-300/80 via-blue-200/30 to-transparent' : 'bg-gradient-to-r from-blue-500/40 via-blue-400/10 to-transparent'}`} />
                  </div>

                  {/* Vertical Timeline Line and Post Items with Word Wrap */}
                  <div className={`border-l-2 pl-3 sm:pl-4 space-y-2.5 ml-2 sm:ml-2.5 ${isLight ? 'border-sky-300/80' : 'border-blue-400/40'}`}>
                    {filteredPosts
                      .filter(p => new Date(p.date).getFullYear() === year)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(post => {
                      const dateObj = new Date(post.date);
                      const month = dateObj.toLocaleString('default', { month: 'short' });
                      const isExecutive = post.category === 'Executive Risk & GRC' || post.category === 'AI Security Governance';
                      const locked = isItemLocked(post.id, 'publications');
                      const hasSpecificClearance = currentUserEntry?.scope === 'specific' && currentUserEntry.allowedItems?.includes(post.id);

                      return (
                        <div 
                          key={post.id}
                          onClick={() => {
                            gateItem(post.id, 'publications', post.title, () => {
                              setActivePost(post);
                              trackAssetInteraction(post.id, post.title, 'Publication');
                            });
                          }}
                          className="relative flex items-start gap-2.5 cursor-pointer group"
                        >
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[18px] sm:-left-[22px] top-3 w-2 h-2 rounded-full border-2 transition-colors z-10 ${
                            isExecutive 
                              ? 'bg-blue-500 border-blue-300' 
                              : isLight ? 'bg-white border-zinc-300 group-hover:border-blue-500' : 'bg-black border-zinc-600 group-hover:border-blue-400'
                          }`} />
                          
                          <div className={`w-7 shrink-0 text-[10.5px] font-semibold font-mono pt-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {month}
                          </div>
                          
                          <div className={`flex-1 rounded-xl px-3.5 py-2.5 border transition-all ${
                            isExecutive
                              ? isLight
                                ? 'bg-blue-50/40 border-blue-200/80 hover:border-blue-400 hover:bg-white hover:shadow-md'
                                : 'bg-blue-950/10 border-blue-900/30 hover:border-blue-500/40 hover:bg-blue-950/20'
                              : isLight 
                                ? 'bg-zinc-50/70 border-zinc-200/60 hover:border-zinc-300 hover:bg-white hover:shadow-sm' 
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                          }`}>
                            {/* Header with Title and Category - Word Wrapped */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 mb-1.5 font-sans">
                              <div className="flex items-start gap-2 min-w-0 flex-1">
                                {hasSpecificClearance && (
                                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[8px] font-bold border uppercase tracking-wider shrink-0 mt-0.5 ${
                                    isLight 
                                      ? 'bg-purple-50 border-purple-200 text-purple-700' 
                                      : 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                                  }`}>
                                    <KeyRound className="w-2.5 h-2.5 text-purple-400" />
                                    <span>Clearance Granted</span>
                                  </span>
                                )}
                                <h4 className={`text-xs sm:text-[13.5px] font-bold transition-colors break-words whitespace-normal leading-snug flex-1 min-w-0 ${isLight ? 'text-zinc-900 group-hover:text-blue-600' : 'text-white group-hover:text-blue-400'}`}>
                                  {post.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 sm:ml-auto">
                                <span className={`text-[8.5px] uppercase tracking-wider font-bold shrink-0 px-2 py-0.5 rounded border ${
                                  isExecutive
                                    ? isLight ? 'bg-zinc-800 text-zinc-100 border-zinc-700' : 'bg-zinc-800/90 text-zinc-200 border-zinc-700'
                                    : isLight ? 'bg-zinc-100 text-zinc-700 border-zinc-200' : 'bg-white/10 text-zinc-300 border-white/10'
                                }`}>
                                  {post.category}
                                </span>
                              </div>
                            </div>
                            {/* Excerpt with natural word wrap */}
                            <div className={`text-[11px] sm:text-[11.5px] leading-relaxed break-words whitespace-normal line-clamp-2 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                              {post.excerpt}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16 text-zinc-400">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No publications found matching "{searchQuery}" under {selectedCategory}.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Reader */}
      <BlogPostModal post={activePost} onClose={() => setActivePost(null)} />
    </section>
  );
};

