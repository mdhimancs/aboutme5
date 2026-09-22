import React from 'react';
import { ShieldAlert, AlertTriangle, Lock, Globe, Terminal, Mail } from 'lucide-react';

interface DenyListBlockScreenProps {
  clientIp: string | null;
  reason?: string | null;
  identifier?: string | null;
}

export const DenyListBlockScreen: React.FC<DenyListBlockScreenProps> = ({
  clientIp,
  reason,
  identifier
}) => {
  const incidentCode = `SEC-BLOCK-${Math.abs(
    (clientIp || '127.0.0.1').split('.').reduce((acc, part) => acc * 31 + parseInt(part || '0', 10), 7)
  ).toString(16).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-[999999] bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 font-sans select-none overflow-y-auto">
      {/* Background Matrix/Grid Aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-black pointer-events-none" />

      <div className="relative max-w-xl w-full bg-zinc-900/90 border border-red-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-950/50 backdrop-blur-xl space-y-6">
        {/* Security Badge Header */}
        <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                  Adaptive Traffic Governance
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  ACTIVE DENIAL
                </span>
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Access Restricted: Dynamic Security Deny List
              </h1>
            </div>
          </div>
          <Lock className="w-5 h-5 text-zinc-600 hidden sm:block" />
        </div>

        {/* Warning Content */}
        <div className="space-y-3">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Traffic from your network interface or identifier has been intercepted and placed on the executive perimeter deny list. Real-time telemetry has halted all requests to proprietary architecture blueprints, strategic roadmaps, and portfolio dossiers.
          </p>

          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Globe className="w-3.5 h-3.5 text-red-400" />
                Detected Origin IP:
              </span>
              <span className="font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                {clientIp || '127.0.0.1 (Loopback/Proxy)'}
              </span>
            </div>

            {identifier && (
              <div className="flex items-center justify-between text-zinc-400">
                <span>Blocked Identifier:</span>
                <span className="text-amber-300">{identifier}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-zinc-400">
              <span>Enforcement Trigger:</span>
              <span className="text-zinc-200">
                {reason || 'Proactive intrusion defense / Intrusive scraper mitigation'}
              </span>
            </div>

            <div className="flex items-center justify-between text-zinc-500 border-t border-zinc-800 pt-2 text-[11px]">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-zinc-400" />
                Audit Reference:
              </span>
              <span className="text-zinc-300">{incidentCode}</span>
            </div>
          </div>
        </div>

        {/* Dispute / Inquiry Instructions */}
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-400 space-y-1">
            <div className="font-semibold text-zinc-200">Executive Recruiter or Search Partner?</div>
            <p>
              If this block was triggered erroneously or your corporate VPN/proxy is sharing a flagged subnet, please contact the portfolio administrator directly to request immediate clearance whitelist.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a 
                href="mailto:munish.world@gmail.com?subject=[Executive Deny List Clearance Request] IP: " 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-[11px] font-medium transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Request Clearance (munish.world@gmail.com)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-zinc-500 font-mono">
          Perimeter Security Layer • Real-Time Dynamic Telemetry Enforced
        </div>
      </div>
    </div>
  );
};
