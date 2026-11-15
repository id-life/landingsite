/**
 * Best-effort fixed-window rate limit per key, in the memory of one server instance. On Vercel each function
 * instance keeps its own window, so this slows a burst from one address down but is no global guarantee; a durable
 * limit (Vercel WAF rate limiting or a KV store) is an owner decision.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { start: number; count: number }>();
  return function allow(key: string, now: number = Date.now()) {
    const entry = hits.get(key);
    if (!entry || now - entry.start >= windowMs) {
      hits.set(key, { start: now, count: 1 });
      if (hits.size > 5000) {
        hits.forEach((v, k) => {
          if (now - v.start >= windowMs) hits.delete(k);
        });
      }
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

/** The client address as Vercel reports it (first x-forwarded-for hop), or 'unknown'. */
export function clientKey(headers: Headers) {
  return headers.get('x-real-ip') || headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
