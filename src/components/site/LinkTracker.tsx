'use client';

import { useEffect } from 'react';

/**
 * One delegated click listener for server-rendered links (NAV-04, PERF-10): navigation items carry data-nav-id (and
 * data-nav-source), channel links data-channel and data-placement. The analytics modules load on the first such
 * click, so a page that renders the header and footer on the server ships no tracking code with them.
 */
export default function LinkTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[data-nav-id], a[data-channel]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const { navId, navSource, channel, placement } = link.dataset;
      if (navId) {
        const source = navSource === 'logo' ? 'logo' : navSource === 'mobile_menu' ? 'mobile_menu' : 'nav';
        void import('@/lib/analytics/track').then(({ track }) => track('nav_click', { target_section: navId, source }));
      } else if (channel) {
        void import('@/lib/analytics/social').then(({ trackChannelLink }) =>
          trackChannelLink(channel, link.href, placement ?? 'footer'),
        );
      }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
