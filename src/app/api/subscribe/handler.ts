import { clientKey, createRateLimiter } from '@/lib/rate-limit';
import { emailHash, subscribeUpstream } from '@/lib/newsletter/mailchimp';
import { SUBSCRIBE_MESSAGES, SubscribeResult } from '@/lib/newsletter/result';
import { verifyTurnstile } from '@/lib/newsletter/turnstile';
import { isValidEmail, parseSubscribeRequest } from '@/lib/newsletter/validate';

const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

type Deps = {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
  allow?: (key: string) => boolean;
  log?: (line: Record<string, unknown>) => void;
};

const json = (status: number, result: SubscribeResult | Record<string, unknown>) =>
  new Response(JSON.stringify(result), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const fail = (status: number, code: keyof typeof SUBSCRIBE_MESSAGES, message = SUBSCRIBE_MESSAGES[code]) =>
  json(status, { ok: false, code, message });

/**
 * POST /api/subscribe (ENG-09): validate, drop honeypot hits silently, rate limit per address, verify Turnstile when
 * configured, subscribe upstream with double opt-in and answer a typed result. Outcomes are logged with a hash of the
 * address, never the address. Exported separately from route.ts so unit tests can inject the upstream.
 */
export async function handleSubscribe(request: Request, deps: Deps = {}) {
  const env = deps.env ?? process.env;
  const log = deps.log ?? ((line) => console.info(JSON.stringify({ route: 'subscribe', ...line })));
  const allow = deps.allow ?? limiter;
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return fail(415, 'error');
  const raw = await request.text();
  if (raw.length > 4096) return fail(413, 'error');
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, 'error');
  }
  const req = parseSubscribeRequest(body);
  if (!req) return fail(400, 'error');
  const ip = clientKey(request.headers);
  if (req.website) {
    // A person never fills the hidden field: answer like a success, contact nobody.
    log({ outcome: 'honeypot', placement: req.placement });
    return json(200, { ok: true, code: 'pending' });
  }
  if (!isValidEmail(req.email)) {
    log({ outcome: 'invalid_email', placement: req.placement });
    return fail(400, 'invalid_email');
  }
  if (!allow(ip)) {
    log({ outcome: 'rate_limited', placement: req.placement });
    return fail(429, 'rate_limited');
  }
  if (!(await verifyTurnstile(req.token, env.TURNSTILE_SECRET, ip, deps.fetchImpl))) {
    log({ outcome: 'spam_check', placement: req.placement });
    return fail(403, 'spam_check');
  }
  const result = await subscribeUpstream(req.email, env, deps.fetchImpl);
  log({ outcome: result.code, placement: req.placement, email: emailHash(req.email) });
  if (result.ok) return json(200, result);
  return json(result.code === 'invalid_email' ? 400 : 502, result);
}
