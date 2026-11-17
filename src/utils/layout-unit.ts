/**
 * The layout unit --u in CSS pixels, for values CSS never sees: GSAP tweens and inline styles (RWD-01). --u is
 * 0.8333vw on the desktop deck, 1rem on content pages, and on the phone deck 1rem at phone widths and proportionally
 * more above (src/app/(home)/_components/Style.tsx); stylesheets get the conversion at build time
 * (scripts/postcss-layout-unit.js). Read at call time, so a resize is honoured.
 */
let probe: HTMLElement | null = null;

export function layoutUnitPx(): number {
  if (typeof window === 'undefined') return 16;
  // --u can be a formula (the phone deck's unit above phone width: max(1rem, min(…vw, …svh))), so it is measured, not
  // parsed: a hidden, zero-height element as wide as one unit.
  if (!probe || !probe.isConnected) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;top:0;left:-9999px;width:var(--u);height:0;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);
  }
  const width = probe.getBoundingClientRect().width;
  return width > 0 ? width : 16;
}

/** n layout units as a px length string: what '2.5rem' meant under the old viewport-scaled root. */
export const u = (n: number) => `${n * layoutUnitPx()}px`;
