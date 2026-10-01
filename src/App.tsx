/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExecutiveBio } from './components/ExecutiveBio';
import { CoreCompetencies } from './components/CoreCompetencies';
import { CareerJourney } from './components/CareerJourney';
import { TechnicalBlog } from './components/TechnicalBlog';
import { OffKeyboard } from './components/OffKeyboard';
import { Archive } from './components/Archive';
import { Projects } from './components/Projects';
import { Philosophy } from './components/Philosophy';
import { ContactModal } from './components/ContactModal';
import { GateModal } from './components/GateModal';
import { ExecutiveVaultGateModal } from './components/ExecutiveVaultGateModal';
import { DenyListBlockScreen } from './components/DenyListBlockScreen';
import { useAuth } from './context/AuthContext';
import { InterfaceOptionsModal, ThemeMode, AccentColor, FontStyle } from './components/InterfaceOptionsModal';
import { SuperAdminConsoleModal } from './components/SuperAdminConsoleModal';
import { ExecutiveFontsShowcaseModal, TOP_56_EXECUTIVE_FONTS } from './components/ExecutiveFontsShowcaseModal';
import { ChevronUp, ChevronDown, Clock, AlertTriangle, X } from 'lucide-react';
import { motion } from 'motion/react';

const SECTIONS = ['overview', 'bio', 'competencies', 'career', 'projects', 'blog', 'offkeyboard', 'philosophy', 'archive'] as const;
type SectionId = typeof SECTIONS[number];

const SECTION_LABELS: Record<SectionId, string> = {
  overview: 'Overview',
  bio: 'Executive Bio',
  competencies: 'Competencies',
  career: 'Career Journey',
  projects: 'Case Studies',
  blog: 'Publications',
  offkeyboard: 'Off Keyboard',
  philosophy: 'Philosophy',
  archive: 'Archives & Publications'
};

const StatusBanner: React.FC<{ theme: string }> = ({ theme }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isLight = theme === 'apple-light' || theme === 'solarized';

  if (!isVisible) return null;

  return (
    <div className={`relative z-[100] w-full py-2.5 px-6 sm:px-14 flex items-center justify-center transition-all duration-500 ${
      isLight 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'bg-[#090d16] border-b border-blue-500/20 text-blue-50 shadow-2xl'
    }`}>
      <div className="max-w-[1400px] w-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-xl ${
            isLight ? 'bg-white/15' : 'bg-blue-500/10 border border-blue-400/20'
          }`}>
            <Clock className={`w-4 h-4 ${isLight ? 'text-white' : 'text-blue-400'} animate-pulse`} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 overflow-hidden">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
              isLight ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-300'
            }`}>
              Status Update
            </span>
            <p className="text-[11.5px] sm:text-[13px] font-bold tracking-tight leading-tight truncate opacity-95">
              The website is updated continously, if you are unable to access the website, you may wait for the website to complete maintenance or alternatively you may also ping me.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsVisible(false)}
            className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
              isLight ? 'hover:bg-white/20 text-white' : 'hover:bg-white/10 text-blue-200'
            }`}
            aria-label="Dismiss Status Update"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface SnapSectionProps {
  id: SectionId;
  children: React.ReactNode;
}

const SnapSection: React.FC<SnapSectionProps> = ({ id, children }) => {
  return (
    <div id={id} className="snap-section w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 35 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -35 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ 
          duration: 0.7, 
          ease: [0.16, 1, 0.3, 1],
          staggerChildren: 0.1,
          delayChildren: 0.05
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function App() {
  const { 
    isDenied, 
    denyReason, 
    clientIp, 
    user,
    vaultModalOpen, 
    setVaultModalOpen, 
    targetRoadmap,
    jwtSessionInfo,
    jwtExpiredAlert,
    dismissJwtAlert
  } = useAuth();

  const [contactOpen, setContactOpen] = useState(false);
  const [interfaceModalOpen, setInterfaceModalOpen] = useState(false);
  const [fontsShowcaseOpen, setFontsShowcaseOpen] = useState(false);
  const [customFontFamily, setCustomFontFamily] = useState<string | null>(null);
  const [superAdminOpen, setSuperAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [scrollProgress, setScrollProgress] = useState(0);

  const [theme, setTheme] = useState<ThemeMode>('apple-light');
  const [accent, setAccent] = useState<AccentColor>('blue');
  const [font, setFont] = useState<FontStyle>('inter');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('executive_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('executive_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const activeIndex = Math.max(0, SECTIONS.indexOf(activeSection));

  // Navigate to target section smoothly
  const navigateToSection = useCallback((sectionId: SectionId) => {
    const el = document.getElementById(sectionId);
    if (el && containerRef.current) {
      isTransitioningRef.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      window.history.pushState(null, '', `#${sectionId}`);
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 700);
    }
  }, []);

  // Handle initial mount / refresh: always show overview page and reset URL hash
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setActiveSection('overview');
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Sync activeSection with URL hash on scroll
  useEffect(() => {
    if (activeSection) {
      window.history.replaceState(null, '', `#${activeSection}`);
    }
  }, [activeSection]);

  const navigateToIndex = useCallback((index: number) => {
    if (index >= 0 && index < SECTIONS.length) {
      navigateToSection(SECTIONS[index]);
    }
  }, [navigateToSection]);

  const handleNextPage = useCallback(() => {
    if (activeIndex < SECTIONS.length - 1) {
      navigateToIndex(activeIndex + 1);
    }
  }, [activeIndex, navigateToIndex]);

  const handlePrevPage = useCallback(() => {
    if (activeIndex > 0) {
      navigateToIndex(activeIndex - 1);
    }
  }, [activeIndex, navigateToIndex]);

  // Executive Access Alert: Notify owner on new visit (once per session)
  useEffect(() => {
    // Check if alert was already sent in this session to prevent spam on refreshes
    let hasSentAlert = false;
    try {
      hasSentAlert = !!sessionStorage.getItem('executive_portfolio_access_alert_sent');
    } catch (e) {
      // In private mode or restricted environments, storage might be unavailable
    }
    
    if (!hasSentAlert) {
      const dispatchDetailedAccessAlert = async () => {
        const getGpuInfo = () => {
          try {
            const canvas = document.createElement('canvas');
            if (!canvas) return { vendor: 'Unavailable', renderer: 'Unavailable', webglVersion: 'Unavailable' };
            const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
            if (!gl) return { vendor: 'Disabled', renderer: 'Disabled', webglVersion: 'Disabled' };
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const webglVersion = gl.getParameter(gl.VERSION) || 'WebGL';
            return debugInfo ? {
              vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown',
              renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown',
              webglVersion
            } : { vendor: 'Restricted', renderer: 'Restricted', webglVersion };
          } catch {
            return { vendor: 'Error', renderer: 'Error', webglVersion: 'Error' };
          }
        };

        // 1. Collect multi-provider Geolocation & Network ISP Intelligence
        let locationData: Record<string, any> = {};
        try {
          const geoRes = await fetch('https://ipwho.is/');
          if (geoRes.ok) {
            const gd = await geoRes.json();
            if (gd && gd.success !== false) {
              locationData = {
                ip: gd.ip,
                type: gd.type || 'IPv4',
                continent: gd.continent,
                continentCode: gd.continent_code,
                country: gd.country,
                countryCode: gd.country_code,
                capital: gd.capital,
                region: gd.region,
                regionCode: gd.region_code,
                city: gd.city,
                postal: gd.postal,
                latitude: gd.latitude,
                longitude: gd.longitude,
                googleMapsUrl: (gd.latitude !== undefined && gd.longitude !== undefined)
                  ? `https://www.google.com/maps?q=${gd.latitude},${gd.longitude}`
                  : undefined,
                callingCode: gd.calling_code ? `+${gd.calling_code}` : undefined,
                isEu: gd.is_eu,
                asn: gd.connection?.asn ? `AS${gd.connection.asn}` : undefined,
                org: gd.connection?.org,
                isp: gd.connection?.isp,
                domain: gd.connection?.domain,
                timezone: gd.timezone?.id,
                utcOffset: gd.timezone?.utc,
                localTime: gd.timezone?.current_time,
                currency: gd.currency ? `${gd.currency.name} (${gd.currency.code} ${gd.currency.symbol || ''})` : undefined
              };
            }
          }
        } catch {}

        // Fallback to ipapi.co if primary geolocation was blocked or incomplete
        if (!locationData.ip || !locationData.city) {
          try {
            const fallbackRes = await fetch('https://ipapi.co/json/');
            if (fallbackRes.ok) {
              const fb = await fallbackRes.json();
              locationData = {
                ip: fb.ip || locationData.ip,
                type: fb.version || locationData.type || 'IPv4',
                continent: fb.continent_code || locationData.continent,
                continentCode: fb.continent_code || locationData.continentCode,
                country: fb.country_name || fb.country || locationData.country,
                countryCode: fb.country_code || locationData.countryCode,
                capital: fb.country_capital || locationData.capital,
                region: fb.region || locationData.region,
                regionCode: fb.region_code || locationData.regionCode,
                city: fb.city || locationData.city,
                postal: fb.postal || locationData.postal,
                latitude: fb.latitude ?? locationData.latitude,
                longitude: fb.longitude ?? locationData.longitude,
                googleMapsUrl: (fb.latitude !== undefined && fb.longitude !== undefined)
                  ? `https://www.google.com/maps?q=${fb.latitude},${fb.longitude}`
                  : locationData.googleMapsUrl,
                callingCode: fb.country_calling_code || locationData.callingCode,
                isEu: fb.in_eu ?? locationData.isEu,
                asn: fb.asn || locationData.asn,
                org: fb.org || locationData.org,
                isp: fb.org || locationData.isp,
                network: fb.network || undefined,
                timezone: fb.timezone || locationData.timezone,
                utcOffset: fb.utc_offset || locationData.utcOffset,
                currency: fb.currency ? `${fb.currency_name || fb.currency} (${fb.currency})` : locationData.currency
              };
            }
          } catch {}
        }

        try {
          const gpu = getGpuInfo();
          const nav = (navigator || {}) as any;
          const conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};

          // 2. Collect High-Entropy User-Agent Client Hints (CPU Architecture, Bitness, OS Version, Device Model)
          let clientHints: Record<string, any> = {};
          if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === 'function') {
            try {
              clientHints = await nav.userAgentData.getHighEntropyValues([
                'architecture',
                'bitness',
                'model',
                'platform',
                'platformVersion',
                'fullVersionList'
              ]);
            } catch {}
          }

          // 3. Collect Battery Telemetry
          let batteryInfo: Record<string, any> | undefined;
          if (typeof nav.getBattery === 'function') {
            try {
              const bat = await nav.getBattery();
              batteryInfo = {
                level: `${Math.round((bat.level || 0) * 100)}%`,
                charging: bat.charging ? 'Yes (AC/Charging)' : 'No (On Battery)'
              };
            } catch {}
          }

          // 4. Collect Browser Storage Quota Estimate
          let storageInfo: Record<string, any> | undefined;
          if (nav.storage && typeof nav.storage.estimate === 'function') {
            try {
              const est = await nav.storage.estimate();
              storageInfo = {
                usageMb: est.usage ? Math.round(est.usage / (1024 * 1024)) : 0,
                quotaGb: est.quota ? (est.quota / (1024 * 1024 * 1024)).toFixed(1) : undefined
              };
            } catch {}
          }

          // 5. Collect Media Peripheral Counts (without requesting permissions)
          let mediaInfo: Record<string, any> | undefined;
          if (nav.mediaDevices && typeof nav.mediaDevices.enumerateDevices === 'function') {
            try {
              const devices = await nav.mediaDevices.enumerateDevices();
              mediaInfo = {
                audioInputs: devices.filter((d: any) => d.kind === 'audioinput').length,
                videoInputs: devices.filter((d: any) => d.kind === 'videoinput').length,
                audioOutputs: devices.filter((d: any) => d.kind === 'audiooutput').length
              };
            } catch {}
          }

          // 6. Collect Navigation & Network Timing Metrics
          let perfMetrics: Record<string, any> | undefined;
          try {
            const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
            if (navEntries && navEntries.length > 0) {
              const n = navEntries[0];
              perfMetrics = {
                dnsMs: Math.max(0, Math.round(n.domainLookupEnd - n.domainLookupStart)),
                tcpMs: Math.max(0, Math.round(n.connectEnd - n.connectStart)),
                tlsMs: n.secureConnectionStart > 0 ? Math.max(0, Math.round(n.connectEnd - n.secureConnectionStart)) : 0,
                ttfbMs: Math.max(0, Math.round(n.responseStart - n.requestStart))
              };
            }
          } catch {}

          let resolvedTimezone = 'UTC';
          try {
            resolvedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          } catch {}

          const payload = {
            location: locationData,
            screen: {
              width: window?.screen?.width || 0,
              height: window?.screen?.height || 0,
              availWidth: window?.screen?.availWidth || 0,
              availHeight: window?.screen?.availHeight || 0,
              innerWidth: window?.innerWidth || 0,
              innerHeight: window?.innerHeight || 0,
              colorDepth: window?.screen?.colorDepth || 0,
              pixelRatio: window?.devicePixelRatio || 1,
              orientation: window?.screen?.orientation?.type || (window?.innerWidth > window?.innerHeight ? 'landscape' : 'portrait'),
              colorScheme: window?.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'Dark Mode' : 'Light Mode',
              hdr: window?.matchMedia?.('(dynamic-range: high)').matches ? 'HDR Supported' : 'SDR Standard'
            },
            device: {
              memory: nav.deviceMemory || 'Unknown',
              cpuCores: nav.hardwareConcurrency || 'Unknown',
              platform: clientHints.platform || nav.userAgentData?.platform || nav.platform || 'Unknown',
              platformVersion: clientHints.platformVersion || undefined,
              architecture: clientHints.architecture || undefined,
              bitness: clientHints.bitness || undefined,
              model: clientHints.model || undefined,
              isMobile: nav.userAgentData?.mobile ?? /Mobi|Android|iPhone|iPad/i.test(nav.userAgent || ''),
              vendor: nav.vendor || 'Unknown',
              maxTouchPoints: nav.maxTouchPoints || 0,
              language: nav.language || 'en-US',
              languages: nav.languages?.join(', ') || 'Unknown',
              doNotTrack: nav.doNotTrack || 'Unknown',
              cookiesEnabled: nav.cookieEnabled ?? true,
              pdfViewerEnabled: nav.pdfViewerEnabled ?? true,
              webdriver: !!nav.webdriver,
              gpu
            },
            battery: batteryInfo,
            storage: storageInfo,
            media: mediaInfo,
            performance: perfMetrics,
            context: {
              referrer: document.referrer || 'Direct Entry',
              href: window?.location?.href || 'Unknown',
              timezone: locationData.timezone || resolvedTimezone,
              localTime: new Date().toString(),
              historyLength: window?.history?.length || 1,
              navType: (performance?.getEntriesByType?.('navigation')?.[0] as any)?.type || 'navigate',
              connection: {
                type: conn.effectiveType || 'Unknown',
                downlink: conn.downlink || 0,
                rtt: conn.rtt || 0,
                saveData: !!conn.saveData
              }
            }
          };

          const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
          const isStaticHost = window.location.hostname.endsWith('github.io') || window.location.hostname.includes('pages.dev');
          const locLabel = [locationData.city, locationData.region, locationData.country].filter(Boolean).join(', ') || locationData.ip || 'Visitor';

          let sentSuccessfully = false;

          // Primary Channel: Try Node.js /api/access-alert (Resend) when not on a pure static host
          if (!isStaticHost) {
            try {
              const apiRes = await fetch('/api/access-alert', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
              });
              const ct = apiRes.headers.get('content-type') || '';
              if (apiRes.ok && ct.includes('application/json')) {
                const resJson = await apiRes.json();
                if (resJson && resJson.success) {
                  sentSuccessfully = true;
                }
              }
            } catch {}
          }

          // Fallback Channel: If on GitHub Pages / static host (or if backend Resend was unavailable) and Formspree is configured
          if (!sentSuccessfully && formspreeId) {
            const fsRes = await fetch(`https://formspree.io/f/${formspreeId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                _subject: `[DETAILED ACCESS ALERT] ${locLabel} (${locationData.ip || 'Unknown IP'})`,
                locationSummary: `${locLabel} | IP: ${locationData.ip || 'Unknown'} | ISP: ${locationData.isp || locationData.org || 'Unknown'} (${locationData.asn || 'N/A'}) | Postal: ${locationData.postal || 'N/A'} | Coords: ${locationData.latitude ?? 'N/A'}, ${locationData.longitude ?? 'N/A'}`,
                googleMapsPin: locationData.googleMapsUrl || 'Unavailable',
                ...payload
              })
            });
            if (fsRes.ok) {
              sentSuccessfully = true;
            }
          }

          if (sentSuccessfully) {
            try {
              sessionStorage.setItem('executive_portfolio_access_alert_sent', 'true');
            } catch {}
          }
        } catch (telemetryErr) {
          console.warn('Telemetry transmission restricted.');
        }
      };

      dispatchDetailedAccessAlert();
    }
  }, []);

  // Sync active section based on scroll position in scroll container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const totalScroll = container.scrollHeight - container.clientHeight;
      if (totalScroll > 0) {
        setScrollProgress(container.scrollTop / totalScroll);
      }

      if (isTransitioningRef.current) return;
      const scrollPosition = container.scrollTop + container.clientHeight / 2;

      for (const section of SECTIONS) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Wheel interception for discrete page-down / page-up navigation stops
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use a ref to store the last scroll time to prevent rapid-fire switching
    let lastScrollTime = 0;
    const SCROLL_COOLDOWN = 600; // ms

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if modifier keys are pressed or modals are open
      if (e.ctrlKey || e.metaKey || e.altKey || contactOpen || interfaceModalOpen) return;

      const now = Date.now();
      if (now - lastScrollTime < SCROLL_COOLDOWN) {
        if (isTransitioningRef.current) e.preventDefault();
        return;
      }

      // Check if event originated inside a scrollable sub-element or an interactive control
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'SELECT' || target?.closest('.no-scroll-hijack')) {
        return;
      }

      const scrollableChild = target?.closest('.overflow-y-auto, .overflow-auto') as HTMLElement | null;

      if (scrollableChild) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableChild;
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;

        // If inner element can scroll further in that direction, let it scroll naturally
        if (isScrollingDown && scrollTop + clientHeight < scrollHeight - 5) {
          return;
        }
        if (isScrollingUp && scrollTop > 5) {
          return;
        }
      }

      // If already animating, prevent standard jump
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      // Threshold check for wheel intensity - lowered to 15 for better sensitivity
      if (Math.abs(e.deltaY) > 15) {
        e.preventDefault();
        lastScrollTime = now;
        if (e.deltaY > 0) {
          handleNextPage();
        } else {
          handlePrevPage();
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    // Also listen on the document to capture scroll events even when mouse is over sidebar or other non-container areas
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [handleNextPage, handlePrevPage]);

  // Keyboard navigation for page-down / page-up / arrow keys / space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea, or if modals are open
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        contactOpen ||
        interfaceModalOpen
      ) {
        return;
      }

      if (e.key === 'PageDown' || e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey)) {
        // Special check: if Alt is held, allow browser default behaviors if any
        if (e.altKey) return;
        
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey)) {
        if (e.altKey) return;
        
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateToIndex(SECTIONS.length - 1);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, navigateToIndex, handleToggleSidebar]);

  // Security: Content protection removed per user request to allow copying/cutting/selecting
  useEffect(() => {
    // Keep standard browser behavior for contextmenu, copy, cut, drag, and save/view source
  }, []);

  // Touch swipe support for mobile stops
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartYRef.current - touchEndY;

    // Check if swipe distance is significant (> 45px)
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    touchStartYRef.current = null;
  };

  // Apply dynamic accent color variables and font families to document root
  useEffect(() => {
    const root = document.documentElement;
    if (accent === 'skyblue') { // Radiant Sky Blue
      root.style.setProperty('--accent-color', '#38bdf8');
      root.style.setProperty('--accent-hover', '#0ea5e9');
      root.style.setProperty('--accent-bg', '#f0f9ff');
      root.style.setProperty('--accent-border', '#bae6fd');
      root.style.setProperty('--accent-text', '#0284c7');
    } else if (accent === 'navy') { // Imperial Navy Blue
      root.style.setProperty('--accent-color', '#2563eb');
      root.style.setProperty('--accent-hover', '#1e40af');
      root.style.setProperty('--accent-bg', '#eff6ff');
      root.style.setProperty('--accent-border', '#93c5fd');
      root.style.setProperty('--accent-text', '#1e3a8a');
    } else if (accent === 'emerald') { // Executive Mint
      root.style.setProperty('--accent-color', '#34d399');
      root.style.setProperty('--accent-hover', '#10b981');
      root.style.setProperty('--accent-bg', '#ecfdf5');
      root.style.setProperty('--accent-border', '#a7f3d0');
      root.style.setProperty('--accent-text', '#059669');
    } else if (accent === 'violet') { // Soft Lavender
      root.style.setProperty('--accent-color', '#a78bfa');
      root.style.setProperty('--accent-hover', '#8b5cf6');
      root.style.setProperty('--accent-bg', '#f5f3ff');
      root.style.setProperty('--accent-border', '#ddd6fe');
      root.style.setProperty('--accent-text', '#7c3aed');
    } else if (accent === 'amber') { // Bright Brick Red
      root.style.setProperty('--accent-color', '#ef4444');
      root.style.setProperty('--accent-hover', '#dc2626');
      root.style.setProperty('--accent-bg', '#fef2f2');
      root.style.setProperty('--accent-border', '#fecaca');
      root.style.setProperty('--accent-text', '#b91c1c');
    } else if (accent === 'rose') { // Soft Rose Gold (1 shade lighter)
      root.style.setProperty('--accent-color', '#fda4af');
      root.style.setProperty('--accent-hover', '#fb7185');
      root.style.setProperty('--accent-bg', '#fff1f2');
      root.style.setProperty('--accent-border', '#fecdd3');
      root.style.setProperty('--accent-text', '#e11d48');
    } else if (accent === 'cyan') { // Sky Cyan
      root.style.setProperty('--accent-color', '#38bdf8');
      root.style.setProperty('--accent-hover', '#0ea5e9');
      root.style.setProperty('--accent-bg', '#f0f9ff');
      root.style.setProperty('--accent-border', '#bae6fd');
      root.style.setProperty('--accent-text', '#0284c7');
    } else if (accent === 'copper') { // Bottle Green
      root.style.setProperty('--accent-color', '#065f46');
      root.style.setProperty('--accent-hover', '#064e3b');
      root.style.setProperty('--accent-bg', '#ecfdf5');
      root.style.setProperty('--accent-border', '#6ee7b7');
      root.style.setProperty('--accent-text', '#047857');
    } else if (accent === 'platinum') { // Silver Titanium
      root.style.setProperty('--accent-color', '#94a3b8');
      root.style.setProperty('--accent-hover', '#64748b');
      root.style.setProperty('--accent-bg', '#f8fafc');
      root.style.setProperty('--accent-border', '#e2e8f0');
      root.style.setProperty('--accent-text', '#475569');
    } else { // Sapphire Blue default
      root.style.setProperty('--accent-color', '#0f52ba');
      root.style.setProperty('--accent-hover', '#0d47a1');
      root.style.setProperty('--accent-bg', '#eff6ff');
      root.style.setProperty('--accent-border', '#93c5fd');
      root.style.setProperty('--accent-text', '#0f52ba');
    }
  }, [accent]);

  // Auto-collapse customizer modal after 30 seconds
  useEffect(() => {
    if (!interfaceModalOpen) return;

    const timer = setTimeout(() => {
      setInterfaceModalOpen(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, [interfaceModalOpen]);

  // Compute theme background & text styles
  const getThemeClass = () => {
    switch (theme) {
      case 'apple-light':
        return 'bg-[#fcfcfd] text-zinc-900';
      case 'solarized':
        return 'bg-[#fbf7ee] text-zinc-900';
      case 'emerald-matrix':
        return 'bg-[#041210] text-[#a7f3d0]';
      case 'obsidian':
        return 'bg-[#06030d] text-[#e2d9fc]';
      case 'terminal':
        return 'bg-black text-[#00ff66] font-mono';
      case 'apple-dark':
      default:
        return 'bg-[#000000] text-[#f5f5f7]';
    }
  };

  const getFontClass = () => {
    if (customFontFamily) return '';
    switch (font) {
      case 'jakarta':
        return 'font-["Plus_Jakarta_Sans",sans-serif]';
      case 'outfit':
        return 'font-["Outfit",sans-serif]';
      case 'serif':
        return 'font-["Playfair_Display",serif]';
      case 'mono':
        return 'font-["JetBrains_Mono",monospace]';
      case 'inter':
      default:
        return 'font-["Inter",sans-serif]';
    }
  };

  const getActiveFontFamilyCSS = () => {
    if (customFontFamily) return customFontFamily;
    switch (font) {
      case 'jakarta':
        return '"Plus Jakarta Sans", sans-serif';
      case 'outfit':
        return '"Outfit", sans-serif';
      case 'serif':
        return '"Playfair Display", Georgia, serif';
      case 'mono':
        return '"JetBrains Mono", monospace';
      case 'inter':
      default:
        return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    }
  };

  const isLight = theme === 'apple-light' || theme === 'solarized';

  if (isDenied) {
    return (
      <DenyListBlockScreen 
        clientIp={clientIp} 
        reason={denyReason} 
        identifier={user?.email || undefined} 
      />
    );
  }

  const activeFontVal = getActiveFontFamilyCSS();

  return (
    <div 
      style={{ 
        fontFamily: activeFontVal,
        '--active-font-family': activeFontVal 
      } as React.CSSProperties}
      className={`h-screen w-screen overflow-hidden transition-colors duration-500 theme-${theme} accent-${accent} ${getThemeClass()}`}
    >
      <Navbar
        onOpenContact={() => setContactOpen(true)}
        onOpenInterfaceOptions={() => setInterfaceModalOpen(true)}
        onOpenSuperAdmin={() => setSuperAdminOpen(true)}
        activeSection={activeSection}
        theme={theme}
        onNavigate={(id) => navigateToSection(id as SectionId)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      
      {/* Main Snap Scroll Container */}
      <div 
        ref={containerRef}
        id="main-scroll-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (interfaceModalOpen) setInterfaceModalOpen(false);
        }}
        style={{ marginLeft: isSidebarCollapsed ? '72px' : '295px' }}
        className="h-screen overflow-y-auto scroll-container select-text transition-[margin] duration-300 ease-in-out relative"
      >
        <StatusBanner theme={theme} />
        
        {/* Atmospheric Top Scroll Progress Bar */}
        <div className="sticky top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-transparent overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-100 ease-out shadow-[0_0_16px_rgba(59,130,246,0.8)]"
            style={{ width: `${scrollProgress * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-12 bg-white/40 blur-sm transition-all duration-100 ease-out -translate-y-1/2"
            style={{ left: `calc(${scrollProgress * 100}% - 24px)` }}
          />
        </div>

        <main className="w-full">
          {/* Stop 1: Overview */}
          <SnapSection id="overview">
            <Hero 
              onOpenContact={() => setContactOpen(true)} 
              onExploreBlog={() => navigateToSection('blog')} 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 2: Executive Bio */}
          <SnapSection id="bio">
            <ExecutiveBio 
              theme={theme} 
              onNextPage={handleNextPage}
            />
          </SnapSection>

          {/* Stop 3: Core Technical Competencies */}
          <SnapSection id="competencies">
            <CoreCompetencies 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 4: Career Journey */}
          <SnapSection id="career">
            <CareerJourney 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 5: Case Studies (Projects) */}
          <SnapSection id="projects">
            <Projects 
              theme={theme} 
            />
          </SnapSection>
          
          {/* Stop 6: Technical Blog */}
          <SnapSection id="blog">
            <TechnicalBlog 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 7: Off Keyboard */}
          <SnapSection id="offkeyboard">
            <OffKeyboard 
              theme={theme} 
            />
          </SnapSection>

          {/* Stop 8: Philosophy */}
          <SnapSection id="philosophy">
            <Philosophy 
              theme={theme} 
              onNavigate={(id) => navigateToSection(id as SectionId)}
            />
          </SnapSection>
          
          {/* Stop 9: Archives & Patents + Integrated Footer */}
          <SnapSection id="archive">
            <Archive 
              theme={theme} 
              onOpenContact={() => setContactOpen(true)}
              onScrollToTop={() => navigateToIndex(0)}
            />
          </SnapSection>
        </main>
      </div>

      {/* Floating Page Stop Navigation Controller & Indicator */}
      <div className="fixed bottom-3 sm:bottom-3.5 right-3.5 sm:right-4 z-40 flex items-center">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
          isLight ? 'bg-white/90 border-zinc-200 text-zinc-900 shadow-zinc-200/50' : 'bg-zinc-950/80 border-white/15 text-white shadow-black/80'
        }`}>
          {/* Stop Dots */}
          <div className="hidden sm:flex items-center gap-1 px-0.5">
            {SECTIONS.map((sec, idx) => (
              <button
                key={sec}
                onClick={() => navigateToIndex(idx)}
                title={`Jump to ${SECTION_LABELS[sec]}`}
                className={`transition-all rounded-full ${
                  activeSection === sec
                    ? 'w-3.5 h-1.5 bg-blue-500'
                    : `w-1.5 h-1.5 ${isLight ? 'bg-zinc-300 hover:bg-zinc-500' : 'bg-white/25 hover:bg-white/50'}`
                }`}
              />
            ))}
          </div>

          <div className={`hidden sm:block h-3 w-[1px] ${isLight ? 'bg-zinc-200' : 'bg-white/15'}`} />

          {/* Current Stop Number */}
          <div className="flex items-center gap-1 text-xs font-semibold px-0.5">
            <span className="font-mono text-blue-500 tabular-nums">{activeIndex + 1}</span>
            <span className="text-[10px] opacity-40">/</span>
            <span className="text-[10px] opacity-60 font-mono">{SECTIONS.length}</span>
          </div>

          {/* Page Up / Page Down Action Buttons */}
          <div className="flex items-center gap-0.5 pl-0.5">
            <button
              onClick={handlePrevPage}
              disabled={activeIndex === 0}
              title="Page Up / Previous Stop (↑ or PgUp)"
              className={`p-0.5 rounded-full border transition-all ${
                activeIndex === 0
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : (isLight ? 'hover:bg-zinc-100 border-zinc-200 active:scale-95' : 'hover:bg-white/10 border-white/10 active:scale-95')
              }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={activeIndex === SECTIONS.length - 1}
              title="Page Down / Next Stop (↓ or PgDn)"
              className={`p-0.5 rounded-full border transition-all ${
                activeIndex === SECTIONS.length - 1
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : (isLight ? 'hover:bg-zinc-100 border-zinc-200 active:scale-95' : 'hover:bg-white/10 border-white/10 active:scale-95')
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8-Hour Search Partner Link Expiration Warning */}
      {jwtExpiredAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] bg-red-950/95 border border-red-500/50 text-red-200 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-white block mb-0.5">Time-Bound Search Partner Link Expired</span>
            <p className="leading-relaxed text-red-300">{jwtExpiredAlert}</p>
          </div>
          <button 
            type="button"
            onClick={dismissJwtAlert}
            className="p-1 text-red-400 hover:text-white rounded-lg hover:bg-red-900/50 transition-colors cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Secure 2-Hour JWT Active Session Indicator */}
      {jwtSessionInfo?.active && (
        <div className="fixed top-3.5 left-4 sm:left-auto sm:right-28 z-40 max-w-md flex flex-col gap-1 px-3.5 py-2 rounded-2xl bg-blue-950/90 border border-blue-500/40 text-blue-200 shadow-2xl backdrop-blur-md text-[11px] font-mono">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-white">Partner Access ({jwtSessionInfo.hoursRemaining ?? 2}h left)</span>
            </div>
            <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 font-bold border border-blue-400/30">JWT 2-Hour</span>
          </div>
          <p className="text-[10px] text-blue-300 leading-tight">
            Note: Current session is valid for 2 hours (up to 4 hours maximum) and will auto expire. Access needs to be requested again after expiration.
          </p>
        </div>
      )}

      <ContactModal theme={theme} isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <GateModal />
      <ExecutiveVaultGateModal
        isOpen={vaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
        targetRoadmap={targetRoadmap}
        onUnlocked={() => {
          if (targetRoadmap?.action) {
            targetRoadmap.action();
          }
        }}
      />
      <InterfaceOptionsModal
        isOpen={interfaceModalOpen}
        onClose={() => setInterfaceModalOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        currentAccent={accent}
        onAccentChange={setAccent}
        currentFont={font}
        onFontChange={(f) => { setFont(f); setCustomFontFamily(null); }}
        onOpenFontShowcase={() => {
          setInterfaceModalOpen(false);
          setFontsShowcaseOpen(true);
        }}
      />
      <ExecutiveFontsShowcaseModal
        isOpen={fontsShowcaseOpen}
        onClose={() => setFontsShowcaseOpen(false)}
        currentFont={customFontFamily || font}
        onSelectFont={(fontFamily) => {
          setCustomFontFamily(fontFamily);
          setFontsShowcaseOpen(false);
        }}
      />
      <SuperAdminConsoleModal
        isOpen={superAdminOpen}
        onClose={() => setSuperAdminOpen(false)}
        theme={theme}
      />
    </div>
  );
}
