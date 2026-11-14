import jsonp from './jsonp';

const MAILCHIMP_ENDPOINT = 'https://life.us11.list-manage.com/subscribe/post-json';

export type SubscribeResult = { ok: true; alreadySubscribed: boolean } | { ok: false; message: string };

/** Mailchimp messages arrive as "0 - Please enter a value" or with HTML links; keep plain text. */
function cleanMessage(raw: unknown) {
  return String(raw ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/^\d+\s*-\s*/, '')
    .trim();
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
    const response = await jsonp(`${MAILCHIMP_ENDPOINT}?${params.toString()}`, undefined, 10000);
    if (response?.result === 'success') return { ok: true, alreadySubscribed: false };
    const message = cleanMessage(response?.msg);
    if (/already subscribed/i.test(message)) return { ok: true, alreadySubscribed: true };
    return { ok: false, message: message || 'Subscription failed. Please try again.' };
  } catch {
    return { ok: false, message: 'Could not reach the newsletter service. Please try again.' };
  }
}
