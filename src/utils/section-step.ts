import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionId } from '@/components/nav/nav';

/**
 * Where each section of the desktop deck rests (MOT-01). Every section's scrubbed timeline marks the end of its
 * entrance with a 'rest' label; the section controller lands every arrival there (wheel, keys, nav, arrows,
 * deep links, Back), so a section has one pose whatever the path. (There were three landing literals for
 * Portfolio alone, 0.95 / 0.96 / 0.965 of its scroll, leaving the contact block at 84-92 % of its entrance.)
 * Mission rests at the top of the page.
 */
const REST_TRIGGER: Record<SectionId, string | null> = {
  vision_page: null,
  portfolio_page: 'portfolio-trigger',
  insights_page: 'insights-scroll-trigger',
  spectrum_page: 'spectrum-trigger',
  engagement_page: 'engagement-scroll-trigger',
  twin_page: 'twin-scroll-trigger',
  connect_page: 'connect-page1-scroll-trigger',
};

/** The scroll position (px) where a section rests, or null while its ScrollTrigger does not exist yet. */
export function getRestScroll(id: SectionId): number | null {
  const triggerId = REST_TRIGGER[id];
  if (triggerId === null) return 0;
  const st = ScrollTrigger.getById(triggerId);
  if (!st) return null;
  const y = st.labelToScroll('rest');
  return Number.isFinite(y) ? Math.round(y) : null;
}
