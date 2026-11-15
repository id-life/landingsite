/**
 * Cloudflare Turnstile verification for the subscribe route. Active only when the owner configures the keys
 * (TURNSTILE_SECRET on the server, NEXT_PUBLIC_TURNSTILE_SITE_KEY in the browser); until then the route relies on
 * validation, the honeypot, the rate limit and Mailchimp's double opt-in.
 */
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string, secret: string | undefined, ip: string, fetchImpl: typeof fetch = fetch) {
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);
    const res = await fetchImpl(SITEVERIFY, { method: 'POST', body, signal: AbortSignal.timeout(4000), cache: 'no-store' });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
