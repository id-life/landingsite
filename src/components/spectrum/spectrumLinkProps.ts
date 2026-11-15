import type { MouseEvent } from 'react';
import { isInternalHref } from '@/constants/site';

type Options = {
  link?: string;
  /** A hash route (useSpectrumData) that moves the experience to its section instead of loading a page. */
  routeKey?: string;
  executeSpectrumRoute?: (key: string) => void;
  /** Analytics; runs on every activation, plain or modified. */
  onTrack?: () => void;
};

/**
 * Anchor props for a Spectrum item link. Every link is a real <a href>: external sites open in a new tab
 * (target=_blank, noopener), this site's pages in the same tab, and Cmd/Ctrl/Shift/middle clicks are left to
 * the browser. A plain click on a link to a section of the experience (routeKey) moves there in place.
 * Before, every link went through window.open(link, '_blank'), absolute www.id.life URLs included, so
 * 'Access Digital Twin' opened a second copy of the site.
 */
export function spectrumLinkProps({ link, routeKey, executeSpectrumRoute, onTrack }: Options) {
  if (!link) return null;
  const external = !isInternalHref(link);
  return {
    href: link,
    ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      // The link must not also trigger the card it sits in.
      event.stopPropagation();
      onTrack?.();
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      if (routeKey && executeSpectrumRoute) {
        event.preventDefault();
        executeSpectrumRoute(routeKey);
      }
    },
  };
}
