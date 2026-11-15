/** Request validation of POST /api/subscribe (no dependency: the shape is three strings). */

/** A practical address check: one @, a dotted domain, no spaces, at most 254 characters (RFC 5321 path limit). */
const EMAIL = /^[A-Z0-9._%+'-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}$/i;

export const PLACEMENTS = ['nav', 'content', 'connect', 'footer'] as const;
export type Placement = (typeof PLACEMENTS)[number];

export type SubscribeRequest = {
  email: string;
  /** Honeypot: a hidden field people never fill. A non-empty value marks the request as automated. */
  website: string;
  placement: Placement | 'unknown';
  /** Cloudflare Turnstile token, when the site key is configured. */
  token: string;
};

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL.test(value);
}

/** Parse an untrusted JSON body; returns null when it is not an object of strings. */
export function parseSubscribeRequest(body: unknown): SubscribeRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  if (b.email !== undefined && typeof b.email !== 'string') return null;
  const placement = text(b.placement, 20);
  return {
    email: text(b.email, 320),
    website: text(b.website, 200),
    placement: (PLACEMENTS as readonly string[]).includes(placement) ? (placement as Placement) : 'unknown',
    token: text(b.token, 2048),
  };
}
