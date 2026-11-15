import { recordSubscribeDismissal } from '@/atoms/auto-subscribe';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { trackEvent } from '@/hooks/useGA';
import { subscribeNewsletter, SubscribeResult } from '@/utils/subscribe';

/**
 * Where a newsletter form or the popup was shown:
 * - nav: the popup opened from a header SUBSCRIBE button;
 * - content: the popup opened from a call to action inside a page (the "Join our longevity circle" box on /news);
 * - connect: the subscribe form in the Connect contact block;
 * - footer: the subscribe form at the foot of the news pages.
 * There is no automatic placement: nothing opens the popup without a request.
 */
export type NewsletterPlacement = 'nav' | 'content' | 'connect' | 'footer';

/** How an open popup was closed: its X, Escape, a press outside it, a page scroll, or its SUBSCRIBE button again. */
export type NewsletterCloseMethod = 'x' | 'escape' | 'outside' | 'scroll' | 'toggle';

type NewsletterEvents = {
  view: { placement: NewsletterPlacement };
  close: { placement: NewsletterPlacement; method: NewsletterCloseMethod };
  submit: { placement: NewsletterPlacement };
  subscribe: { placement: NewsletterPlacement; status: 'subscribed' | 'pending' };
  error: { placement: NewsletterPlacement; error_code: 'already_subscribed' | 'invalid_email' | 'timeout' | 'error' };
};

const EVENT_NAME: Record<keyof NewsletterEvents, string> = {
  view: GA_EVENT_NAMES.NEWSLETTER_VIEW,
  close: GA_EVENT_NAMES.NEWSLETTER_CLOSE,
  submit: GA_EVENT_NAMES.NEWSLETTER_SUBMIT,
  subscribe: GA_EVENT_NAMES.NEWSLETTER_SUBSCRIBE,
  error: GA_EVENT_NAMES.NEWSLETTER_ERROR,
};

export function trackNewsletter<K extends keyof NewsletterEvents>(step: K, params: NewsletterEvents[K]) {
  trackEvent({ name: EVENT_NAME[step], ...params });
}

/**
 * Submit a newsletter form and report the funnel truthfully: newsletter_submit for the attempt, then exactly
 * one of newsletter_subscribe (a new address: subscribed, or pending under double opt-in) or newsletter_error
 * (already_subscribed, invalid_email, timeout, error). A successful submit also counts as an explicit dismissal.
 */
export async function submitNewsletter(
  fields: Record<string, string>,
  placement: NewsletterPlacement,
): Promise<SubscribeResult> {
  trackNewsletter('submit', { placement });
  const result = await subscribeNewsletter(fields);
  if (result.code === 'subscribed' || result.code === 'pending') {
    trackNewsletter('subscribe', { placement, status: result.code });
  } else {
    trackNewsletter('error', { placement, error_code: result.code });
  }
  if (result.ok) recordSubscribeDismissal();
  return result;
}
