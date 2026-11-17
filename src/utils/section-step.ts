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
 * Connect's trigger is created inside the 3D canvas (ConnectGL), which mounts after the sections. On a return to
 * /connect with Back from a content page the address is applied before the canvas has mounted: without a rest the
 * deck stayed on Mission's first screen under the address /connect. Until the trigger exists the rest is taken just
 * inside the trigger's end ('bottom bottom' of #connect-page1, measured by the smoother from the element): the
 * timeline's rest label is followed by a short hold (CONNECT_REST_HOLD, at least 3.8 px on a 480 px high window),
 * and anywhere in that hold the section looks as at its rest, inside the trigger, never on its last pixel.
 */
const INSIDE_END_PX = 2;
const REST_BEFORE_TRIGGER: Partial<Record<SectionId, () => number | null>> = {
  connect_page: () => {
    const el = document.getElementById('connect-page1');
    const smoother = ScrollSmoother.get();
    return el && smoother ? smoother.offset(el, 'bottom bottom') - INSIDE_END_PX : null;
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
