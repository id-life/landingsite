import { createHash } from 'node:crypto';
import * as Sentry from '@sentry/nextjs';
import { SUBSCRIBE_MESSAGES, SubscribeResult } from './result';

/**
 * Server-side Mailchimp calls for POST /api/subscribe. The browser never contacts Mailchimp, so the address no
 * longer sits in a script URL that browser tracing or replay could record.
 *
 * Two upstreams, chosen by configuration:
 *  - the Marketing API (MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID, server-only secrets): POST members with status
 *    'pending', i.e. double opt-in whatever the audience setting;
 *  - otherwise the audience's public signup endpoint, the same call the browser used to make, so the route works
 *    before the owner creates an API key. Its ids are public (they were in every page's HTML).
 */
const PUBLIC_ENDPOINT = 'https://life.us11.list-manage.com/subscribe/post-json';
const PUBLIC_FIELDS = { u: 'e6f88de977cf62de3628d944e', id: 'af9154d6b5', f_id: '00e418e1f0' };
export const UPSTREAM_TIMEOUT_MS = 5000;

/** Mailchimp messages arrive as "0 - Please enter a value" or with HTML links; keep plain text. */
function cleanMessage(raw: unknown) {
  return String(raw ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/^\d+\s*-\s*/, '')
    .trim();
}

// Mailchimp's double opt-in answer: "Almost finished... We need to confirm your email address..."
const PENDING = /almost finished|confirm your email/i;
// Mailchimp's address validation answers ("Please enter a value", "An email address must contain a single @",
// "The domain portion of the email address is invalid", "This email address looks fake or invalid", ...).
const INVALID = /enter a value|valid email|must contain|domain portion|username portion|fake or invalid|invalid/i;

/** Map one answer of the public signup endpoint to a result. */
export function classifyMailchimpResponse(response: { result?: string; msg?: unknown } | null | undefined): SubscribeResult {
  const message = cleanMessage(response?.msg);
  if (response?.result === 'success') return { ok: true, code: PENDING.test(message) ? 'pending' : 'subscribed' };
  if (/already subscribed/i.test(message)) return { ok: true, code: 'already_subscribed' };
  if (INVALID.test(message)) return { ok: false, code: 'invalid_email', message };
  return { ok: false, code: 'upstream_error', message: message || SUBSCRIBE_MESSAGES.upstream_error };
}

/** Map an answer of the Marketing API's POST /lists/{id}/members. */
export function classifyMarketingApiResponse(
  status: number,
  body: { status?: string; title?: string; detail?: string } | null,
) {
  if (status >= 200 && status < 300) {
    return { ok: true, code: body?.status === 'subscribed' ? 'subscribed' : 'pending' } as SubscribeResult;
  }
  const title = String(body?.title ?? '');
  if (/member exists/i.test(title)) return { ok: true, code: 'already_subscribed' } as SubscribeResult;
  if (status === 400 && /invalid resource/i.test(title)) {
    return { ok: false, code: 'invalid_email', message: SUBSCRIBE_MESSAGES.invalid_email } as SubscribeResult;
  }
  return { ok: false, code: 'upstream_error', message: SUBSCRIBE_MESSAGES.upstream_error } as SubscribeResult;
}

type Fetch = typeof fetch;

async function viaPublicEndpoint(email: string, fetchImpl: Fetch): Promise<SubscribeResult> {
  const params = new URLSearchParams({ ...PUBLIC_FIELDS, EMAIL: email, c: 'cb' });
  const res = await fetchImpl(`${PUBLIC_ENDPOINT}?${params}`, {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    headers: { accept: 'application/javascript, application/json' },
    cache: 'no-store',
  });
  const text = await res.text();
  // JSONP: cb({...}); tolerate a plain JSON body too.
  const json = text.replace(/^[^(]*\(\s*/, '').replace(/\s*\)\s*;?\s*$/, '');
  try {
    return classifyMailchimpResponse(JSON.parse(json));
  } catch {
    return { ok: false, code: 'upstream_error', message: SUBSCRIBE_MESSAGES.upstream_error };
  }
}

async function viaMarketingApi(email: string, apiKey: string, listId: string, fetchImpl: Fetch): Promise<SubscribeResult> {
  const dc = apiKey.split('-').pop() || 'us11';
  const res = await fetchImpl(`https://${dc}.api.mailchimp.com/3.0/lists/${encodeURIComponent(listId)}/members`, {
    method: 'POST',
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    headers: {
      authorization: `Basic ${Buffer.from(`landingsite:${apiKey}`).toString('base64')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ email_address: email, status: 'pending' }),
    cache: 'no-store',
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    // Not JSON: classified by status alone.
  }
  return classifyMarketingApiResponse(res.status, body);
}

/** Subscribe one address upstream. Never throws: a timeout or network failure is an upstream_error. */
export async function subscribeUpstream(
  email: string,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: Fetch = fetch,
): Promise<SubscribeResult> {
  try {
    if (env.MAILCHIMP_API_KEY && env.MAILCHIMP_LIST_ID) {
      return await viaMarketingApi(email, env.MAILCHIMP_API_KEY, env.MAILCHIMP_LIST_ID, fetchImpl);
    }
    // The public endpoint takes the address in its query string: keep that request out of server tracing spans.
    return await Sentry.suppressTracing(() => viaPublicEndpoint(email, fetchImpl));
  } catch {
    return { ok: false, code: 'upstream_error', message: SUBSCRIBE_MESSAGES.upstream_error };
  }
}

/** A hash of the address for log lines (never the address itself). */
export const emailHash = (email: string) => createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 12);
