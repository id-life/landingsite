import type { MouseEvent } from 'react';

type Options = {
  link?: string;
  /** Unused since every link opens a new tab (it moved the experience to a section in place). */
  routeKey?: string;
  executeSpectrumRoute?: (key: string) => void;
  /** Analytics; runs on every activation, plain or modified. */
  onTrack?: () => void;
};

/**
 * Anchor props for a Spectrum item link. Every link is a real <a href> and opens in a new tab, this site's own pages
 * (Influence Network, Disease Management, Access Digital Twin) included, as on the owner's site: his answer of
 * 2026-11-18 ("open new tab") reverses wave 0's same-tab rule for them (NAV-10). Cmd/Ctrl/Shift/middle clicks are left
 * to the browser. rel is noopener noreferrer on every one. The site's own pages keep their relative address (his
 * site pointed them at www.id.life, which would leave a preview for production).
 */
export function spectrumLinkProps({ link, onTrack }: Options) {
  if (!link) return null;
  return {
    href: link,
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      // The link must not also trigger the card it sits in.
      event.stopPropagation();
      onTrack?.();
    },
  };
}
