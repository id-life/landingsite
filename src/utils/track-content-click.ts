import { GA_EVENT_NAMES } from '@/constants/ga';
import { trackEvent } from '@/hooks/useGA';

export type ContentKind = 'news' | 'talk' | 'podcast' | 'longevity_weekly';
export type ContentPlacement = 'news_page' | 'insights';

const domainOf = (url?: string | null) => {
  if (!url || url.startsWith('/')) return 'www.id.life';
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
};

/**
 * Record a click on a news, talk, podcast or weekly card.
 *
 * These cards open with `window.open`, which GA4's automatic outbound-click tracking does not see,
 * so without this event there is no record of which coverage people actually open.
 */
export function trackContentClick(kind: ContentKind, placement: ContentPlacement, title: string, url?: string | null) {
  trackEvent({ name: GA_EVENT_NAMES.CONTENT_CLICK, label: title, content_type: kind, placement, link_domain: domainOf(url) });
}
