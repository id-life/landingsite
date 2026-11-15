/**
 * The typed outcome of a newsletter submit, shared by the server route (POST /api/subscribe) and the forms.
 * - subscribed / pending: a new address was accepted (pending = double opt-in, a confirmation email went out);
 * - already_subscribed: the address is on the list already. The form shows success (nothing is wrong for the
 *   visitor) but analytics count it as newsletter_error, not a new subscription;
 * - invalid_email, rate_limited, spam_check, upstream_error, timeout, error: nothing was added; the form shows
 *   the message. timeout and error are decided in the browser (no answer within 6 s, or no usable answer).
 */
export type SubscribeCode =
  | 'subscribed'
  | 'pending'
  | 'already_subscribed'
  | 'invalid_email'
  | 'rate_limited'
  | 'spam_check'
  | 'upstream_error'
  | 'timeout'
  | 'error';

export type SubscribeOkCode = 'subscribed' | 'pending' | 'already_subscribed';
export type SubscribeErrorCode = Exclude<SubscribeCode, SubscribeOkCode>;

export type SubscribeResult = { ok: true; code: SubscribeOkCode } | { ok: false; code: SubscribeErrorCode; message: string };

export const SUBSCRIBE_MESSAGES: Record<SubscribeErrorCode, string> = {
  invalid_email: 'Please enter a valid email address.',
  rate_limited: 'Too many attempts. Please wait a minute and try again.',
  spam_check: 'The spam check failed. Please reload the page and try again.',
  upstream_error: 'The newsletter service did not accept the request. Please try again.',
  timeout: 'The newsletter service did not answer. Please try again.',
  error: 'Could not reach the newsletter service. Please try again.',
};

const OK: readonly string[] = ['subscribed', 'pending', 'already_subscribed'];
const ERR: readonly string[] = Object.keys(SUBSCRIBE_MESSAGES);

/** Validate a JSON answer of POST /api/subscribe; anything unexpected becomes a generic error. */
export function parseSubscribeAnswer(body: unknown): SubscribeResult {
  const b = (body ?? {}) as { ok?: unknown; code?: unknown; status?: unknown; message?: unknown };
  const raw = typeof b.code === 'string' ? b.code : typeof b.status === 'string' ? b.status : '';
  if (b.ok === true) return { ok: true, code: (OK.includes(raw) ? raw : 'subscribed') as SubscribeOkCode };
  const code = (ERR.includes(raw) ? raw : 'error') as SubscribeErrorCode;
  const message = typeof b.message === 'string' && b.message.trim() ? b.message.trim().slice(0, 300) : SUBSCRIBE_MESSAGES[code];
  return { ok: false, code, message };
}
