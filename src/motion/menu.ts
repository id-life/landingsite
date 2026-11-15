import gsap from 'gsap';
import { DISTANCE, DURATION, EASE, STAGGER } from './tokens';

/**
 * The phone menus' item entrance and exit (experience menu, /news and /podcast menus), one choreography from the
 * motion tokens. Only gsap core: the content pages load this too.
 */
export function playMenuItems(selector: string, open: boolean) {
  if (open) {
    gsap.set(selector, { y: DISTANCE.lg, opacity: 0 });
    gsap.to(selector, { y: 0, opacity: 1, duration: DURATION.moderate, stagger: STAGGER.block, ease: EASE.out });
  } else {
    gsap.set(selector, { y: 0 });
    gsap.to(selector, { y: DISTANCE.lg, opacity: 0, duration: DURATION.base, stagger: STAGGER.block, ease: EASE.in });
  }
}
