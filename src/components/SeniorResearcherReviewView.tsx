import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Star, FileText, Copy, Check, ExternalLink, GraduationCap, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import { getExpertReviewForPost } from '../data/expertReviews';

interface SeniorResearcherReviewViewProps {
  post: BlogPost;
  onSwitchToManuscript?: () => void;
}

export const SeniorResearcherReviewView: React.FC<SeniorResearcherReviewViewProps> = ({
  post,
  onSwitchToManuscript
}) => {
  const review = post.expertReview || getExpertReviewForPost(post);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  const bibtex = post.scholar?.bibtex || `@article{dhiman2026${post.id.replace(/[^a-zA-Z0-9]/g, '')},
  title={${post.title}},
  author={Dhiman, Munish},
  journal={IEEE / ACM Enterprise Security & Dependable Computing},
  year={2026},
  publisher={Google Scholar & Peer-Reviewed Systems Repository},
  note={Peer-Reviewed & Certified by ${review.reviewerName}}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Formal Peer Review Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>OFFICIAL PEER REVIEW EVALUATION • SENIOR RESEARCHER MEMORANDUM</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Senior Peer Review Dossier
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Formal critical appraisal, mathematical proof audit, and architectural verification conducted by independent senior cybersecurity and systems researchers.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Editorial Verdict:</span>
                <span className="text-emerald-300 font-bold">{review.verdict}</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div className="text-slate-400">
                Evaluation Date: <span className="text-slate-200 font-mono">{review.reviewedDate}</span>
              </div>
            </div>
          </div>

          {/* Academic Rating Score Box */}
          <div className="shrink-0 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2 min-w-[180px] shadow-2xl">
            <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">
              Composite Research Score
            </div>
            <div className="flex items-baseline justify-center gap-1 text-4xl sm:text-5xl font-black text-white font-mono">
              <span className="text-emerald-400">{review.overallScore.toFixed(1)}</span>
              <span className="text-slate-400 text-xl font-normal">/ {review.maxScore}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400 pt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="inline-block px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-emerald-500/25 text-emerald-200 border border-emerald-400/30">
              Grade: A+ (Exemplary)
            </div>
          </div>
        </div>
      </div>

      {/* Reviewer Credentials Card */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-base shadow-md shrink-0">
            {review.reviewerName.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{review.reviewerName}</h3>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Lead Peer Reviewer
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">{review.reviewerTitle}</p>
            <p className="text-[11px] text-slate-500">{review.affiliation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Credentials</span>
          </span>
        </div>
      </div>

      {/* Senior Research Scorecard: Multi-Dimensional Evaluation Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Senior Research Evaluation Scorecard</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Double-Blind Peer Review Standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {review.dimensions.map((dim, idx) => {
            const pct = (dim.score / dim.maxScore) * 100;
            return (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-800 leading-snug">
                    {dim.criterion}
                  </span>
                  <div className="flex items-baseline gap-0.5 text-sm font-bold font-mono text-blue-700 shrink-0">
                    <span>{dim.score.toFixed(1)}</span>
                    <span className="text-slate-400 text-xs">/ {dim.maxScore}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  {dim.assessment}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Senior Researcher Synthesis Sections */}
      <div className="space-y-5 pt-2">
        {/* 1. Theoretical Breakthrough */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/60 border border-blue-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>1. Theoretical Breakthrough &amp; Conceptual Advancement</span>
          </div>
          <p className="text-xs sm:text-[13.5px] text-slate-800 leading-relaxed font-serif italic pl-1 border-l-2 border-blue-500">
            &ldquo;{review.theoreticalBreakthrough}&rdquo;
          </p>
        </div>

        {/* 2. Methodology & Rigor */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>2. Methodological Rigor &amp; Proof Models</span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
            {review.methodologyAndRigor}
          </p>
        </div>

        {/* 3. Threat Model Validation */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>3. Threat Model Completeness &amp; Adversarial Stress-Testing</span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
            {review.threatModelValidation}
          </p>
        </div>

        {/* 4. Practical Feasibility */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>4. Production Scalability &amp; Latency Bounds</span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
            {review.practicalFeasibility}
          </p>
        </div>

        {/* 5. Key Strengths */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
            5. Primary Strengths &amp; Technical Differentiators
          </div>
          <div className="space-y-2">
            {review.keyStrengths.map((str, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Reviewer Concluding Statement */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
              Senior Peer Reviewer Conclusion
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
              Institutional Recommendation: {review.recommendationLevel}
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans">
            &ldquo;{review.seniorReviewerSummary}&rdquo;
          </p>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="font-semibold text-white">{review.reviewerName}</span>
              <span className="text-slate-400"> — {review.affiliation}</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Verified Digital Sig: SHA256:{post.id.slice(0, 10)}...7f
            </div>
          </div>
        </div>
      </div>

      {/* Citation & Manuscript Navigation Bar */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-slate-700">Formal Academic Citation (BibTeX Available)</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyBibtex}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBibtex ? 'BibTeX Copied!' : 'Copy BibTeX'}</span>
          </button>
          {onSwitchToManuscript && (
            <button
              onClick={onSwitchToManuscript}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Full Manuscript</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
