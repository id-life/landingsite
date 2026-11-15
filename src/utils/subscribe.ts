import jsonp from './jsonp';

const MAILCHIMP_ENDPOINT = 'https://life.us11.list-manage.com/subscribe/post-json';

/**
 * What Mailchimp said, as a code the forms and the analytics share.
 * - subscribed / pending: a new address was accepted (pending = double opt-in, a confirmation email went out).
 * - already_subscribed: the address is on the list already. The form shows success (nothing is wrong for the
 *   visitor) but analytics count it as an error, not a new subscription.
 * - invalid_email, timeout, error: nothing was added; the form shows the message.
 */
export type SubscribeCode = 'subscribed' | 'pending' | 'already_subscribed' | 'invalid_email' | 'timeout' | 'error';

export type SubscribeResult =
  | { ok: true; code: 'subscribed' | 'pending' | 'already_subscribed' }
  | { ok: false; code: 'invalid_email' | 'timeout' | 'error'; message: string };

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

/** Map one Mailchimp JSONP answer to a result. Exported for tests. */
export function classifyMailchimpResponse(response: { result?: string; msg?: unknown } | null | undefined): SubscribeResult {
  const message = cleanMessage(response?.msg);
  if (response?.result === 'success') return { ok: true, code: PENDING.test(message) ? 'pending' : 'subscribed' };
  if (/already subscribed/i.test(message)) return { ok: true, code: 'already_subscribed' };
  if (INVALID.test(message)) return { ok: false, code: 'invalid_email', message };
  return { ok: false, code: 'error', message: message || 'Subscription failed. Please try again.' };
}

/**
 * Subscribe an address through Mailchimp's JSONP endpoint and report what Mailchimp actually said.
 * (Every form used to show "Success" on any outcome, including a timeout.)
 *
 * The hidden fields were copied from an HTML embed as `amp;id` / `amp;f_id`; Mailchimp expects
 * `id` / `f_id`. Both spellings are sent so behaviour is unchanged if the old one was accepted.
 */
export async function subscribeNewsletter(fields: Record<string, string>): Promise<SubscribeResult> {
  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    params.append(key, value);
    if (key.startsWith('amp;')) params.append(key.slice(4), value);
  });
  try {
    // 6 s: Mailchimp's JSONP endpoint normally answers in well under a second; past this, a visitor should see
    // that it failed instead of watching a spinner (it was 10 s).
    const response = await jsonp(`${MAILCHIMP_ENDPOINT}?${params.toString()}`, undefined, 6000);
    return classifyMailchimpResponse(response);
  } catch (error) {
    if (error === 'JSONP request timeout') {
      return { ok: false, code: 'timeout', message: 'The newsletter service did not answer. Please try again.' };
    }
    return { ok: false, code: 'error', message: 'Could not reach the newsletter service. Please try again.' };
  }
}
