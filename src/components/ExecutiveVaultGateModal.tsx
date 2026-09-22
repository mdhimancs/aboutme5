import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  X, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ExecutiveVaultGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRoadmap?: {
    id: string;
    title: string;
    category: string;
    targetHorizon?: string;
    badge?: string;
  } | null;
  onUnlocked: () => void;
}

export const ExecutiveVaultGateModal: React.FC<ExecutiveVaultGateModalProps> = ({
  isOpen,
  onClose,
  targetRoadmap,
  onUnlocked
}) => {
  const { unlockVaultWithPin, isAdmin, isVaultUnlocked, jwtSessionInfo } = useAuth();
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPinDigits(['', '', '', '', '', '']);
      setError('');
      setSuccess(false);
      // Auto-focus first input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle character input in segmented 6-digit PIN boxes
  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, ''); // Numbers only for 6-digit PIN
    setError('');

    if (!cleanVal) {
      const updated = [...pinDigits];
      updated[index] = '';
      setPinDigits(updated);
      return;
    }

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      const updated = [...pinDigits];
      for (let i = 0; i < 6 && i < cleanVal.length; i++) {
        updated[i] = cleanVal[i];
      }
      setPinDigits(updated);
      const nextIndex = Math.min(cleanVal.length, 5);
      inputRefs.current[nextIndex]?.focus();

      if (cleanVal.length >= 6) {
        verifyPin(cleanVal.slice(0, 6));
      }
      return;
    }

    const updated = [...pinDigits];
    updated[index] = cleanVal[0];
    setPinDigits(updated);

    // Auto-advance to next box
    if (index < 5 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 filled
    const fullPin = updated.join('');
    if (fullPin.length === 6 && !updated.includes('')) {
      verifyPin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyPin = async (fullPin: string) => {
    setLoading(true);
    setError('');
    try {
      const ok = await unlockVaultWithPin(fullPin);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          onUnlocked();
          onClose();
        }, 800);
      } else {
        setError('Invalid 6-digit Access Code. Please verify the PIN with your search partner.');
        setPinDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBypassAdmin = () => {
    unlockVaultWithPin('C1$02026p@$$c0d3');
    setSuccess(true);
    setTimeout(() => {
      onUnlocked();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/40 p-6 sm:p-7 text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Decorative Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Vault Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Fingerprint className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                Section III • Executive Access Control
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                VAULT GATE
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              The "Executive Vault" Gate
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Aspirational Roadmaps & Boardroom Strategic Blueprints
            </p>
          </div>
        </div>

        {/* Target Roadmap Context Card */}
        {targetRoadmap && (
          <div className="mb-5 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {targetRoadmap.category || 'Strategic Horizon'}
                </span>
                {targetRoadmap.badge && (
                  <span className="text-[9px] font-mono text-zinc-400">
                    {targetRoadmap.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xs font-semibold text-zinc-200 truncate">
                {targetRoadmap.title}
              </h3>
            </div>
            <Lock className="w-4 h-4 text-amber-400/80 shrink-0" />
          </div>
        )}

        {/* 6-Digit PIN Challenge Form */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Enter 6-Digit Search Partner PIN
            </label>
            <p className="text-[11px] text-zinc-500">
              Provided to executive recruitment partners, board advisors, and search committees.
            </p>
          </div>

          {/* Segmented 6-box input */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-4">
            {pinDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={loading || success}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-xl border transition-all outline-none ${
                  success
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                    : error
                    ? 'border-red-500/80 bg-red-950/20 text-red-300 focus:border-red-500'
                    : digit
                    ? 'border-amber-500 bg-amber-950/20 text-white'
                    : 'border-zinc-700 bg-zinc-950/80 text-white focus:border-amber-400 focus:bg-zinc-900'
                }`}
              />
            ))}
          </div>

          {/* Feedback states */}
          {success ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Access Code Verified • Executive Vault Unlocked</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* Submit / Verify button */}
          <button
            type="button"
            disabled={loading || success || pinDigits.join('').length < 6}
            onClick={() => verifyPin(pinDigits.join(''))}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs font-bold transition-all shadow cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Cryptographic PIN...</span>
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Unlock Executive Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Search Partner Quick Clearance Options */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col gap-2">
          {jwtSessionInfo?.active ? (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/30 text-xs text-blue-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>8-Hour JWT Session Active ({jwtSessionInfo.hoursRemaining || 8}h left)</span>
              </div>
              <button
                type="button"
                onClick={handleBypassAdmin}
                className="text-[11px] font-semibold text-blue-400 hover:underline cursor-pointer"
              >
                Instant Open
              </button>
            </div>
          ) : isAdmin ? (
            <button
              type="button"
              onClick={handleBypassAdmin}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer border border-zinc-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Override • Direct Clearance</span>
            </button>
          ) : null}

          <div className="text-center text-[10.5px] text-zinc-500 pt-1">
            Need an Access Code? Contact <a href="mailto:munish.world@gmail.com" className="text-amber-400/90 hover:underline">munish.world@gmail.com</a> or your search consultant.
          </div>
        </div>
      </div>
    </div>
  );
};
