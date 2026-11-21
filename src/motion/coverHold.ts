/**
 * Holds for the far-jump cover: a section may ask the cover that hides a jump to it to stay until something of the
 * section is ready (the Digital Twin: its avatar's first drawn frame). The cover's own timeline asks coverHoldFor at
 * the moment the page has jumped under it; a hold resolves when the section is ready or at its own limit, never
 * later, so the cover always lifts.
 */
type Hold = () => Promise<unknown> | null;
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
  return holds.get(section)?.() ?? null;
}
