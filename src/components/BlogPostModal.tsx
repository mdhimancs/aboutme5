import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Clock, Eye, Heart, Share2, Terminal, Check, Printer, Lock, KeyRound, ShieldCheck, CheckCircle2, Info, Sparkles, BookOpen, Layers, Cpu, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '../types';
import { useAuth } from '../context/AuthContext';
import { incrementStars } from '../lib/stars';

interface BlogPostModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, onClose }) => {
  const [likes, setLikes] = useState(post ? post.likes : 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { canAccessItem, setGateModalOpen, setTargetResource, user, isAuthorized, isAdmin } = useAuth();

  useEffect(() => {
    if (post) {
      incrementStars(`blog-${post.id}`);
    }
    // Reset scroll progress on post change
    setScrollProgress(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [post?.id]);

  if (!post) return null;

  const access = canAccessItem(post.id, 'publications');
  const isAllowed = access.allowed;

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

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const progressPercent = Math.round(scrollProgress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-zinc-900">
        {/* Top Slim Reading Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-zinc-200 z-30 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-100 ease-out" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-2 text-xs font-medium text-blue-700">
            <span className="px-2.5 py-0.5 bg-blue-50 rounded-full border border-blue-200 text-[11px] font-bold">
              {post.category}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-600 text-[11px] font-mono">{post.readTime}</span>
            <span className="text-zinc-400">•</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
              {progressPercent}% read
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 sm:p-2 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
              title="Print Whitepaper / Executive Brief"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-5 sm:p-10 overflow-y-auto space-y-7 bg-white"
        >
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 font-normal">
              {post.excerpt}
            </p>

            {/* Author and Date Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-md border border-white/30 shrink-0">
                  MD
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{post.author.name}</div>
                  <div className="text-xs text-zinc-500">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-zinc-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            {/* Executive Key Takeaway Callout Box */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm space-y-1">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-blue-700 text-[11px]">
                <span>Executive Committee Key Takeaway</span>
              </div>
              <p className="leading-relaxed text-zinc-800">
                {post.id === 'bp-2026-fair-model' && "Empowers the CFO and Board Audit Committee to replace subjective red/amber/green heatmaps with actuarial loss probability distributions, optimizing cyber insurance premiums and capital reserve allocations."}
                {post.id === 'bp-2025-sec-disclosure' && "Establishes a 96-hour cross-functional materiality determination runbook connecting the CISO, General Counsel, and Investor Relations to prevent regulatory enforcement penalties."}
                {post.id === 'bp-2025-genai-sec' && "Provides governance for secure LLM enterprise integration, preventing prompt exfiltration and token leakage via real-time reverse proxy inspection."}
                {post.id === 'bp-2025-nhi-identities' && "Mitigates credential sprawl across multi-cloud service accounts by enforcing ephemeral workloads and Identity Federation cryptographic attestation."}
                {post.id !== 'bp-2026-fair-model' && post.id !== 'bp-2025-sec-disclosure' && post.id !== 'bp-2025-genai-sec' && post.id !== 'bp-2025-nhi-identities' && "Provides rigorous architectural patterns and governance frameworks for enterprise security transformation."}
              </p>
            </div>
          </div>

          {/* Markdown Content or Zero-Trust Protected Banner */}
          {isAllowed ? (
            <div className="prose max-w-none text-zinc-700 text-sm sm:text-base leading-relaxed space-y-6 pt-4 border-t border-zinc-200">
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
                      <table className="w-full text-left border-collapse border border-zinc-200 rounded-xl overflow-hidden bg-white" {...props} />
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
                {post.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="my-8 p-6 sm:p-8 rounded-3xl border border-amber-300 bg-amber-50 text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                  Publication Content Locked
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
                  {access.reason === 'item_forbidden' ? (
                    <>Your current clearance does not include this specific publication. Single-article access can be provisioned by an administrator.</>
                  ) : (
                    <>This whitepaper is locked behind Firebase Authentication. Please verify your credentials or request clearance to access full implementation patterns.</>
                  )}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTargetResource({ id: post.id, section: 'publications', title: post.title });
                    setGateModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate with Firebase</span>
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-200">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-medium bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full text-zinc-700">
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer Actions (Like & Share) */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                hasLiked
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likes} Likes</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 rounded-full text-xs font-medium transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
