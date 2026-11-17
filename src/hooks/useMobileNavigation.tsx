import { innerPageIndexAtom, innerPageTotalAtom, mobileCurrentPageAtom } from '@/atoms';
import { jotaiStore } from '@/atoms/store';
import { mobileThemeTransitioningAtom } from '@/atoms/theme';
import { NAV, NAV_LIST, NavItem } from '@/components/nav/nav';
import {
  goToSection,
  registerSectionDriver,
  sectionIndex,
  type SectionDriver,
  type SectionSource,
  type SectionTransition,
} from '@/motion/sectionController';
import { DURATION } from '@/motion/tokens';
import gsap from 'gsap';
import { useCallback, useEffect } from 'react';

/** Show a section on the phone tree (the visible change; the URL is the controller's). */
function show(item: NavItem) {
  jotaiStore.set(mobileCurrentPageAtom, item);
  jotaiStore.set(innerPageIndexAtom, 0); // 切换页面时重置内页索引
  if (item.id !== NAV.connect_page.id) {
    // Connect is the one section that scrolls: leaving it returns the page to the top.
    gsap.to(window, { scrollTo: 0, duration: DURATION.base });
    jotaiStore.set(innerPageTotalAtom, 0);
  }
}

/**
 * A section change asked for while the background theme still transitions waits for it (the latest request
 * wins). To the controller it is a transition that ends when the section is shown, so a step or a nav tap in
 * the meantime retargets it instead of being dropped.
 */
function afterThemeTransition(item: NavItem): SectionTransition {
  let onComplete: (() => void) | null = null;
  let unsubscribe: (() => void) | null = null;
  const done = () => {
    unsubscribe?.();
    unsubscribe = null;
    show(item);
    onComplete?.();
  };
  return {
    play: () => {
      if (!jotaiStore.get(mobileThemeTransitioningAtom)) return done();
      unsubscribe = jotaiStore.sub(mobileThemeTransitioningAtom, () => {
        if (!jotaiStore.get(mobileThemeTransitioningAtom)) done();
      });
    },
    reverse: () => undefined,
    kill: () => {
      unsubscribe?.();
      unsubscribe = null;
    },
    eventCallback: (type, callback) => {
      if (type === 'onComplete') onComplete = callback;
    },
  };
}

const phoneDriver: SectionDriver = {
  tree: 'phone',
  current: () => Math.max(0, sectionIndex(jotaiStore.get(mobileCurrentPageAtom).id)),
  stepTarget(dir) {
    const next = phoneDriver.current() + dir;
    return next >= 0 && next < NAV_LIST.length ? next : null;
  },
  move(to) {
    const item = NAV_LIST[to];
    if (!jotaiStore.get(mobileThemeTransitioningAtom)) {
      show(item);
      return null;
    }
    return { transition: afterThemeTransition(item), reversible: false };
  },
};

/** The phone tree's driver for the section controller (MOT-01). Mounted once, in Home. `enabled` is false on the other deck's mount of Home (one Home for both decks): the hook then does nothing. */
export function usePhoneSectionDriver(enabled = true) {
  useEffect(() => (enabled ? registerSectionDriver(phoneDriver) : undefined), [enabled]);
}

/**
 * Phone section changes go through the section controller, like the desktop deck's. Kept as a hook so the
 * menu, arrows, START, swipes and Spectrum links keep one call; new code can call goToSection() directly.
 */
export function useMobileNavigation() {
  const mobileNavChange = useCallback((item: NavItem, source: SectionSource = 'menu') => {
    goToSection(item.id, source);
  }, []);
  return { mobileNavChange };
}
