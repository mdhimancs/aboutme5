import React, { useState } from 'react';
import { X, Type, Sparkles, Check, Search, ShieldCheck, Layers, BookOpen, Terminal, Code } from 'lucide-react';

interface ExecutiveFontsShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: string;
  onSelectFont: (fontFamily: string, fontName: string) => void;
}

export interface FontSpec {
  id: string;
  name: string;
  category: 'sans' | 'serif' | 'display' | 'humanist' | 'mono';
  googleFont: string;
  fontFamily: string;
  desc: string;
  tag: string;
}

export const TOP_56_EXECUTIVE_FONTS: FontSpec[] = [
  // Category 1: Modern Corporate & Geometric Sans
  { id: 'inter', name: 'Inter', category: 'sans', googleFont: 'Inter:wght@400;600;700', fontFamily: "'Inter', sans-serif", desc: 'Digital standard for executive web applications', tag: 'UI Standard' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', category: 'sans', googleFont: 'Plus+Jakarta+Sans:wght@400;600;700', fontFamily: "'Plus Jakarta Sans', sans-serif", desc: 'Sleek geometric sans designed for modern leadership', tag: 'C-Suite Tech' },
  { id: 'sf-pro', name: 'SF Pro Display', category: 'sans', googleFont: '', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif", desc: 'Minimalist, high-density precision', tag: 'Apple Aesthetic' },
  { id: 'helvetica', name: 'Helvetica Neue', category: 'sans', googleFont: '', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", desc: 'Timeless Swiss neutral aesthetic for global enterprises', tag: 'Swiss Classic' },
  { id: 'sohne', name: 'Söhne', category: 'sans', googleFont: 'Inter:wght@400;600;700', fontFamily: "'Söhne', 'Inter', sans-serif", desc: 'Modern editorial standard used by OpenAI & Stripe', tag: 'AI Vanguard' },
  { id: 'graphik', name: 'Graphik', category: 'sans', googleFont: 'Inter:wght@400;600;700', fontFamily: "'Graphik', 'Inter', sans-serif", desc: 'Sophisticated clean structure for strategy reports', tag: 'Consulting' },
  { id: 'ff-mark', name: 'FF Mark', category: 'sans', googleFont: 'Outfit:wght@400;600;700', fontFamily: "'FF Mark', 'Outfit', sans-serif", desc: 'Strong geometric weight for high-impact hero headings', tag: 'Hero Type' },
  { id: 'circular', name: 'Circular Std', category: 'sans', googleFont: 'Plus+Jakarta+Sans:wght@400;600;700', fontFamily: "'Circular', 'Plus Jakarta Sans', sans-serif", desc: 'Warm geometric corporate presence', tag: 'Brand Leadership' },
  { id: 'averta', name: 'Averta', category: 'sans', googleFont: 'Plus+Jakarta+Sans:wght@400;600;700', fontFamily: "'Averta', 'Plus Jakarta Sans', sans-serif", desc: 'Open geometric sans with multi-device legibility', tag: 'Clean Web' },
  { id: 'avenir', name: 'Avenir Next', category: 'sans', googleFont: '', fontFamily: "'Avenir Next', Avenir, 'Helvetica Neue', sans-serif", desc: 'Classic geometric elegance with human warmth', tag: 'Corporate Premium' },
  { id: 'gotham', name: 'Gotham Pro', category: 'sans', googleFont: 'Montserrat:wght@400;600;700', fontFamily: "'Gotham', 'Montserrat', sans-serif", desc: 'Authoritative branding used by Fortune 100 leaders', tag: 'Fortune 500' },
  { id: 'proxima', name: 'Proxima Nova', category: 'sans', googleFont: 'Public+Sans:wght@400;600;700', fontFamily: "'Proxima Nova', 'Public Sans', sans-serif", desc: 'Balancing geometric and humanist proportions', tag: 'Enterprise Web' },

  // Category 2: Editorial & Boardroom Serif
  { id: 'playfair', name: 'Playfair Display', category: 'serif', googleFont: 'Playfair+Display:ital,wght@0,400;0,600;0,700', fontFamily: "'Playfair Display', Georgia, serif", desc: 'High-contrast editorial serif for executive whitepapers', tag: 'Editorial Luxury' },
  { id: 'merriweather', name: 'Merriweather', category: 'serif', googleFont: 'Merriweather:wght@300;400;700', fontFamily: "'Merriweather', Georgia, serif", desc: 'Engineered specifically for long-form screen reading', tag: 'Long-Form Brief' },
  { id: 'lora', name: 'Lora', category: 'serif', googleFont: 'Lora:ital,wght@0,400;0,600;0,700', fontFamily: "'Lora', Georgia, serif", desc: 'Calligraphic serif for executive summaries', tag: 'Calligraphic' },
  { id: 'freight', name: 'Freight Display Pro', category: 'serif', googleFont: 'Playfair+Display:wght@400;600', fontFamily: "'Freight Display', 'Playfair Display', Georgia, serif", desc: 'Prestigious serif favored by tier-1 publications', tag: 'Tier-1 Press' },
  { id: 'cormorant', name: 'Cormorant Garamond', category: 'serif', googleFont: 'Cormorant+Garamond:wght@400;600;700', fontFamily: "'Cormorant Garamond', Georgia, serif", desc: 'Elegantly refined, high-contrast display serif', tag: 'Formal Board' },
  { id: 'eb-garamond', name: 'EB Garamond', category: 'serif', googleFont: 'EB+Garamond:wght@400;600;700', fontFamily: "'EB Garamond', Georgia, serif", desc: 'Classic Renaissance proportions for board proposals', tag: 'Boardroom' },
  { id: 'baskerville', name: 'Baskervville', category: 'serif', googleFont: 'Baskervville:ital@0;1', fontFamily: "'Baskervville', 'Baskerville', Georgia, serif", desc: 'Traditional serif projecting centuries of trust', tag: 'Heritage Trust' },
  { id: 'bodoni', name: 'Bodoni Moda', category: 'serif', googleFont: 'Bodoni+Moda:wght@400;600;700', fontFamily: "'Bodoni Moda', Georgia, serif", desc: 'Ultra-high-contrast fashion and luxury serif', tag: 'Luxury Tier' },
  { id: 'gt-super', name: 'GT Super', category: 'serif', googleFont: 'Playfair+Display:wght@400;600', fontFamily: "'GT Super', 'Playfair Display', Georgia, serif", desc: 'Editorial revival used by top design houses', tag: 'High Editorial' },
  { id: 'newsreader', name: 'Newsreader', category: 'serif', googleFont: 'Newsreader:ital,wght@0,400;0,600', fontFamily: "'Newsreader', Georgia, serif", desc: 'Optimized for digital reading of technical reports', tag: 'Whitepapers' },
  { id: 'pt-serif', name: 'PT Serif', category: 'serif', googleFont: 'PT+Serif:wght@400;700', fontFamily: "'PT Serif', Georgia, serif", desc: 'Sturdy corporate serif with high legibility', tag: 'Corporate Doc' },
  { id: 'source-serif', name: 'Source Serif 4', category: 'serif', googleFont: 'Source+Serif+4:wght@400;600;700', fontFamily: "'Source Serif 4', Georgia, serif", desc: 'Adobe flagship serif for enterprise documentation', tag: 'Enterprise Doc' },

  // Category 3: High-Impact Tech & Cyber Leadership
  { id: 'outfit', name: 'Outfit', category: 'display', googleFont: 'Outfit:wght@400;600;700;800', fontFamily: "'Outfit', sans-serif", desc: 'Distinctive geometric sans with high visual impact', tag: 'Cyber Modern' },
  { id: 'space-grotesk', name: 'Space Grotesk', category: 'display', googleFont: 'Space+Grotesk:wght@400;600;700', fontFamily: "'Space Grotesk', sans-serif", desc: 'Tech-forward display font for AI, Cyber & Future Tech', tag: 'AI & Defense' },
  { id: 'syne', name: 'Syne', category: 'display', googleFont: 'Syne:wght@400;700;800', fontFamily: "'Syne', sans-serif", desc: 'Architectural display font for hero banners', tag: 'Architectural' },
  { id: 'clash', name: 'Clash Display', category: 'display', googleFont: 'Space+Grotesk:wght@600;700', fontFamily: "'Clash Display', 'Space Grotesk', sans-serif", desc: 'High-contrast geometric display type', tag: 'High-Impact' },
  { id: 'cabinet', name: 'Cabinet Grotesk', category: 'display', googleFont: 'Outfit:wght@600;800', fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif", desc: 'Expressive, bold headline typography', tag: 'Bold Headline' },
  { id: 'satoshi', name: 'Satoshi', category: 'display', googleFont: 'Plus+Jakarta+Sans:wght@500;700', fontFamily: "'Satoshi', 'Plus Jakarta Sans', sans-serif", desc: 'Sleek sans-serif with subtle technological nuances', tag: 'Tech Frontier' },
  { id: 'manrope', name: 'Manrope', category: 'display', googleFont: 'Manrope:wght@400;600;700', fontFamily: "'Manrope', sans-serif", desc: 'Clean geometric sans with semi-rounded corners', tag: 'Executive Modern' },
  { id: 'dm-sans', name: 'DM Sans', category: 'display', googleFont: 'DM+Sans:wght@400;500;700', fontFamily: "'DM Sans', sans-serif", desc: 'Compact geometric sans ideal for dense dashboards', tag: 'Telemetry' },
  { id: 'general-sans', name: 'General Sans', category: 'display', googleFont: 'Inter:wght@500;700', fontFamily: "'General Sans', 'Inter', sans-serif", desc: 'Uncompromising neo-grotesque for web perimeters', tag: 'Neo-Grotesque' },
  { id: 'lexend', name: 'Lexend', category: 'display', googleFont: 'Lexend:wght@400;600;700', fontFamily: "'Lexend', sans-serif", desc: 'Engineered specifically to reduce reading cognitive load', tag: 'High Clarity' },
  { id: 'public-sans', name: 'Public Sans', category: 'display', googleFont: 'Public+Sans:wght@400;600;700', fontFamily: "'Public Sans', sans-serif", desc: 'US Federal Web Design System (USWDS) standard', tag: 'Federal Standard' },
  { id: 'urbanist', name: 'Urbanist', category: 'display', googleFont: 'Urbanist:wght@400;600;700', fontFamily: "'Urbanist', sans-serif", desc: 'Minimalist low-contrast geometric sans', tag: 'Minimal Luxury' },

  // Category 4: Humanist & Swiss Precision
  { id: 'gill-sans', name: 'Gill Sans', category: 'humanist', googleFont: '', fontFamily: "'Gill Sans', 'Gill Sans MT', sans-serif", desc: 'Quintessential British humanist sans for formal corporate ID', tag: 'British Classic' },
  { id: 'optima', name: 'Optima', category: 'humanist', googleFont: '', fontFamily: "Optima, 'Segoe UI', sans-serif", desc: 'Classy humanist sans with subtle flared terminals', tag: 'Refined Class' },
  { id: 'open-sans', name: 'Open Sans', category: 'humanist', googleFont: 'Open+Sans:wght@400;600;700', fontFamily: "'Open Sans', sans-serif", desc: 'Neutral, friendly, highly readable across viewports', tag: 'Universal Web' },
  { id: 'noto-sans', name: 'Noto Sans', category: 'humanist', googleFont: 'Noto+Sans:wght@400;600;700', fontFamily: "'Noto Sans', sans-serif", desc: 'Google universal multilingual font family', tag: 'Global Multi' },
  { id: 'fira-sans', name: 'Fira Sans', category: 'humanist', googleFont: 'Fira+Sans:wght@400;600;700', fontFamily: "'Fira Sans', sans-serif", desc: 'Engineered by Mozilla for high-density tech UI', tag: 'Mozilla Spec' },
  { id: 'pt-sans', name: 'PT Sans', category: 'humanist', googleFont: 'PT+Sans:wght@400;700', fontFamily: "'PT Sans', sans-serif", desc: 'Balanced European humanist sans', tag: 'European Standard' },
  { id: 'work-sans', name: 'Work Sans', category: 'humanist', googleFont: 'Work+Sans:wght@400;600;700', fontFamily: "'Work Sans', sans-serif", desc: 'Optimized for medium-sized text on web screens', tag: 'Web Ergonomics' },
  { id: 'source-sans', name: 'Source Sans 3', category: 'humanist', googleFont: 'Source+Sans+3:wght@400;600;700', fontFamily: "'Source Sans 3', sans-serif", desc: 'Adobe open source workhorse for enterprise apps', tag: 'Adobe Standard' },
  { id: 'lato', name: 'Lato', category: 'humanist', googleFont: 'Lato:wght@400;700', fontFamily: "'Lato', sans-serif", desc: 'Warm humanist sans with strong corporate structure', tag: 'Corporate Warmth' },
  { id: 'montserrat', name: 'Montserrat', category: 'humanist', googleFont: 'Montserrat:wght@400;600;700', fontFamily: "'Montserrat', sans-serif", desc: 'Urban geometric sans inspired by classic signage', tag: 'Urban Leader' },
  { id: 'roboto', name: 'Roboto', category: 'humanist', googleFont: 'Roboto:wght@400;500;700', fontFamily: "'Roboto', sans-serif", desc: 'Google high-performance responsive UI typeface', tag: 'Google UI' },
  { id: 'karla', name: 'Karla', category: 'humanist', googleFont: 'Karla:wght@400;700', fontFamily: "'Karla', sans-serif", desc: 'Grotesque sans-serif with distinctive character', tag: 'Distinctive' },

  // Category 5: Technical, Monospace & Data Defense
  { id: 'jetbrains-mono', name: 'JetBrains Mono', category: 'mono', googleFont: 'JetBrains+Mono:wght@400;600;700', fontFamily: "'JetBrains Mono', monospace", desc: 'Developer & cyber defense gold standard with code ligatures', tag: 'Cyber Gold Standard' },
  { id: 'fira-code', name: 'Fira Code', category: 'mono', googleFont: 'Fira+Code:wght@400;600;700', fontFamily: "'Fira Code', monospace", desc: 'Popular monospace with rich programming ligatures', tag: 'Code Ligatures' },
  { id: 'sf-mono', name: 'SF Mono', category: 'mono', googleFont: 'JetBrains+Mono:wght@400;600', fontFamily: "'SF Mono', Monaco, Menlo, 'JetBrains Mono', monospace", desc: 'Clean monospace used in macOS Terminal', tag: 'macOS Terminal' },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono', category: 'mono', googleFont: 'IBM+Plex+Mono:wght@400;600', fontFamily: "'IBM Plex Mono', monospace", desc: 'IBM enterprise monospace designed for data dashboards', tag: 'IBM Enterprise' },
  { id: 'space-mono', name: 'Space Mono', category: 'mono', googleFont: 'Space+Mono:wght@400;700', fontFamily: "'Space Mono', monospace", desc: 'Fixed-width monospace with futuristic editorial character', tag: 'Editorial Mono' },
  { id: 'inconsolata', name: 'Inconsolata', category: 'mono', googleFont: 'Inconsolata:wght@400;700', fontFamily: "'Inconsolata', monospace", desc: 'Clean humanist monospace for technical specifications', tag: 'Tech Specs' },
  { id: 'source-code-pro', name: 'Source Code Pro', category: 'mono', googleFont: 'Source+Code+Pro:wght@400;600', fontFamily: "'Source Code Pro', monospace", desc: 'Adobe high-clarity monospace for system architectures', tag: 'System Arch' },
  { id: 'roboto-mono', name: 'Roboto Mono', category: 'mono', googleFont: 'Roboto+Mono:wght@400;600', fontFamily: "'Roboto Mono', monospace", desc: 'Versatile monospace for telemetry logs and audit trails', tag: 'Telemetry Logs' }
];

export const ExecutiveFontsShowcaseModal: React.FC<ExecutiveFontsShowcaseModalProps> = ({
  isOpen,
  onClose,
  currentFont,
  onSelectFont
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'sans' | 'serif' | 'display' | 'humanist' | 'mono'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All 56 Fonts', icon: Type },
    { id: 'sans', label: '1. Modern Corporate Sans', icon: Layers },
    { id: 'serif', label: '2. Editorial & Boardroom Serif', icon: BookOpen },
    { id: 'display', label: '3. High-Impact Tech & Cyber', icon: Sparkles },
    { id: 'humanist', label: '4. Humanist & Swiss Precision', icon: ShieldCheck },
    { id: 'mono', label: '5. Cyber Defense Monospace', icon: Terminal }
  ];

  const filteredFonts = TOP_56_EXECUTIVE_FONTS.filter((f) => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-zinc-900">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-900 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md border border-white/20">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">Top 56 Executive Fonts Directory</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 font-mono text-[10px] font-bold uppercase tracking-wider">
                  C-Suite Typography
                </span>
              </div>
              <p className="text-xs text-zinc-400">Every font name rendered live in its specific typeface — click to test on portfolio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 56 fonts, categories, tags..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
              />
            </div>

            {/* Total Counter Badge */}
            <div className="text-xs font-mono text-zinc-600 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                Showing {filteredFonts.length} of 56 Fonts
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Font Grid Showcase */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 bg-white flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {filteredFonts.map((font) => {
              const isSelected = currentFont.toLowerCase() === font.name.toLowerCase() || currentFont.toLowerCase() === font.id.toLowerCase();
              return (
                <div
                  key={font.id}
                  onClick={() => onSelectFont(font.fontFamily, font.name)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-1 hover:border-blue-400 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/90 ring-1 ring-blue-500/50 shadow-2xs'
                      : 'border-zinc-200 bg-zinc-50/60 hover:bg-white shadow-2xs'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[8.5px] font-mono font-bold uppercase tracking-tight px-1 py-0.2 rounded border bg-white border-zinc-200 text-blue-700 truncate max-w-[85px]">
                        #{font.tag}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-0.5 text-[8.5px] font-bold text-blue-600 bg-blue-100 px-1 py-0.2 rounded-full shrink-0">
                          <Check className="w-2 h-2" /> Active
                        </span>
                      )}
                    </div>

                    {/* Font Name Rendered Directly in Its Specific Typeface! */}
                    <div 
                      style={{ fontFamily: font.fontFamily }}
                      className="text-xs sm:text-sm font-bold text-zinc-900 tracking-tight leading-snug truncate pt-0.5"
                    >
                      {font.name}
                    </div>

                    {/* Quick Preview Alphabet in the Specific Font */}
                    <div 
                      style={{ fontFamily: font.fontFamily }}
                      className="text-[10px] text-zinc-500 font-medium truncate"
                    >
                      Aa Bb 123
                    </div>
                  </div>

                  <div className="pt-1 border-t border-zinc-200/60 text-[9px] text-zinc-500 leading-tight truncate">
                    {font.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-600 shrink-0">
          <span className="font-mono text-[11px]">Click any font box above to instantly preview typography on the live website.</span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-1.5 rounded-xl font-bold tracking-wide shadow-sm cursor-pointer"
          >
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
