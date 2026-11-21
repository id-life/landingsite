/**
 * The phone deck's hand-over between two sections (MOT-05: no frame where neither is visible). The phone deck shows one
 * section at a time and hid the one being left in the same update that showed the next, so where the next section's
 * entrance waits or starts from nothing, the screen showed only the background. Two mends, both keeping every timing
 * of the original:
 *
 * - The section being left has an exit of its own in the original (Portfolio's panel rising out): it stays drawn,
 *   over the next one and inert, while that exit plays, and is hidden when it ends.
 * - It has none (Spectrum): it stays drawn until the next section's own entrance starts (Insights after its 0.5 s
 *   wait), then is hidden.
 *
 * A section announces the start of its entrance here; a section being left waits for it.
 */
type Listener = (id: string) => void;
const listeners = new Set<Listener>();

/** The section `id` has started its entrance (its first tween is under way, or it was shown at once). */
export function announceEntrance(id: string) {
  listeners.forEach((listener) => listener(id));
}

/** Call `listener` with the id of each section that starts its entrance; returns the unsubscribe. */
export function onEntrance(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The sections whose entrance waits and announces its start (Insights: the original's 0.5 s wait for the exit). */
export const HANDOVER_TARGETS: ReadonlySet<string> = new Set(['insights_page']);

// The inner page the section being left was on: the phone deck resets the shared inner page index in the same update
// that shows the next section, so the section being left reads its own page from here while its exit plays.
let leftPage = 0;

/** Note the inner page on screen just before the deck shows another section (useMobileNavigation's show). */
export function noteLeftInnerPage(index: number) {
  leftPage = index;
}

/** The inner page the section being left was on. */
export function leftInnerPage() {
  return leftPage;
}

/** The longest any hand-over holds the section being left, should the next section never announce itself. */
export const HANDOVER_LIMIT_MS = 1500;
