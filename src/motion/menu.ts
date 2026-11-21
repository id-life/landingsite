import gsap from 'gsap';
import { CHROME, MENU_ITEMS } from './original';

/**
 * The phone menus' item entrance and exit (experience menu, /news and /podcast menus), one choreography at the
 * original's values (src/motion/original.ts). Only gsap core: the content pages load this too.
 */
export function playMenuItems(selector: string, open: boolean) {
  if (open) {
    gsap.set(selector, { y: MENU_ITEMS.travel, opacity: 0 });
    gsap.to(selector, { y: 0, opacity: 1, stagger: MENU_ITEMS.stagger, ...CHROME.menuOpen });
  } else {
    gsap.set(selector, { y: 0 });
    gsap.to(selector, { y: MENU_ITEMS.travel, opacity: 0, stagger: MENU_ITEMS.stagger, ...CHROME.menuClose });
  }
}
