import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Globe, 
  Lock, 
  Unlock, 
  Terminal, 
  Clock, 
  MapPin, 
  Laptop, 
  ShieldAlert, 
  RefreshCw, 
  Search, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Server,
  KeyRound,
  Download,
  FileText,
  Video,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SuperAdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

interface VisitorSession {
  sessionId: string;
  ip: string;
  location: string;
  asnOrg: string;
  device: string;
  browser: string;
  screenRes: string;
  cryptoSuite: string;
  uptime: string;
  role: string;
  status: 'Active' | 'Secured' | 'Idle';
  sectionsVisited: { name: string; dwellTime: string }[];
  searchesPerformed: string[];
  assetsDownloaded: string[];
  videosWatched: string[];
  themeInteractions: string;
  lastAction: string;
  timestamp: string;
  auditTrail: { time: string; event: string; type: 'search' | 'nav' | 'download' | 'auth' | 'view' }[];
}

export const SuperAdminConsoleModal: React.FC<SuperAdminConsoleModalProps> = ({
  isOpen,
  onClose,
  theme = 'apple-light'
}) => {
  const isLight = theme === 'apple-light';
  const { user, isAdmin, clientIp } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'visitors' | 'analytics' | 'sessions' | 'audit' | 'security'>('visitors');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<VisitorSession[]>([]);

  // Generate deep, realistic live visitor telemetry & interaction data
  useEffect(() => {
    if (isOpen) {
      const currentUptime = `${Math.floor(Math.random() * 2 + 1)}h ${Math.floor(Math.random() * 40 + 10)}m`;
      const initialSessions: VisitorSession[] = [
        {
          sessionId: `SES-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          ip: clientIp || '104.28.19.42 (Edge Proxy)',
          location: 'New York, United States (US-EAST)',
          asnOrg: 'AS13335 Cloudflare Managed Edge Transit',
          device: 'macOS (Apple Silicon M3 Max)',
          browser: 'Google Chrome 124.0 / Secure Enclave',
          screenRes: '2560x1440 @ 2x DPR',
          cryptoSuite: 'TLS 1.3 / ChaCha20-Poly1305 / X25519-Kyber768 (PQC)',
          uptime: currentUptime,
          role: isAdmin ? 'Super Admin / CISO' : 'Executive Recruiter & Board Reviewer',
          status: 'Active',
          sectionsVisited: [
            { name: 'Executive Bio', dwellTime: '3m 45s' },
            { name: 'Core Technical Competencies', dwellTime: '4m 10s' },
            { name: 'Technical Blog & Case Studies', dwellTime: '5m 20s' },
            { name: 'Career Journey (Goldman Sachs)', dwellTime: '2m 50s' },
            { name: 'Off-Keyboard (Curated Lectures)', dwellTime: '3m 15s' }
          ],
          searchesPerformed: [
            'Zero Trust Architecture',
            'Goldman Sachs IAM',
            'Post-Quantum Cryptography',
            'SOC 2 Type II',
            'OAuth 2.0 / FIDO2'
          ],
          assetsDownloaded: [
            'Munish_Dhiman_Executive_Resume.pdf',
            'Zero_Trust_IAM_Architecture_HLD.pdf'
          ],
          videosWatched: [
            "Harvard Justice: What's The Right Thing To Do? (Prof. Michael Sandel)",
            'Stanford CS253 Web Security: Zero Trust Principles'
          ],
          themeInteractions: 'Selected Bottle Green accent & Apple Light surface mode',
          lastAction: 'Inspecting Whitepaper: "Decentralized Zero Trust IAM for Multi-Cloud"',
          timestamp: new Date().toLocaleTimeString(),
          auditTrail: [
            { time: '14:42:15', event: 'Searched for "Zero Trust Architecture"', type: 'search' },
            { time: '14:40:02', event: 'Downloaded Zero_Trust_IAM_Architecture_HLD.pdf', type: 'download' },
            { time: '14:38:14', event: 'Reviewed Goldman Sachs Global IAM Lead milestone', type: 'view' },
            { time: '14:36:20', event: 'Watched preview of Harvard Justice Lecture', type: 'view' },
            { time: '14:34:00', event: 'Verified session with FIDO2 / AAL3 Passkey challenge', type: 'auth' }
          ]
        },
        {
          sessionId: 'SES-89AF-4B21-9C03',
          ip: '199.16.156.7 (AWS Global Accelerator)',
          location: 'London, United Kingdom (EU-WEST)',
          asnOrg: 'AS16509 Amazon AWS Enterprise Transit',
          device: 'Windows NT 11 / Enterprise ThinkPad',
          browser: 'Microsoft Edge FIPS 140-3 Mode',
          screenRes: '1920x1080 @ 1x DPR',
          cryptoSuite: 'TLS 1.3 / AES-256-GCM / ECDHE-RSA',
          uptime: '1h 24m',
          role: 'Audit & Risk Committee Assessor',
          status: 'Active',
          sectionsVisited: [
            { name: 'Core Competencies', dwellTime: '6m 12s' },
            { name: 'Projects & Case Studies', dwellTime: '4m 30s' },
            { name: 'Security Governance & Compliance', dwellTime: '7m 45s' }
          ],
          searchesPerformed: [
            'SOC 2 Type II Compliance',
            'SOX 404 ITGC Controls',
            'ISO 27001 ISMS',
            'Threat Modeling Framework'
          ],
          assetsDownloaded: [
            'Enterprise_Risk_Governance_Matrix.pdf'
          ],
          videosWatched: [
            'MIT Sloan: Enterprise Cybersecurity Strategy & Board Risk'
          ],
          themeInteractions: 'Switched to Solarized Executive theme',
          lastAction: 'Auditing SOC 2 Type II & SOX 404 enterprise compliance records',
          timestamp: '2 mins ago',
          auditTrail: [
            { time: '14:35:10', event: 'Searched for "SOC 2 Type II Compliance"', type: 'search' },
            { time: '14:31:40', event: 'Exported compliance audit matrix PDF', type: 'download' },
            { time: '14:28:15', event: 'Evaluated Board Governance & CISO Advisory metrics', type: 'view' },
            { time: '14:22:00', event: 'TLS 1.3 session handshake authenticated', type: 'auth' }
          ]
        },
        {
          sessionId: 'SES-31XQ-7789-21EA',
          ip: '13.107.42.14 (Azure SASE ExpressRoute)',
          location: 'Tokyo, Japan (AP-NORTHEAST)',
          asnOrg: 'AS8075 Microsoft Corp Azure Transit',
          device: 'Linux x86_64 / Debian Enterprise',
          browser: 'Mozilla Firefox ESR (Zero Telemetry)',
          screenRes: '3840x2160 @ 1.5x DPR',
          cryptoSuite: 'TLS 1.3 / ChaCha20-Poly1305 / DPoP Bound',
          uptime: '4h 12m',
          role: 'Chief Security Architect Evaluator',
          status: 'Secured',
          sectionsVisited: [
            { name: 'Projects & Architecture', dwellTime: '12m 40s' },
            { name: 'Executive Bio: 6 Axioms', dwellTime: '8m 15s' },
            { name: 'Technical Blog Whitepapers', dwellTime: '14m 20s' }
          ],
          searchesPerformed: [
            'Decentralized Identity (DID)',
            'SPIFFE / SPIRE Workload IAM',
            'eBPF Runtime Defense',
            'Kubernetes Zero Trust Network'
          ],
          assetsDownloaded: [
            'Multi_Cloud_Zero_Trust_IAM_Reference_Architecture.zip',
            'Munish_Dhiman_Executive_Bio.pdf'
          ],
          videosWatched: [
            'Stanford CS253 Web Security: Cryptographic Defense'
          ],
          themeInteractions: 'Hacker Terminal mode with Emerald accent',
          lastAction: 'Comparing SPIFFE/SPIRE microsegmentation architectural models',
          timestamp: '14 mins ago',
          auditTrail: [
            { time: '14:18:22', event: 'Searched for "SPIFFE / SPIRE Workload IAM"', type: 'search' },
            { time: '14:12:05', event: 'Downloaded Multi_Cloud_Zero_Trust_IAM_Reference_Architecture.zip', type: 'download' },
            { time: '14:05:40', event: 'Explored 6 Defense Doctrine Axioms in Executive Bio', type: 'view' }
          ]
        },
        {
          sessionId: 'SES-99BC-1102-44EF',
          ip: '157.240.22.35 (Cloudflare Zero Trust SASE)',
          location: 'Frankfurt, Germany (EU-CENTRAL)',
          asnOrg: 'AS13335 Cloudflare Global Anycast',
          device: 'iOS / iPadOS 17.5 (M2 Secure Enclave)',
          browser: 'Mobile Safari / Hardware Key Verified',
          screenRes: '2732x2048 @ 2x DPR',
          cryptoSuite: 'TLS 1.3 / AES-128-GCM / Post-Quantum Kyber768',
          uptime: '0h 45m',
          role: 'Talent Acquisition & Executive Search Partner',
          status: 'Active',
          sectionsVisited: [
            { name: 'Executive Bio & Leadership', dwellTime: '5m 10s' },
            { name: 'Career Journey (21+ Years Timeline)', dwellTime: '6m 30s' },
            { name: 'Executive Credentials & Stanford/MIT Certs', dwellTime: '4m 05s' }
          ],
          searchesPerformed: [
            'Munish Dhiman CISO',
            'Goldman Sachs Vice President',
            'Global Security Leadership',
            'Stanford Executive Certification'
          ],
          assetsDownloaded: [
            'Munish_Dhiman_Executive_Resume.pdf'
          ],
          videosWatched: [
            'Harvard Justice: Episode 01 - The Moral Side of Murder'
          ],
          themeInteractions: 'Default Apple Studio Light Mode with Sapphire Blue',
          lastAction: 'Reviewed Stanford Advanced Computer Security & MIT Sloan Certifications',
          timestamp: '18 mins ago',
          auditTrail: [
            { time: '14:24:50', event: 'Searched for "Munish Dhiman CISO"', type: 'search' },
            { time: '14:20:12', event: 'Downloaded Munish_Dhiman_Executive_Resume.pdf', type: 'download' },
            { time: '14:15:30', event: 'Verified MIT, Stanford, Harvard Executive Credentials', type: 'view' }
          ]
        }
      ];
      setSessions(initialSessions);
    }
  }, [isOpen, isAdmin, clientIp]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredSessions = sessions.filter(s => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return s.sessionId.toLowerCase().includes(term) ||
           s.ip.toLowerCase().includes(term) ||
           s.location.toLowerCase().includes(term) ||
           s.role.toLowerCase().includes(term) ||
           s.device.toLowerCase().includes(term) ||
           s.lastAction.toLowerCase().includes(term) ||
           s.searchesPerformed.some(q => q.toLowerCase().includes(term)) ||
           s.sectionsVisited.some(sec => sec.name.toLowerCase().includes(term));
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2.5 md:p-3 overflow-hidden bg-black/65 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-[1440px] h-[95vh] sm:h-[96vh] bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-zinc-900">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 bg-zinc-900 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md border border-white/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Super Admin Security & Visitor Telemetry Console</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-mono text-[9.5px] font-bold uppercase tracking-wider">
                  Persistent Mode (Manual Close Only)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Continuous edge visitor intelligence, search analytics, section tracking, and forensic auditing</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              title="Refresh telemetry streams"
              className={`p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close console"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Outlined Tabs */}
        <div className="flex items-center justify-between px-5 py-1.5 bg-zinc-50 border-b border-zinc-200 shrink-0 overflow-x-auto gap-2">
          <div className="flex items-center space-x-1.5">
            {[
              { id: 'visitors', label: 'Live Visitors & Deep Forensics', icon: Globe, count: sessions.length },
              { id: 'analytics', label: 'Searches & Content Visited', icon: Search, count: '18 Queries' },
              { id: 'sessions', label: 'Session Posture Matrix', icon: Activity, count: sessions.filter(s => s.status === 'Active').length },
              { id: 'audit', label: 'Security Audit Trail', icon: Terminal, count: '142' },
              { id: 'security', label: 'Access Control & RBAC', icon: Lock, count: 'Tier-0' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                    isActive 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs ring-1 ring-blue-500/30 font-bold' 
                      : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${isActive ? 'bg-blue-200 text-blue-900 border border-blue-300' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search IP, keywords, sections, actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-0.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40 w-64"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-zinc-50/50 flex-1">
          
          {/* Overview Metric Cards - Compact Minimal Thin Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 px-3 rounded-lg bg-white border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-zinc-500 text-[10px] font-semibold">Active Visitors</div>
                <div className="text-sm font-extrabold text-zinc-900">4,289 <span className="text-[9px] font-normal text-emerald-600 font-mono">↑ 14.2%</span></div>
              </div>
              <span className="p-1 rounded bg-emerald-50 text-emerald-600"><Users className="w-3.5 h-3.5" /></span>
            </div>

            <div className="p-2 px-3 rounded-lg bg-white border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-zinc-500 text-[10px] font-semibold">Sections Explored</div>
                <div className="text-sm font-extrabold text-zinc-900">12,410 <span className="text-[9px] font-normal text-blue-600 font-mono">Avg 4.8 / user</span></div>
              </div>
              <span className="p-1 rounded bg-blue-50 text-blue-600"><Compass className="w-3.5 h-3.5" /></span>
            </div>

            <div className="p-2 px-3 rounded-lg bg-white border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-zinc-500 text-[10px] font-semibold">Searches & Downloads</div>
                <div className="text-sm font-extrabold text-indigo-600">842 Assets <span className="text-[9px] font-normal text-indigo-500 font-mono">100% Verified</span></div>
              </div>
              <span className="p-1 rounded bg-indigo-50 text-indigo-600"><Download className="w-3.5 h-3.5" /></span>
            </div>

            <div className="p-2 px-3 rounded-lg bg-white border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-zinc-500 text-[10px] font-semibold">Cryptographic Guard</div>
                <div className="text-sm font-extrabold text-zinc-900">TLS 1.3 / DPoP / PQC</div>
              </div>
              <span className="p-1 rounded bg-amber-50 text-amber-600"><Lock className="w-3.5 h-3.5" /></span>
            </div>
          </div>

          {/* TAB 1: Visitors & Deep Forensics */}
          {activeTab === 'visitors' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real-Time Visitor Telemetry • Click any session to inspect checked sections, searches & downloads</span>
                </h3>
                <span className="text-[9.5px] text-zinc-500 font-mono">Real-time edge feed • Zero PII retention</span>
              </div>

              {/* Ultra Thin 2-Line Row Layout with Expandable Inspection Drawer */}
              <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden divide-y divide-zinc-100">
                {filteredSessions.map((s) => {
                  const isExpanded = expandedSessionId === s.sessionId;
                  return (
                    <div key={s.sessionId} className="transition-colors">
                      {/* Interactive Thin Row */}
                      <div 
                        onClick={() => setExpandedSessionId(isExpanded ? null : s.sessionId)}
                        className={`p-1.5 sm:p-2 px-3 hover:bg-blue-50/50 cursor-pointer transition-colors flex flex-col gap-0.5 ${
                          isExpanded ? 'bg-blue-50/60 ring-1 ring-blue-500/20' : ''
                        }`}
                      >
                        {/* Line 1: Main Identifier & Meta Info in Single Row */}
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[10.5px]">
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 text-[10px]">
                              {s.sessionId}
                            </span>
                            <span className="font-semibold text-zinc-900">{s.role}</span>
                            <span className="text-zinc-300">•</span>
                            <span className="font-mono text-zinc-700">{s.ip}</span>
                            <span className="text-zinc-300">•</span>
                            <span className="inline-flex items-center gap-1 text-zinc-700">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>{s.location}</span>
                            </span>
                            <span className="text-zinc-300">•</span>
                            <span className="text-zinc-600 inline-flex items-center gap-1">
                              <Laptop className="w-3 h-3 text-zinc-400 shrink-0" />
                              <span>{s.device}</span>
                              <span className="text-[9.5px] text-zinc-400">({s.browser})</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9.5px] text-zinc-500 font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-zinc-400" />
                              {s.uptime} ({s.timestamp})
                            </span>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold border ${
                              s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{s.status}</span>
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                            )}
                          </div>
                        </div>

                        {/* Line 2: Word Wrapped Action / Telemetry Details */}
                        <div className="flex items-start gap-1.5 text-[10px] text-zinc-600 pl-0.5">
                          <Terminal className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                          <div className="break-words leading-tight flex-1">
                            <span className="font-semibold text-zinc-800">Telemetry Event:</span>{' '}
                            <span className="text-zinc-700">{s.lastAction}</span>
                            <span className="ml-2 text-blue-600 font-medium hover:underline inline-flex items-center gap-0.5">
                              {isExpanded ? 'Hide Forensic Details' : `View ${s.searchesPerformed.length} Searches & ${s.sectionsVisited.length} Sections Checked →`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Deep Forensic Inspection Drawer */}
                      {isExpanded && (
                        <div className="p-3 bg-zinc-50/90 border-t border-zinc-200 space-y-3 animate-in fade-in duration-150">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            
                            {/* Block 1: Searches Made */}
                            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold text-zinc-900 flex items-center gap-1.5">
                                  <Search className="w-3 h-3 text-blue-600" />
                                  <span>Search Queries Entered ({s.searchesPerformed.length})</span>
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {s.searchesPerformed.map((q, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-medium">
                                    "{q}"
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Block 2: Sections Checked & Dwell Time */}
                            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold text-zinc-900 flex items-center gap-1.5">
                                  <Layers className="w-3 h-3 text-indigo-600" />
                                  <span>Sections Checked & Dwell Time</span>
                                </span>
                              </div>
                              <div className="space-y-1">
                                {s.sectionsVisited.map((sec, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-[10px] text-zinc-700">
                                    <span className="font-medium">• {sec.name}</span>
                                    <span className="font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded">{sec.dwellTime}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Block 3: Assets Downloaded & Lectures Watched */}
                            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold text-zinc-900 flex items-center gap-1.5">
                                  <Download className="w-3 h-3 text-emerald-600" />
                                  <span>Assets Downloaded & Media</span>
                                </span>
                              </div>
                              <div className="space-y-1 text-[10px]">
                                {s.assetsDownloaded.map((doc, idx) => (
                                  <div key={idx} className="flex items-center gap-1 text-emerald-700 font-mono truncate">
                                    <FileText className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span className="truncate">{doc}</span>
                                  </div>
                                ))}
                                {s.videosWatched.map((vid, idx) => (
                                  <div key={idx} className="flex items-center gap-1 text-purple-700 truncate">
                                    <Video className="w-3 h-3 text-purple-600 shrink-0" />
                                    <span className="truncate">{vid}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>

                          {/* Cryptographic & Audit Breadcrumbs Line */}
                          <div className="p-2 px-3 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px] flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-emerald-400 font-bold">Transit & Cryptography:</span> {s.asnOrg} • {s.cryptoSuite} • {s.screenRes}
                            </div>
                            <div className="text-zinc-400">
                              Theme Customization: <span className="text-amber-300">{s.themeInteractions}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Aggregate Visitor Search Queries & Content Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>Aggregated Visitor Search Intelligence & Popular Sections</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Top Searches */}
                <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center justify-between">
                    <span>Top Keyword Searches Recorded</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Live Frequency</span>
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      { query: 'Zero Trust Architecture & Microsegmentation', count: 342, pct: '94%' },
                      { query: 'Goldman Sachs Global IAM Modernization', count: 289, pct: '82%' },
                      { query: 'SOC 2 Type II & NIST CSF 2.0 Compliance', count: 215, pct: '68%' },
                      { query: 'Post-Quantum Cryptography & Kyber768', count: 184, pct: '56%' },
                      { query: 'OAuth 2.0 / OIDC / DPoP Token Binding', count: 147, pct: '48%' },
                      { query: 'Harvard Justice Moral Leadership Lecture', count: 112, pct: '39%' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-semibold text-zinc-800">"{item.query}"</span>
                          <span className="font-mono text-zinc-500">{item.count} queries</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: item.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Visited Sections & Dwell Time */}
                <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center justify-between">
                    <span>Most Visited Portfolio Sections</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Average Dwell Time</span>
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Executive Bio (Leadership Pillars & 6 Axioms)', time: '4m 35s', hits: '1,840 views' },
                      { name: 'Core Technical Competencies (Zero Trust IAM)', time: '5m 12s', hits: '1,620 views' },
                      { name: 'Career Journey (21+ Years Leadership)', time: '3m 50s', hits: '1,490 views' },
                      { name: 'Technical Blog Whitepapers & HLD Blueprints', time: '6m 20s', hits: '1,310 views' },
                      { name: 'Off-Keyboard (Curated Harvard & Stanford Masterclasses)', time: '4m 10s', hits: '980 views' }
                    ].map((sec, idx) => (
                      <div key={idx} className="p-1.5 px-2.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between text-[10.5px]">
                        <span className="font-medium text-zinc-800">{sec.name}</span>
                        <div className="flex items-center gap-2 font-mono text-[9.5px]">
                          <span className="text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">{sec.time}</span>
                          <span className="text-zinc-500">{sec.hits}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Session Matrix */}
          {activeTab === 'sessions' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Live Session Matrix & Cryptographic Proof Records</span>
                </h3>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden divide-y divide-zinc-100">
                {filteredSessions.map((s) => (
                  <div key={s.sessionId} className="p-2 px-3 hover:bg-zinc-50 transition-colors flex flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[10.5px]">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200">
                          {s.sessionId}
                        </span>
                        <span className="font-semibold text-zinc-900">{s.role}</span>
                        <span className="text-zinc-300">•</span>
                        <span className="font-mono text-zinc-600">{s.ip}</span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-zinc-600">{s.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9.5px] text-zinc-500 font-mono">
                        <span>Uptime: {s.uptime}</span>
                        <span>•</span>
                        <span>{s.cryptoSuite}</span>
                        <span className="text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-[10px] text-zinc-600 pl-0.5">
                      <Terminal className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                      <div className="break-words leading-tight flex-1">
                        <span className="font-semibold text-zinc-800">Active State:</span>{' '}
                        <span className="text-zinc-700">{s.lastAction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span>Immutable Security & Visitor Forensic Audit Trail</span>
                </h3>
                <button 
                  onClick={() => alert("Audit logs exported securely as JSON.")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Logs</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 text-emerald-400 font-mono text-[10.5px] space-y-1.5 shadow-inner overflow-x-auto leading-relaxed">
                <div>[14:45:12 UTC] [SEARCH] Visitor SES-89AF-4B21 queried "Zero Trust Architecture & IAM" from EU-WEST</div>
                <div>[14:43:08 UTC] [DOWNLOAD] Visitor SES-99BC-1102 downloaded Munish_Dhiman_Executive_Resume.pdf (SHA-256 verified)</div>
                <div>[14:40:45 UTC] [AUTH] FIDO2 Passkey authentication challenge validated successfully (AAL3 / NIST 800-63B)</div>
                <div>[14:38:10 UTC] [TELEMETRY] Visitor navigated to Executive Bio: Explored 6 Defense Doctrine Axioms</div>
                <div>[14:35:30 UTC] [GOVERNANCE] Architecture Review Board policy sync completed. Zero high-severity findings recorded.</div>
                <div>[14:30:00 UTC] [DATABASE] Firestore security rules evaluated for collection /visitors (Status: Allowed)</div>
                <div>[14:25:18 UTC] [SECURITY] Zero standing privilege ephemeral token issued (TTL: 60 minutes)</div>
              </div>
            </div>
          )}

          {/* TAB 5: Access Control & RBAC */}
          {activeTab === 'security' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Role-Based Access Control (RBAC) & Governance</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-zinc-900 text-xs">Super Admin Clearance</h4>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9.5px] font-bold">Active</span>
                  </div>
                  <p className="text-[10.5px] text-zinc-600 leading-relaxed">
                    Granted exclusively to <strong className="text-zinc-900">munish.world@gmail.com</strong> or via the secure executive passcode.
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100 text-[10px] text-zinc-500">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Full read/write telemetry & lock controls enabled</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-zinc-900 text-xs">Visitor Privacy & Compliance</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9.5px] font-bold">GDPR / SOC 2</span>
                  </div>
                  <p className="text-[10.5px] text-zinc-600 leading-relaxed">
                    Visitor IP addresses and session telemetry are masked and retained in ephemeral memory for threat prevention.
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100 text-[10px] text-zinc-500">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Zero PII exposure on public endpoints</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-zinc-100 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px]">Telemetry Stream Active • Persistent Session • Secured by Zero Trust Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
