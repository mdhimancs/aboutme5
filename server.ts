import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Server-Level Content Security Policy mirroring index.html with frame-ancestors support
const CSP_HEADER_VALUE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://images.unsplash.com https://img.youtube.com https://*.google-analytics.com https://*.googletagmanager.com https://lh3.googleusercontent.com",
  "connect-src 'self' https://formspree.io https://ipapi.co https://ipwho.is https://api.ipify.org https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://accounts.google.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.firebaseapp.com https://accounts.google.com",
  "frame-ancestors 'self' https://ai.studio https://*.google.com https://*.run.app https://*.googleusercontent.com"
].join("; ");

// Server-side IP Rate Limiting State (5-minute rolling window)
const emailRateLimitMap = new Map<string, number[]>();
const EMAIL_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const EMAIL_MAX_REQUESTS_PER_WINDOW = 3;

// Dynamic IP Deny List State (Real-time Perimeter Blocking)
interface DenyRule {
  value: string;
  type: 'ip' | 'email' | 'domain';
  reason: string;
  active: boolean;
  addedAt: string;
}

const serverDenyList = new Map<string, DenyRule>();

function getClientIp(req: express.Request): string {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  return Array.isArray(rawIp) ? rawIp[0] : (typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1');
}

function isIpBlocked(ip: string): { blocked: boolean; reason?: string } {
  for (const [, rule] of serverDenyList.entries()) {
    if (!rule.active || rule.type !== 'ip') continue;
    const ruleVal = rule.value.trim();
    if (ruleVal === ip) {
      return { blocked: true, reason: rule.reason };
    }
    if (ruleVal.endsWith('*') && ip.startsWith(ruleVal.slice(0, -1))) {
      return { blocked: true, reason: rule.reason };
    }
  }
  return { blocked: false };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Origin obscurity: Disable framework signature
  app.disable('x-powered-by');

  // 1. Mandatory HTTP Security Headers (4_webSecurity.md & Section 4 of PROJECT_GUIDE.md)
  app.use((req, res, next) => {
    // Defend against MIME-type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Clickjacking defense (modern browsers prioritize CSP frame-ancestors)
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Strict referrer privacy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Restrict unnecessary browser sensors and device APIs
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Enforce TLS/HTTPS protocol integrity
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Server-level Content Security Policy
    res.setHeader('Content-Security-Policy', CSP_HEADER_VALUE);
    
    next();
  });

  app.use(express.json());

  // Traffic Logger Middleware (Operational Intelligence PoC)
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'];

    console.log(`[TRAFFIC] ${timestamp} | ${ip} | ${method} ${url} | ${userAgent}`);
    next();
  });

  // Dynamic Perimeter IP Deny List Enforcement Middleware
  app.use("/api", (req, res, next) => {
    // Exempt info & sync endpoints from interception
    if (req.path === "/client-info" || req.path === "/denylist/sync" || req.path === "/denylist/status") {
      return next();
    }
    const ip = getClientIp(req);
    const check = isIpBlocked(ip);
    if (check.blocked) {
      console.warn(`[DENY-LIST-BLOCKED] Perimeter request rejected for IP: ${ip}, reason: ${check.reason}`);
      return res.status(403).json({
        error: "Access Denied: Network address restricted by dynamic perimeter security deny list.",
        code: "PERIMETER_IP_BLOCKED",
        clientIp: ip,
        reason: check.reason
      });
    }
    next();
  });

  // Client Info Endpoint (IP detection for Dynamic Deny List)
  app.get("/api/client-info", (req, res) => {
    const clientIp = getClientIp(req);
    res.json({
      ip: clientIp,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown'
    });
  });

  // Deny List Synchronization Endpoint (Called by admin & real-time snapshot)
  app.post("/api/denylist/sync", (req, res) => {
    const { entries } = req.body;
    if (Array.isArray(entries)) {
      serverDenyList.clear();
      for (const item of entries) {
        if (item.value && item.active !== false) {
          serverDenyList.set(item.value, {
            value: item.value,
            type: item.type || 'ip',
            reason: item.reason || 'Dynamic security block',
            active: item.active !== false,
            addedAt: item.addedAt || new Date().toISOString()
          });
        }
      }
      return res.json({ success: true, activeCount: serverDenyList.size });
    }
    return res.status(400).json({ error: "Invalid payload: expected 'entries' array." });
  });

  // Deny List Status Query Endpoint
  app.get("/api/denylist/status", (req, res) => {
    const ip = getClientIp(req);
    const check = isIpBlocked(ip);
    res.json({
      clientIp: ip,
      blocked: check.blocked,
      reason: check.reason || null,
      activeRulesCount: serverDenyList.size
    });
  });

  // API Route for sending access alerts on new visits
  app.post("/api/access-alert", async (req, res) => {
    if (!resend) {
      console.error("[ACCESS-ALERT] Error: RESEND_API_KEY is missing from environment variables.");
      return res.status(500).json({ error: "Email service not configured on server" });
    }

    const serverDetectedIp = getClientIp(req);
    const forwardedChain = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'].join(', ')
      : (req.headers['x-forwarded-for'] || 'None');
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const acceptLanguageHeader = req.headers['accept-language'] || 'Unknown';
    const secChUa = req.headers['sec-ch-ua'] || 'Not provided';
    const secChUaPlatform = req.headers['sec-ch-ua-platform'] || 'Not provided';
    const secChUaMobile = req.headers['sec-ch-ua-mobile'] || 'Not provided';

    // Extract Edge / Cloud Proxy Geolocation Headers (Cloud Run / Google App Engine / Cloudflare)
    const edgeCountry = (req.headers['x-appengine-country'] || req.headers['cf-ipcountry'] || '') as string;
    const edgeRegion = (req.headers['x-appengine-region'] || '') as string;
    const edgeCity = (req.headers['x-appengine-city'] || '') as string;
    const edgeLatLong = (req.headers['x-appengine-citylatlong'] || '') as string;

    const { screen, device, context, location: clientLocation, performance: perfMetrics, battery, storage, media } = req.body || {};

    // Determine primary public IP (prefer client-resolved public IP if server sees local/internal proxy)
    const isPrivateIp = (ip: string) =>
      !ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.');
    const targetIp = (clientLocation?.ip && !isPrivateIp(clientLocation.ip)) ? clientLocation.ip : serverDetectedIp;

    // Server-side Geolocation Enrichment Fallback if client location is missing or incomplete
    let geoData: Record<string, any> = clientLocation && typeof clientLocation === 'object' ? { ...clientLocation } : {};
    if ((!geoData.city || geoData.city === 'Unknown') && !isPrivateIp(targetIp)) {
      try {
        const geoRes = await fetch(`https://ipwho.is/${encodeURIComponent(targetIp)}`);
        if (geoRes.ok) {
          const gd = await geoRes.json();
          if (gd && gd.success !== false) {
            geoData = {
              ip: gd.ip || targetIp,
              type: gd.type || geoData.type || 'IPv4',
              continent: gd.continent || geoData.continent,
              continentCode: gd.continent_code || geoData.continentCode,
              country: gd.country || geoData.country,
              countryCode: gd.country_code || geoData.countryCode,
              capital: gd.capital || geoData.capital,
              region: gd.region || geoData.region,
              regionCode: gd.region_code || geoData.regionCode,
              city: gd.city || geoData.city,
              postal: gd.postal || geoData.postal,
              latitude: gd.latitude ?? geoData.latitude,
              longitude: gd.longitude ?? geoData.longitude,
              callingCode: gd.calling_code ? `+${gd.calling_code}` : geoData.callingCode,
              isEu: gd.is_eu ?? geoData.isEu,
              asn: gd.connection?.asn ? `AS${gd.connection.asn}` : geoData.asn,
              org: gd.connection?.org || geoData.org,
              isp: gd.connection?.isp || geoData.isp,
              domain: gd.connection?.domain || geoData.domain,
              timezone: gd.timezone?.id || geoData.timezone,
              utcOffset: gd.timezone?.utc || geoData.utcOffset,
              localTime: gd.timezone?.current_time || geoData.localTime,
              currency: gd.currency ? `${gd.currency.name} (${gd.currency.code} ${gd.currency.symbol || ''})` : geoData.currency
            };
          }
        }
      } catch (geoErr) {
        console.warn("[ACCESS-ALERT] Server geo-enrichment fallback warning:", geoErr);
      }
    }

    // Merge Edge headers if still missing
    const resolvedCity = geoData.city || edgeCity || 'Unknown';
    const resolvedRegion = geoData.region || edgeRegion || 'Unknown';
    const resolvedRegionCode = geoData.regionCode || '';
    const resolvedCountry = geoData.country || edgeCountry || 'Unknown';
    const resolvedCountryCode = geoData.countryCode || edgeCountry || '';
    const resolvedContinent = geoData.continent ? `${geoData.continent} (${geoData.continentCode || ''})` : 'Unknown';
    const resolvedPostal = geoData.postal || 'Unknown';
    const resolvedLat = geoData.latitude ?? (edgeLatLong ? edgeLatLong.split(',')[0] : null);
    const resolvedLng = geoData.longitude ?? (edgeLatLong ? edgeLatLong.split(',')[1] : null);
    const coordinatesStr = (resolvedLat !== null && resolvedLng !== null && resolvedLat !== undefined && resolvedLng !== undefined)
      ? `${resolvedLat}, ${resolvedLng}`
      : 'Unavailable';
    const googleMapsUrl = (resolvedLat !== null && resolvedLng !== null && resolvedLat !== undefined && resolvedLng !== undefined)
      ? `https://www.google.com/maps?q=${encodeURIComponent(`${resolvedLat},${resolvedLng}`)}`
      : null;

    const formatGpu = (gpu: any) => {
      if (!gpu || typeof gpu !== 'object') return 'Unknown';
      return `${gpu.vendor || 'Unknown'} | ${gpu.renderer || 'Unknown'}${gpu.webglVersion ? ` (${gpu.webglVersion})` : ''}`;
    };

    const formatConn = (conn: any) => {
      if (!conn || typeof conn !== 'object') return 'Unknown';
      return `${conn.type || 'N/A'} (Downlink: ${conn.downlink ?? 'N/A'} Mbps, RTT: ${conn.rtt ?? 'N/A'} ms, SaveData: ${conn.saveData ? 'Yes' : 'No'})`;
    };

    const locationSummary = [resolvedCity, resolvedRegion, resolvedCountry].filter(v => v && v !== 'Unknown').join(', ') || 'Unknown Location';

    try {
      console.log(`[ACCESS-ALERT] Attempting to send alert for IP: ${targetIp} (${locationSummary})`);
      const { data, error } = await resend.emails.send({
        from: 'Access Alert <onboarding@resend.dev>',
        to: ['munish.world@gmail.com'],
        subject: `[DETAILED ACCESS ALERT] ${locationSummary} (${targetIp})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 680px; line-height: 1.5;">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #93c5fd; font-weight: 700;">Executive Situational Awareness</div>
              <h2 style="margin: 6px 0 4px; font-size: 20px; font-weight: 800;">New Visitor Access Telemetry</h2>
              <div style="font-size: 13px; color: #e2e8f0;">Origin: <strong>${locationSummary}</strong> • IP: <span style="font-family: monospace; background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 4px;">${targetIp}</span></div>
            </div>

            <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; background: #ffffff;">
              <h3 style="color: #1d4ed8; margin-top: 4px; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #dbeafe; padding-bottom: 6px;">1. Geographic & Location Intelligence</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700; width: 36%;">Public IP Address</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: 700; color: #0f172a;">${targetIp} (${geoData.type || 'IPv4/v6'})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Server / Proxy Chain IP</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 12px;">Socket: ${serverDetectedIp} | X-Forwarded-For: ${forwardedChain}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">City</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 600;">${resolvedCity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Region / State</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${resolvedRegion}${resolvedRegionCode ? ` (${resolvedRegionCode})` : ''}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Country & Continent</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${resolvedCountry}${resolvedCountryCode ? ` [${resolvedCountryCode}]` : ''} • ${resolvedContinent}${geoData.capital ? ` (Capital: ${geoData.capital})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Postal / ZIP Code</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-family: monospace;">${resolvedPostal}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">GPS Coordinates (Lat, Lng)</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-family: monospace;">
                    ${coordinatesStr}
                    ${googleMapsUrl ? ` — <a href="${googleMapsUrl}" target="_blank" style="color: #2563eb; font-weight: 700; text-decoration: underline;">View on Google Maps ↗</a>` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Timezone & UTC Offset</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${geoData.timezone || context?.timezone || 'Unknown'}${geoData.utcOffset ? ` (UTC ${geoData.utcOffset})` : ''}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Visitor Local Time / UTC</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Local: ${context?.localTime || geoData.localTime || 'Unknown'} <br/><small style="color: #64748b;">UTC: ${new Date().toISOString()}</small></td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Calling Code & Currency</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Dial: ${geoData.callingCode || 'N/A'} • Currency: ${geoData.currency || 'N/A'} • EU Member: ${geoData.isEu !== undefined ? (geoData.isEu ? 'Yes' : 'No') : 'N/A'}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Edge / Cloud Geo Headers</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-size: 12px;">Country: ${edgeCountry || 'N/A'} | Region: ${edgeRegion || 'N/A'} | City: ${edgeCity || 'N/A'} | Coords: ${edgeLatLong || 'N/A'}</td>
                </tr>
              </table>

              <h3 style="color: #1d4ed8; margin-top: 24px; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #dbeafe; padding-bottom: 6px;">2. Network, ISP & Autonomous System (ASN)</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700; width: 36%;">ISP / Carrier</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 600;">${geoData.isp || geoData.org || 'Unknown'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Organization & Domain</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${geoData.org || 'Unknown'}${geoData.domain ? ` (${geoData.domain})` : ''}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Autonomous System (ASN)</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-family: monospace;">${geoData.asn || 'Unknown'}${geoData.network ? ` • CIDR: ${geoData.network}` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Connection Telemetry</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${formatConn(context?.connection)}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Page Load & Network Latency</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">DNS: ${perfMetrics?.dnsMs ?? 'N/A'} ms | TCP: ${perfMetrics?.tcpMs ?? 'N/A'} ms | TLS: ${perfMetrics?.tlsMs ?? 'N/A'} ms | TTFB: ${perfMetrics?.ttfbMs ?? 'N/A'} ms</td>
                </tr>
              </table>

              <h3 style="color: #1d4ed8; margin-top: 24px; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #dbeafe; padding-bottom: 6px;">3. Device, Hardware & Power Posture</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700; width: 36%;">OS / Platform & Architecture</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${device?.platform || 'Unknown'} ${device?.architecture ? `(${device.architecture} ${device.bitness ? `${device.bitness}-bit` : ''})` : ''} ${device?.platformVersion ? `v${device.platformVersion}` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Device Model / Mobile Flag</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Model: ${device?.model || 'Desktop / Unspecified'} • Mobile: ${device?.isMobile !== undefined ? (device.isMobile ? 'Yes' : 'No') : secChUaMobile}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">CPU & System Memory</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${device?.cpuCores || 'Unknown'} Logical Cores • ~${device?.memory || 'Unknown'} GB RAM</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">GPU Architecture</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 12px;">${formatGpu(device?.gpu)}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Battery & Power State</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${battery ? `Level: ${battery.level ?? 'N/A'} • Charging: ${battery.charging ?? 'N/A'}` : 'Restricted / Desktop AC'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Storage & Media Peripherals</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Storage Quota: ${storage?.quotaGb ? `${storage.usageMb || 0} MB / ${storage.quotaGb} GB` : 'N/A'} • Media: ${media ? `${media.audioInputs ?? 0} Mic, ${media.videoInputs ?? 0} Cam, ${media.audioOutputs ?? 0} Out` : 'N/A'}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Touch Support</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">${device?.maxTouchPoints > 0 ? `Yes (${device.maxTouchPoints} touch points)` : 'No'}</td>
                </tr>
              </table>

              <h3 style="color: #1d4ed8; margin-top: 24px; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #dbeafe; padding-bottom: 6px;">4. Display, Browser & Session Context</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700; width: 36%;">Screen & Inner Viewport</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Screen: ${screen?.width}x${screen?.height} (Avail: ${screen?.availWidth}x${screen?.availHeight}) • Window: ${screen?.innerWidth || 'N/A'}x${screen?.innerHeight || 'N/A'} (@${screen?.pixelRatio}x DPR, ${screen?.colorDepth}-bit)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Orientation & Display Mode</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Orientation: ${screen?.orientation || 'Unknown'} • OS Theme: ${screen?.colorScheme || 'Unknown'} • HDR: ${screen?.hdr || 'Standard'}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Landing URL & Referrer</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-size: 12px;">URL: <strong>${context?.href || 'Unknown'}</strong><br/>Referrer: ${context?.referrer || 'Direct Entry'} (Nav: ${context?.navType || 'navigate'}, History: ${context?.historyLength ?? 1})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Locale & Languages</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">Primary: ${device?.language} | All: ${device?.languages} | Header: ${acceptLanguageHeader}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Privacy & Bot Indicators</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0;">WebDriver (Bot): <strong>${device?.webdriver ? 'DETECTED (True)' : 'False (Human)'}</strong> • DNT: ${device?.doNotTrack} • Cookies: ${device?.cookiesEnabled ?? 'Unknown'} • PDF Viewer: ${device?.pdfViewerEnabled ?? 'Unknown'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-weight: 700;">Client Hints & User Agent</td>
                  <td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-size: 11px; font-family: monospace;">UA: ${userAgent}<br/>CH-UA: ${secChUa} (${secChUaPlatform})</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px; color: #64748b;">
                <strong>Security Protocol:</strong> This high-density access dossier is generated once per unique browser session combining client-side sensors, multi-provider IP geolocation, and server edge headers.
              </div>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("[ACCESS-ALERT] Resend Error:", error);
        return res.status(400).json({ error });
      }

      console.log(`[ACCESS-ALERT] Success: Detailed access alert sent to munish.world@gmail.com`);
      res.status(200).json({ success: true, id: data?.id });
    } catch (err) {
      console.error("[ACCESS-ALERT] Server Exception:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      emailService: resend ? "configured" : "not-configured",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // API Route for sending emails with rate limiting
  app.post("/api/send-email", async (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const clientIp = Array.isArray(rawIp) ? rawIp[0] : (typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1');

    // Check rolling window IP rate limit
    const now = Date.now();
    const timestamps = emailRateLimitMap.get(clientIp) || [];
    const validTimestamps = timestamps.filter(t => now - t < EMAIL_LIMIT_WINDOW_MS);

    if (validTimestamps.length >= EMAIL_MAX_REQUESTS_PER_WINDOW) {
      const oldest = validTimestamps[0];
      const waitSeconds = Math.ceil((EMAIL_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
      res.setHeader('Retry-After', waitSeconds.toString());
      return res.status(429).json({
        error: `Transmission rate limit reached. Please wait ${Math.ceil(waitSeconds / 60)} minute(s) before sending another inquiry.`
      });
    }

    const { name, email, subject, message, cc } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!resend) {
      console.error("[SEND-EMAIL] Error: RESEND_API_KEY is not configured in env.");
      return res.status(500).json({ error: "Email service not configured on server. Please add RESEND_API_KEY." });
    }

    // Support multiple email addresses separated by ; or ,
    const emailList = String(email)
      .split(/[;,]/)
      .map((e: string) => e.trim())
      .filter(Boolean);

    const ccList = cc
      ? String(cc)
          .split(/[;,]/)
          .map((e: string) => e.trim())
          .filter(Boolean)
      : undefined;

    try {
      console.log(`[SEND-EMAIL] Attempting to send inquiry from ${name} (${emailList[0]})`);
      const { data, error } = await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['munish.world@gmail.com'], // The user's email from portfolioData
        cc: ccList && ccList.length > 0 ? ccList : undefined,
        replyTo: emailList.length === 1 ? emailList[0] : (emailList.length > 0 ? emailList : email),
        subject: `[Portfolio Inquiry] ${subject}`,
        html: `
          <h3>New Message from Portfolio</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email(s):</strong> ${emailList.join('; ')}</p>
          ${ccList && ccList.length > 0 ? `<p><strong>CC:</strong> ${ccList.join('; ')}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; padding: 10px; background: #f4f4f4; border-radius: 5px;">${message}</div>
        `,
      });

      if (error) {
        console.error("[SEND-EMAIL] Resend Error:", error);
        return res.status(400).json({ error });
      }

      console.log(`[SEND-EMAIL] Success: Email transmitted (ID: ${data?.id})`);
      // Record successful transmission timestamp for rate limiting
      validTimestamps.push(now);
      emailRateLimitMap.set(clientIp, validTimestamps);

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("[SEND-EMAIL] Server Exception:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Catch-all for any other unmatched API routes
  app.use(/^\/api\/.*/, (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Change to custom to manually handle index.html transformation
    });
    
    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      const url = req.originalUrl;
      try {
        // 1. Read index.html
        let template = await fs.promises.readFile(
          path.resolve(process.cwd(), 'index.html'),
          'utf-8'
        );

        // 2. Apply Vite HTML transforms.
        template = await vite.transformIndexHtml(url, template);

        // 3. Send the rendered HTML back.
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        // If an error is caught, let Vite fix the stack trace
        if (e instanceof Error) vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("CRITICAL: Server failed to start:", err);
  process.exit(1);
});
