import { parseSubscribeAnswer, SUBSCRIBE_MESSAGES, SubscribeResult } from '@/lib/newsletter/result';
import { getTurnstileToken } from '@/lib/newsletter/turnstile-client';

export type { SubscribeCode, SubscribeResult } from '@/lib/newsletter/result';

/** The browser gives up after 6 s: past that a visitor should see that it failed instead of watching a spinner. */
export const SUBSCRIBE_TIMEOUT_MS = 6000;

export type SubscribeFields = {
  email: string;
  /** Honeypot value (people leave it empty). */
  website?: string;
  placement?: string;
  token?: string;
};

/**
 * Submit one address to the site's own POST /api/subscribe (ENG-09) and report the typed result. The browser no
 * longer contacts Mailchimp (the old JSONP GET put the address in a script URL). Never throws.
 */
export async function subscribeNewsletter(fields: SubscribeFields): Promise<SubscribeResult> {
  const token = fields.token ?? (await getTurnstileToken());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBSCRIBE_TIMEOUT_MS);
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...fields, token }),
      signal: controller.signal,
      cache: 'no-store',
    });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return parseSubscribeAnswer(body);
  } catch (error) {
    if (controller.signal.aborted) return { ok: false, code: 'timeout', message: SUBSCRIBE_MESSAGES.timeout };
    return { ok: false, code: 'error', message: SUBSCRIBE_MESSAGES.error };
  } finally {
    clearTimeout(timer);
  }
}
