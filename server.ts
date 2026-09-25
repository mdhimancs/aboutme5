import express from "express";
import path from "path";
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
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://accounts.google.com",
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
      return res.status(500).json({ error: "Email service not configured" });
    }

    const clientIp = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { screen, device, context } = req.body;

    const formatGpu = (gpu: any) => {
      if (!gpu || typeof gpu !== 'object') return 'Unknown';
      return `${gpu.vendor} | ${gpu.renderer}`;
    };

    const formatConn = (conn: any) => {
      if (!conn || typeof conn !== 'object') return 'Unknown';
      return `${conn.type || 'N/A'} (DL: ${conn.downlink || 'N/A'} Mbps, RTT: ${conn.rtt || 'N/A'} ms)`;
    };

    try {
      await resend.emails.send({
        from: 'Access Alert <onboarding@resend.dev>',
        to: ['munish.world@gmail.com'],
        subject: `[DETAILED ACCESS ALERT] New Visit from ${clientIp}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #eee; padding-bottom: 10px;">Executive Portfolio: Detailed Access Alert</h2>
            <p>A new visitor session has been initiated with high-fidelity telemetry.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 35%;">IP Address</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${clientIp}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Timestamp (UTC)</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${new Date().toISOString()}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Location/Timezone</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${context?.timezone || 'Unknown'}</td>
              </tr>
            </table>

            <h3 style="color: #475569; margin-top: 25px;">Device & Hardware</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Platform / OS</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${device?.platform || 'Unknown'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">CPU Cores</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${device?.cpuCores || 'Unknown'} logical cores</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Device Memory</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">~${device?.memory || 'Unknown'} GB RAM</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">GPU Architecture</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatGpu(device?.gpu)}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Touch Support</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${device?.maxTouchPoints > 0 ? `Yes (${device.maxTouchPoints} pts)` : 'No'}</td>
              </tr>
            </table>

            <h3 style="color: #475569; margin-top: 25px;">Display & Browser</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Resolution</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${screen?.width}x${screen?.height} (@${screen?.pixelRatio}x)</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Viewport Size</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${screen?.availWidth}x${screen?.availHeight}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Language(s)</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">Primary: ${device?.language} <br/> <small>${device?.languages}</small></td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">User Agent</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px; font-family: monospace;">${userAgent}</td>
              </tr>
            </table>

            <h3 style="color: #475569; margin-top: 25px;">Network & Context</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Connection Type</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatConn(context?.connection)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Referrer</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0;">${context?.referrer || 'Direct Entry'}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Landing URL</td>
                <td style="padding: 8px; border: 1px solid #e2e8f0; font-size: 11px;">${context?.href || 'Unknown'}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 15px; background: #f1f5f9; border-radius: 8px; font-size: 11px; color: #64748b;">
              <strong>Security Protocol:</strong> This alert is generated once per unique browser session. Telemetry is collected via standard Web APIs for executive situational awareness.
            </div>
          </div>
        `,
      });

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Access alert error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
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
      console.error("RESEND_API_KEY is not configured");
      return res.status(500).json({ error: "Email service not configured. Please add RESEND_API_KEY to environment variables." });
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
        console.error("Resend error:", error);
        return res.status(400).json({ error });
      }

      // Record successful transmission timestamp for rate limiting
      validTimestamps.push(now);
      emailRateLimitMap.set(clientIp, validTimestamps);

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Server error:", err);
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
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
