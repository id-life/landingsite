import { recordSubscribeDismissal } from '@/atoms/auto-subscribe';
import { track } from '@/lib/analytics/track';
import { subscribeNewsletter, SubscribeFields, SubscribeResult } from '@/utils/subscribe';

/**
 * Where a newsletter form or the popup was shown:
 * - nav: the popup opened from a header SUBSCRIBE button;
 * - content: the popup opened from a call to action inside a page (the "Join our longevity circle" box on /news);
 * - connect: the subscribe form in the Connect contact block;
 * - footer: the subscribe form at the foot of the news pages.
 * There is no automatic placement: nothing opens the popup without a request.
 */
export type NewsletterPlacement = 'nav' | 'content' | 'connect' | 'footer' | 'auto';

/** How an open popup was closed: its X, Escape, a press outside it, a page scroll, or its SUBSCRIBE button again. */
export type NewsletterCloseMethod = 'x' | 'escape' | 'outside' | 'scroll' | 'toggle';

type NewsletterEvents = {
  view: { placement: NewsletterPlacement; previously_dismissed: 0 | 1 };
  close: { placement: NewsletterPlacement; method: NewsletterCloseMethod };
};

export function trackNewsletter<K extends keyof NewsletterEvents>(step: K, params: NewsletterEvents[K]) {
  if (step === 'view') track('newsletter_view', params as NewsletterEvents['view']);
  else track('newsletter_close', params as NewsletterEvents['close']);
}

/**
 * Submit a newsletter form and report the funnel truthfully: newsletter_submit for the attempt, then exactly
 * one of newsletter_subscribe (a new address: subscribed, or pending under double opt-in) or newsletter_error
 * (already_subscribed, invalid_email, rate_limited, spam_check, upstream_error, timeout, error). A successful submit
 * also counts as an explicit dismissal. This is the only caller of the subscribe route (every form goes through
 * useNewsletterForm).
 */
export async function submitNewsletter(
  fields: Omit<SubscribeFields, 'placement'>,
  placement: NewsletterPlacement,
): Promise<SubscribeResult> {
  track('newsletter_submit', { placement });
  const result = await subscribeNewsletter({ ...fields, placement });
  if (result.code === 'subscribed' || result.code === 'pending') {
    track('newsletter_subscribe', { placement, status: result.code });
  } else {
    track('newsletter_error', { placement, error_code: result.code });
  }
  if (result.ok) recordSubscribeDismissal();
  return result;
}
