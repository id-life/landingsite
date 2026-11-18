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
import { useEffect, type MouseEvent } from 'react';
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

  // The bar's height as --site-header-h on <html>, so the sections place their first line below it at every width
  // (one row on wide screens, two on tablets). It is the bottom of the bar as drawn (its logo, items and action),
  // not of the element, whose bottom padding is empty: at 1440 the original's row ends at about 70 px.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header');
    if (!header) return;
    const write = () => {
      const top = header.getBoundingClientRect().top;
      let bottom = 0;
      for (const child of header.children) {
        const r = child.getBoundingClientRect();
        if (r.height > 0) bottom = Math.max(bottom, r.bottom - top);
      }
      document.documentElement.style.setProperty('--site-header-h', `${Math.ceil(bottom || header.offsetHeight)}px`);
    };
    write();
    const observer = new ResizeObserver(write);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <SiteHeader
      variant="overlay"
      id={id}
      shown={shown}
      currentId={currentId}
      inExperience={experienceMounted}
      onItemClick={onItemClick}
    />
  );
}
