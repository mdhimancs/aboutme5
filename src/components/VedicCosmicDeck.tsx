import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Zap, 
  Cpu, 
  Award, 
  Heart, 
  Lock, 
  Wind, 
  Sparkles, 
  MapPin, 
  Compass, 
  Clock, 
  Activity, 
  Eye,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionBackgroundAura } from './SectionBackgroundAura';

interface VedicCosmicDeckProps {
  theme?: string;
}

const PLANETS = [
  { id: 'sun', name: 'Surya (Sun)', sign: 'Soul, Leadership, Vitality', icon: <Sun className="w-5 h-5 text-amber-500" />, desc: 'The King of planets, representing the self, father, and executive authority. It illuminates the path of dharma and governance.' },
  { id: 'moon', name: 'Chandra (Moon)', sign: 'Mind, Emotions, Perception', icon: <Moon className="w-5 h-5 text-blue-300" />, desc: 'The Queen, governing the subconscious, intuition, and mental peace. It reflects the emotional intelligence required for leadership.' },
  { id: 'mars', name: 'Mangala (Mars)', sign: 'Action, Energy, Courage', icon: <Zap className="w-5 h-5 text-rose-500" />, desc: 'The Commander, representing drive, physical strength, and technical precision. It is the force that executes strategic mandates.' },
  { id: 'mercury', name: 'Budha (Mercury)', sign: 'Intellect, Communication', icon: <Cpu className="w-5 h-5 text-emerald-500" />, desc: 'The Prince, governing analytical skills, logic, and multi-cloud orchestration. It bridges the gap between vision and reality.' },
  { id: 'jupiter', name: 'Guru (Jupiter)', sign: 'Wisdom, Expansion, Grace', icon: <Award className="w-5 h-5 text-yellow-400" />, desc: 'The Great Teacher, representing spiritual growth, prosperity, and architectural wisdom. It guides the long-term vision.' },
  { id: 'venus', name: 'Shukra (Venus)', sign: 'Art, Relationship, Value', icon: <Heart className="w-5 h-5 text-pink-400" />, desc: 'The Minister, governing aesthetics, harmony, and enterprise value. It brings refinement and strategic alignment to the fabric.' },
  { id: 'saturn', name: 'Shani (Saturn)', sign: 'Discipline, Karma, Time', icon: <Lock className="w-5 h-5 text-zinc-500" />, desc: 'The Taskmaster, representing structure, long-term resilience, and regulatory boundaries. It enforces the law of consequence.' },
  { id: 'rahu', name: 'Rahu (North Node)', sign: 'Innovation, Shadow, Scale', icon: <Wind className="w-5 h-5 text-indigo-400" />, desc: 'The Disruptor, governing unconventional growth, global scale, and digital shadows. It represents the boundary-less multi-cloud.' },
  { id: 'ketu', name: 'Ketu (South Node)', sign: 'Liberation, Detachment', icon: <Sparkles className="w-5 h-5 text-purple-400" />, desc: 'The Sage, representing deep research, cryptography, and the spiritual roots of identity. It is the silent protector of secrets.' },
];

const SHADBALA = [
  { id: 'sthana', name: 'Sthana Bala', sign: 'Positional Strength', icon: <MapPin className="w-5 h-5 text-blue-500" />, desc: 'The strength derived from a planet\'s placement. In leadership, this represents the authority and influence of one\'s executive position.' },
  { id: 'dig', name: 'Dig Bala', sign: 'Directional Strength', icon: <Compass className="w-5 h-5 text-emerald-500" />, desc: 'The strength found in the right direction. It signifies strategic orientation and the ability to steer complex programs correctly.' },
  { id: 'kala', name: 'Kala Bala', sign: 'Temporal Strength', icon: <Clock className="w-5 h-5 text-amber-500" />, desc: 'The strength relative to time. It reflects the importance of timing in incident response and the lifecycle of transformation.' },
  { id: 'cheshta', name: 'Cheshta Bala', sign: 'Motional Strength', icon: <Activity className="w-5 h-5 text-rose-500" />, desc: 'The strength from effort and movement. It measures the kinetic energy and operational momentum of security programs.' },
  { id: 'naisargika', name: 'Naisargika Bala', sign: 'Natural Strength', icon: <Shield className="w-5 h-5 text-indigo-500" />, desc: 'The inherent, fixed strength of a planet. This is the bedrock foundation of technical expertise and personal integrity.' },
  { id: 'drig', name: 'Drig Bala', sign: 'Aspectual Strength', icon: <Eye className="w-5 h-5 text-purple-500" />, desc: 'The strength gained from being observed by others. It represents the collaborative support and collective vision of the GRC community.' },
];

export const VedicCosmicDeck: React.FC<VedicCosmicDeckProps> = ({ theme = 'apple-dark' }) => {
  const isLight = theme === 'apple-light';
  const [activeDeck, setActiveDeck] = useState<'planets' | 'shadbala'>('planets');
  const [selectedCardId, setSelectedId] = useState<string | null>(null);

  const currentCards = activeDeck === 'planets' ? PLANETS : SHADBALA;
  const selectedCard = currentCards.find(c => c.id === selectedCardId);

  return (
    <section 
      id="cosmic" 
      className={`relative overflow-hidden min-h-screen lg:h-screen w-full flex flex-col justify-between pt-8 sm:pt-12 pb-3 sm:pb-4 lg:pb-5 px-7 sm:px-14 lg:px-18 max-w-5xl lg:max-w-[1400px] mx-auto overflow-hidden border-t transition-colors duration-500 ${
        isLight ? 'border-transparent bg-[#fcfcfd]' : 'border-transparent bg-[#000000]'
      }`}
    >
      <SectionBackgroundAura theme={theme} auraLevel={3} />

      <div className="relative w-full max-w-[1400px] mx-auto flex flex-col flex-1 justify-center space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="relative text-left space-y-1.5 shrink-0 -mt-4">
          <div className={`absolute -top-3 -left-2 sm:-left-4 w-72 sm:w-96 h-24 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all ${
            isLight 
              ? 'bg-gradient-to-r from-amber-400/20 via-orange-300/15 to-indigo-300/15 opacity-80' 
              : 'bg-gradient-to-r from-amber-500/25 via-orange-400/15 to-indigo-500/20 opacity-90'
          }`} />

          <div 
            style={{ fontSize: '11px' }}
            className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold tracking-wider uppercase border backdrop-blur-md mb-1 shadow-xs ${
            isLight 
              ? 'bg-amber-50/90 border-amber-200 text-amber-700' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.18)]'
          }`}>
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Vedic Philosophy & Universal Architecture</span>
          </div>

          <h2 className={`relative text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-all text-left ${
            isLight 
              ? 'text-zinc-900 drop-shadow-[0_2px_16px_rgba(245,158,11,0.15)]' 
              : 'text-white drop-shadow-[0_0_24px_rgba(245,158,11,0.35)]'
          }`}>
            The Cosmic Grid: Navagraha & Shadbala
          </h2>
          <p 
            style={{ fontSize: '11px' }}
            className={`relative max-w-3xl font-normal text-left text-[11px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}
          >
            A symbolic exploration of executive strength and universal forces, mapping ancient Vedic concepts to modern architectural resilience.
          </p>

          {/* Deck Switcher */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => { setActiveDeck('planets'); setSelectedId(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                activeDeck === 'planets'
                  ? 'bg-amber-500 text-white border-amber-400 shadow-lg'
                  : isLight ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : 'bg-white/5 text-zinc-400 border-white/10'
              }`}
            >
              Navagraha (Planets)
            </button>
            <button
              onClick={() => { setActiveDeck('shadbala'); setSelectedId(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                activeDeck === 'shadbala'
                  ? 'bg-amber-500 text-white border-amber-400 shadow-lg'
                  : isLight ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : 'bg-white/5 text-zinc-400 border-white/10'
              }`}
            >
              Shadbala (Strengths)
            </button>
          </div>
        </div>

        {/* Cards Deck */}
        <div className="relative flex-1 flex items-center justify-center min-h-[400px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
            {currentCards.map((card) => (
              <motion.div
                key={card.id}
                layoutId={card.id}
                onClick={() => setSelectedId(card.id)}
                className={`group cursor-pointer relative rounded-2xl border aspect-[3/4] p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                  isLight 
                    ? 'bg-white border-zinc-200 shadow-sm hover:shadow-xl hover:border-amber-400' 
                    : 'bg-zinc-950 border-white/10 shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isLight ? 'bg-zinc-50' : 'bg-white/5'}`}>
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-bold opacity-50 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {card.id.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h3 className={`text-sm font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    {card.name}
                  </h3>
                  <p className={`text-[10px] font-semibold leading-tight ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
                    {card.sign}
                  </p>
                </div>

                <div className={`pt-3 border-t ${isLight ? 'border-zinc-100' : 'border-white/5'} flex justify-end`}>
                  <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isLight ? 'text-zinc-300' : 'text-white/20'}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expanded Modal Content */}
          <AnimatePresence>
            {selectedCardId && selectedCard && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedId(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                
                <motion.div
                  layoutId={selectedCardId}
                  className={`relative w-full max-w-lg rounded-3xl border overflow-hidden shadow-2xl ${
                    isLight ? 'bg-white border-zinc-200' : 'bg-[#090d16] border-white/15'
                  }`}
                >
                  <div className="p-8 sm:p-10 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className={`inline-flex p-3 rounded-2xl ${isLight ? 'bg-amber-50 text-amber-600' : 'bg-amber-500/10 text-amber-400'}`}>
                          {selectedCard.icon}
                        </div>
                        <h3 className={`text-3xl font-black tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                          {selectedCard.name}
                        </h3>
                        <p className="text-amber-500 font-mono text-sm font-bold uppercase tracking-widest">
                          {selectedCard.sign}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedId(null)}
                        className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/10'}`}
                      >
                        <Zap className="w-5 h-5 rotate-45" />
                      </button>
                    </div>

                    <div className={`w-full h-px ${isLight ? 'bg-zinc-100' : 'bg-white/5'}`} />

                    <div className="space-y-4">
                      <h4 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Executive & Cosmic Influence
                      </h4>
                      <p className={`text-lg sm:text-xl font-serif italic leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                        &ldquo;{selectedCard.desc}&rdquo;
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedId(null)}
                      className={`w-full py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
                        isLight 
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg' 
                          : 'bg-amber-500 text-white hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      }`}
                    >
                      Return to Deck
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? 'border-zinc-200 text-zinc-500' : 'border-white/5 text-zinc-500'}`}>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
            <Shield className="w-3 h-3" />
            <span>Foundational Cosmic Framework</span>
          </div>
          <p className="text-[9px] font-medium opacity-60 text-center sm:text-right max-w-xs">
            Reflecting the interplay between macrocosmic forces and the microscopic precision of enterprise architecture.
          </p>
        </div>

      </div>
    </section>
  );
};
