# 4_webSecurity.md - Enterprise Web Security & Defense Specifications

This document outlines the defense-in-depth architecture, HTTP security headers, access gating policies, and anti-abuse safeguards implemented across the portfolio application.

---

## 1. Application Layer Security & Content Security Policy (CSP)

To defend against Cross-Site Scripting (XSS), data exfiltration, and malicious injection attacks, strict Content Security Policy directives are enforced at both the HTML entry point (`index.html`) and the HTTP server level (`server.ts`):

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://img.youtube.com https://*.google-analytics.com https://*.googletagmanager.com https://lh3.googleusercontent.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://accounts.google.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.firebaseapp.com https://accounts.google.com; frame-ancestors 'self' https://ai.studio https://*.google.com https://*.run.app https://*.googleusercontent.com;
```

---

## 2. Mandatory HTTP Security Headers

Configured globally in `server.ts`:

- **Strict-Transport-Security (HSTS)**:
  `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  Enforces modern browsers to communicate strictly over encrypted HTTPS protocols.
- **X-Content-Type-Options**:
  `X-Content-Type-Options: nosniff`
  Prevents MIME-type confusion attacks and executable script execution from image/text payloads.
- **X-Frame-Options**:
  `X-Frame-Options: SAMEORIGIN`
  Defends against UI redress attacks and clickjacking.
- **Referrer-Policy**:
  `Referrer-Policy: strict-origin-when-cross-origin`
  Guards sensitive query parameters and URL paths from leaking across third-party referrals.
- **Permissions-Policy**:
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  Explicitly blocks browser access to client hardware peripherals and location sensors.
- **Origin Obscurity**:
  `app.disable('x-powered-by')` strips software framework fingerprints from all HTTP response headers.

---

## 3. Anti-Abuse & Form Protection Mechanisms

### A. Invisible Form Honeypot
- An invisible, non-indexed input field (`name="honeypot"`) is present in `ContactModal.tsx`.
- Automated scraping bots and crawlers that blindly fill every DOM input field are detected and silently dropped before dispatching emails or triggering server API endpoints.

### B. Client-Side Submission Rate Limiting
- Contact submissions are tracked in `localStorage` (`portfolio_contact_last_submitted`).
- Enforces a 5-minute cooldown (300,000 ms) with a live countdown display (`MM:SS`) and disables the submit button during active cooldown periods.

### C. Server-Side IP Rolling Window Throttling
- Monitored in `server.ts` via an in-memory IP request timestamp map (`emailRateLimitMap`).
- Limits transmissions to 3 requests per 5-minute rolling window per client IP address.
- Responds with `HTTP 429 Too Many Requests` and a standard `Retry-After` header when exceeded.

---

## 4. Zero-Trust Access Control & Firestore Allowlist RBAC

The portfolio implements a zero-trust resource gate (`GateModal.tsx`, `BlogPostModal.tsx`):
- **Tier 1 (Public)**: Public bio, high-level career timeline, curated masterclasses, and open-source articles.
- **Tier 2 (Invite-Only)**: Detailed architectural case studies, patent blueprints, and proprietary executive playbooks.
- **Identity Verification**: Authenticated via Firebase Authentication (Google OAuth or email magic link).
- **Authorization Verification**: Checked in real time against the Firestore `allowlist/{email}` collection:
  - `authorized`: `boolean`
  - `role`: `"viewer"` | `"admin"`
  - `addedBy`: Admin user
  - `addedAt`: ISO timestamp

### Time-Bound HMAC-SHA256 Token Links
- Cryptographically signed URLs for executive search committees and advisory boards.
- Tokens expire strictly after **8 hours**, preventing persistent link circulation and unauthorized re-sharing.

---

## 5. Client-Side Intellectual Property Guards

To protect executive whitepapers, proprietary diagrams, and strategic case studies:
1. **Mouse Selection Shield**: `user-select: none` across text blocks while retaining standard selection in form fields (`input`, `textarea`).
2. **Context Menu Interception**: Intercepts `contextmenu` events to disable right-click inspect and image-saving actions.
3. **Drag-and-Drop Prevention**: Intercepts DOM `dragstart` events to avoid dragging architectural diagrams into secondary applications.
4. **Keyboard Shortcut Guards**: Hooks into `keydown` events to suppress page saves (`Ctrl+S`, `Cmd+S`) and source inspection (`Ctrl+U`, `Cmd+U`).

---

## 6. Dynamic Perimeter IP Deny List

`server.ts` maintains an in-memory perimeter deny list (`serverDenyList`) for dynamic IP blocking:
- Inspects client IP via `x-forwarded-for` and socket remote address.
- Blocks blacklisted or suspect subnets from reaching `/api/*` routes with `HTTP 403 Forbidden`.
- Exposes synchronization and query endpoints (`/api/denylist/sync`, `/api/denylist/status`) for administrative oversight.

---

## 7. Security Implementation Audit Status Matrix

| # | Feature / Specification | Category | Status | Implementation File |
| :- | :--- | :--- | :--- | :--- |
| 1 | Content Security Policy (CSP) | Application | **Implemented** | `index.html` & `server.ts` |
| 2 | Form Honeypot Field | Application | **Implemented** | `ContactModal.tsx` |
| 3 | Client-Side Form Rate Limiting | Application | **Implemented** | `ContactModal.tsx` |
| 4 | Server-Side API Throttling | Infrastructure | **Implemented** | `server.ts` (IP Rolling Window) |
| 5 | Strict-Transport-Security (HSTS) | Infrastructure | **Implemented** | `server.ts` (`max-age=31536000`) |
| 6 | Clickjacking Defense | Infrastructure | **Implemented** | `server.ts` (`SAMEORIGIN`) |
| 7 | MIME Sniffing Protection | Infrastructure | **Implemented** | `server.ts` (`nosniff`) |
| 8 | Sensor & Hardware Policy | Infrastructure | **Implemented** | `server.ts` (`Permissions-Policy`) |
| 9 | Referrer Privacy Policy | Infrastructure | **Implemented** | `server.ts` (`strict-origin...`) |
| 10 | Framework Origin Obscurity | Infrastructure | **Implemented** | `server.ts` (`x-powered-by: off`) |
| 11 | Zero-Trust Resource Gate | Access Control | **Implemented** | `GateModal.tsx`, `AuthContext.tsx` |
| 12 | Firestore Allowlist RBAC | Access Control | **Implemented** | Firestore collection `allowlist` |
| 13 | 8-Hour Session Expiration | Session Mgmt | **Implemented** | `AuthContext.tsx` |
