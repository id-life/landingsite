import { ScrollSmoother } from 'gsap/ScrollSmoother';
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

/**
 * Connect's trigger is created inside the 3D canvas (ConnectGL), which mounts after the sections. Its rest is the
 * end of that trigger ('rest' is the timeline's last label, the trigger ends at 'bottom bottom' of #connect-page1),
 * which the smoother can measure from the element alone. On a return to /connect with Back from a content page the
 * address is applied before the canvas has mounted: without this the deck stayed on Mission's first screen under
 * the address /connect.
 */
const REST_BEFORE_TRIGGER: Partial<Record<SectionId, () => number | null>> = {
  connect_page: () => {
    const el = document.getElementById('connect-page1');
    const smoother = ScrollSmoother.get();
    return el && smoother ? smoother.offset(el, 'bottom bottom') : null;
  },
};

/** The scroll position (px) where a section rests, or null while it cannot be known yet. */
export function getRestScroll(id: SectionId): number | null {
  const triggerId = REST_TRIGGER[id];
  if (triggerId === null) return 0;
  const st = ScrollTrigger.getById(triggerId);
  if (!st) {
    const y = REST_BEFORE_TRIGGER[id]?.() ?? null;
    return y !== null && Number.isFinite(y) ? Math.round(y) : null;
  }
  const y = st.labelToScroll('rest');
  return Number.isFinite(y) ? Math.round(y) : null;
}
