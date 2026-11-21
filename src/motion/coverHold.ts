import { NAV_LIST } from '@/components/nav/nav';

/**
 * Holds for the far-jump cover, and readiness for a direct landing: a section may ask the cover that hides a jump to
 * it to stay until something of the section is ready (the Digital Twin: its avatar's first drawn frame). The cover's
 * own timeline asks coverHoldFor at the moment the page has jumped under it; that hold resolves when the section is
 * ready or at its own limit, never later, so the cover always lifts. The first-visit loader asks landingReadiness:
 * the same readiness without a limit (the loader's own fail-open covers a load that never ends).
 */
type Hold = (limited: boolean) => Promise<unknown> | null;
const holds = new Map<number, Hold>();

/** Register the hold for a section (a NAV_LIST index). Returns the unregister function. */
export function registerCoverHold(section: number, hold: Hold): () => void {
  holds.set(section, hold);
  return () => {
    if (holds.get(section) === hold) holds.delete(section);
  };
}

/** The promise the cover over a jump to `section` waits for, or null when it need not wait. */
export function coverHoldFor(section: number): Promise<unknown> | null {
  return holds.get(section)?.(true) ?? null;
}

/**
 * What the section a direct landing shows still needs before the first-visit loader may start its fill (null: nothing),
 * with no limit. Asked when the hero is ready, by which time the experience's sections are mounted.
 */
export function landingReadiness(): Promise<unknown> | null {
  if (typeof window === 'undefined') return null;
  const section = NAV_LIST.findIndex((item) => item.href === window.location.pathname);
  return section > 0 ? (holds.get(section)?.(false) ?? null) : null;
}
