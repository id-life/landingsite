'use client';

import { experienceMountedAtom, initialRouteHandledAtom } from '@/atoms';
import { fadeInAnimCompletedAtom } from '@/atoms/geo';
import { NAV, NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsMounted } from '@/hooks/useIsMounted';
import { track } from '@/lib/analytics/track';
import { goToSection, sectionStateAtom } from '@/motion/sectionController';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';
import MotionSwitch from '@/components/common/MotionSwitch';
import SiteHeader from './SiteHeader';
import { isPlainClick, isSection, type SiteNavItem } from './site-nav';

/**
 * The site header on the seven experience routes (NAV-04): the same SiteHeader, as the fixed overlay bar, with the
 * section controller behind its links. Exactly one item is current: the section the controller rests on or moves
 * to (so a transition never shows two), from state rather than ScrollTrigger callbacks.
 */
export default function ExperienceHeader() {
  const isMobile = useIsMobile();
  const mounted = useIsMounted();
  const pathname = usePathname();
  const experienceMounted = useAtomValue(experienceMountedAtom);
  const routeApplied = useAtomValue(initialRouteHandledAtom);
  const { target } = useAtomValue(sectionStateAtom);
  // The experience reveals its fixed UI when the intro ends. Before hydration the bar is visible, so it paints
  // from the server HTML.
  const uiVisible = useAtomValue(fadeInAnimCompletedAtom);
  const shown = !mounted || uiVisible;

  const currentId =
    experienceMounted && routeApplied
      ? (NAV_LIST[target]?.id ?? null)
      : (NAV_LIST.find((s) => s.href === pathname)?.id ?? null);

  const onLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    track('nav_click', { target_section: NAV.vision_page.id, source: 'logo' });
    if (!experienceMounted || !isPlainClick(event)) return;
    event.preventDefault();
    goToSection(NAV.vision_page.id, 'nav');
  };

  const onItemClick = (event: MouseEvent<HTMLAnchorElement>, item: SiteNavItem) => {
    track('nav_click', { target_section: item.id, source: 'nav' });
    if (!experienceMounted || !isSection(item) || !isPlainClick(event)) return;
    event.preventDefault();
    goToSection(item.id, 'nav');
  };

  // The ids the experience and its tests know: #nav on the desktop deck, #mobile-nav on the phone deck. Only once a
  // deck has mounted: the intro tweens and the suite read that id's opacity as "the experience is ready", which the
  // server-painted bar is not.
  const id = experienceMounted && isMobile !== null ? (isMobile ? 'mobile-nav' : 'nav') : undefined;

  return (
    <SiteHeader
      variant="overlay"
      id={id}
      shown={shown}
      currentId={currentId}
      inExperience={experienceMounted}
      onLogoClick={onLogoClick}
      onItemClick={onItemClick}
      // MOT-02: in the bar on both decks, visible on every section (as in the old PCNav and MobileNav).
      // `tap`: a 44 px box on touch screens (RWD-06), like the other header controls.
      motionSwitch={<MotionSwitch className={shown ? 'pointer-events-auto tap mobile:mr-2' : 'tap mobile:mr-2'} />}
    />
  );
}
