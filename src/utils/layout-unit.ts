/**
 * The layout unit --u in CSS pixels, for values CSS never sees: GSAP tweens and inline styles (RWD-01). --u is
 * 0.8333vw on the desktop experience and 1rem everywhere else (src/app/(home)/_components/Style.tsx); stylesheets get
 * the conversion at build time (scripts/postcss-layout-unit.js). Read at call time, so a resize is honoured.
 */
export function layoutUnitPx(): number {
  if (typeof window === 'undefined') return 16;
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue('--u').trim();
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return 16;
  if (raw.endsWith('vw')) return (n * window.innerWidth) / 100;
  if (raw.endsWith('px')) return n;
  return n * Number.parseFloat(getComputedStyle(root).fontSize);
}

/** n layout units as a px length string: what '2.5rem' meant under the old viewport-scaled root. */
export const u = (n: number) => `${n * layoutUnitPx()}px`;
