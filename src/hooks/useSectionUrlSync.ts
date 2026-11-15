'use client';

import { useEffect } from 'react';
import { NavItem } from '@/components/nav/nav';
import { sectionTitle } from '@/constants/section-titles';
import { noteSectionView } from '@/lib/analytics/section-view';
import { isSectionMoving } from '@/motion/sectionController';

/**
 * Keep the address bar and the tab title on the section the visitor is looking at, so reload,
 * share and Back land where they were. Explicit navigation (nav links, arrows) pushes its own
 * history entry; a section reached by scrolling replaces the current entry once the transition
 * has settled, keeping the query string (UTM tags) and, for Spectrum, the hash.
 */
export function useSectionUrlSync(currentPage: NavItem, ready: boolean, { replaceUrl = true } = {}) {
  useEffect(() => {
    if (!ready) return;
    document.title = sectionTitle(currentPage);
    if (!replaceUrl) return;
    let cancelled = false;
    let attempts = 0;
    const sync = () => {
      if (cancelled) return;
      // The section controller writes the URL when its own transitions end; this catches the rest (the scrollbar).
      if (isSectionMoving()) {
        if (++attempts < 40) setTimeout(sync, 150);
        return;
      }
      const path = currentPage.href;
      if (window.location.pathname === path) return;
      const hash = currentPage.id === 'spectrum_page' ? window.location.hash : '';
      window.history.replaceState(window.history.state, '', `${path}${window.location.search}${hash}`);
      noteSectionView(sectionTitle(currentPage));
    };
    const timer = setTimeout(sync, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [currentPage, ready, replaceUrl]);
}
