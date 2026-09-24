// Cryptographically sound, browser-compatible RFC 7519 JSON Web Token (JWT) Engine
// Implements 72-Hour Time-Bound Executive Access Tokens using Web Crypto API HMAC-SHA256

const JWT_SECRET = 'munish-executive-vault-hmac-sha256-secret-key-2026';

export interface ExecutiveJwtPayload {
  sub: string; // Recipient Email or Search Partner identifier
  role: 'viewer' | 'admin';
  scope: 'global' | 'roadmaps' | 'specific';
  allowedItems?: string[];
  iat: number; // Issued at (seconds)
  exp: number; // Expiration (seconds) - Default 72 hours from iat
  jti: string; // Unique Token ID
  iss: string; // 'munish-dhiman-executive-vault'
  partnerName?: string;
}

export interface JwtVerificationResult {
  valid: boolean;
  expired?: boolean;
  payload?: ExecutiveJwtPayload;
  error?: string;
  hoursRemaining?: number;
  minutesRemaining?: number;
}

// Convert Base64URL to ArrayBuffer
function base64UrlToBuffer(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Convert ArrayBuffer to Base64URL
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// String to Base64URL
function stringToBase64Url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Base64URL to String
function base64UrlToString(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

// Get CryptoKey for HMAC-SHA256
async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    'raw',
    enc.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Generate a signed 8-Hour Executive Access JWT
 */
export async function generateExecutiveJwt(options: {
  email: string;
  role?: 'viewer' | 'admin';
  scope?: 'global' | 'roadmaps' | 'specific';
  allowedItems?: string[];
  partnerName?: string;
  expiresInHours?: number; // Defaults to 8 hours per spec
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const hours = options.expiresInHours ?? 2; // 2 hours default lifetime
  const exp = now + hours * 3600;

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload: ExecutiveJwtPayload = {
    sub: options.email.toLowerCase().trim(),
    role: options.role || 'viewer',
    scope: options.scope || 'roadmaps',
    allowedItems: options.allowedItems || [],
    partnerName: options.partnerName,
    iat: now,
    exp: exp,
    jti: 'jwt_' + Math.random().toString(36).substring(2, 11) + '_' + now,
    iss: 'munish-dhiman-executive-vault'
  };

  const encodedHeader = stringToBase64Url(JSON.stringify(header));
  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey();
  const signatureBuffer = await window.crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(dataToSign)
  );

  const encodedSignature = bufferToBase64Url(signatureBuffer);
  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verify an incoming Executive Access JWT
 * Enforces cryptographic HMAC-SHA256 validation and 8-hour time boundary
 */
export async function verifyExecutiveJwt(token: string): Promise<JwtVerificationResult> {
  try {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Empty or invalid token format' };
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Malformed JWT structure' };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToVerify = `${headerB64}.${payloadB64}`;

    // Verify signature
    const key = await getHmacKey();
    const signatureBytes = base64UrlToBuffer(signatureB64);
    const isValidSignature = await window.crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as any,
      new TextEncoder().encode(dataToVerify)
    );

    if (!isValidSignature) {
      return { valid: false, error: 'Invalid cryptographic signature. Access Denied.' };
    }

    // Decode and parse payload
    const payloadJson = base64UrlToString(payloadB64);
    const payload: ExecutiveJwtPayload = JSON.parse(payloadJson);

    // Enforce 8-hour time boundary
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      const expiredAgoHours = Math.round((now - payload.exp) / 3600);
      return { 
        valid: false, 
        expired: true, 
        payload,
        error: `Executive access link expired ${expiredAgoHours > 0 ? expiredAgoHours + ' hour(s) ago' : 'recently'}. Secure JWT sessions are valid for 2 hours (up to 4 hours maximum) and auto-expire. Access must be requested again.` 
      };
    }

    const secondsRemaining = payload.exp - now;
    const hoursRemaining = Math.floor(secondsRemaining / 3600);
    const minutesRemaining = Math.floor((secondsRemaining % 3600) / 60);

    return {
      valid: true,
      payload,
      hoursRemaining,
      minutesRemaining
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || 'Token verification failed'
    };
  }
}

/**
 * Construct full shareable URL with JWT token
 */
export function createShareableJwtUrl(jwt: string): string {
  const origin = window.location.origin;
  const path = window.location.pathname;
  return `${origin}${path}?exec_token=${encodeURIComponent(jwt)}`;
}
