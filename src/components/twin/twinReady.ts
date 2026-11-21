/**
 * The Digital Twin's avatar is never uncovered empty (the lead's ruling of 2026-11-21: his site draws the avatar in
 * the first frame its stage is visible, on every arrival). Two parts that cover each other:
 * - its models start loading at the visitor's first real input on the laptop version (useTwinModelsOnFirstInput), so
 *   a visitor who has started using the site has them on the way long before a menu jump; a visitor who never
 *   touches the page downloads nothing more than before;
 * - a far jump's cover waits for the avatar's first drawn frame (whenTwinAvatarDrawn, through src/motion/coverHold),
 *   within a limit, so a failed download can never leave the visitor behind the cover.
 */

/** A press, a key, a wheel step or a touch. A pointer that only moves is not an input here. */
export const FIRST_INPUT_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/** Runs `run` once, at the first real input on `target`. Returns a cleanup that also cancels it. */
export function onFirstInput(target: EventTarget, run: () => void): () => void {
  let done = false;
  const options = { capture: true, passive: true } as const;
  const off = () => FIRST_INPUT_EVENTS.forEach((type) => target.removeEventListener(type, handle, options));
  function handle() {
    if (done) return;
    done = true;
    off();
    run();
  }
  FIRST_INPUT_EVENTS.forEach((type) => target.addEventListener(type, handle, options));
  return () => {
    done = true;
    off();
  };
}

/**
 * How long a far jump's cover waits for the avatar before it lifts anyway. PROVISIONAL: to be derived from the
 * measured cold case (its 95th percentile plus a margin) before the cover's timeline asks for it.
 */
export const TWIN_COVER_LIMIT_MS = 2500;

let drawn = false;
const waiters = new Set<() => void>();

/** Set by the Twin's canvas: true once a frame with the avatar has been drawn, false when the canvas is released. */
export function setTwinAvatarDrawn(value: boolean) {
  drawn = value;
  if (!value) return;
  for (const wake of [...waiters]) wake();
}

export function isTwinAvatarDrawn() {
  return drawn;
}

/** Resolves 'drawn' once the avatar has been drawn (at once if it has), or 'timeout' after limitMs. */
export function whenTwinAvatarDrawn(limitMs: number): Promise<'drawn' | 'timeout'> {
  if (drawn) return Promise.resolve('drawn');
  return new Promise((resolve) => {
    const wake = () => {
      waiters.delete(wake);
      clearTimeout(timer);
      resolve('drawn');
    };
    const timer = setTimeout(() => {
      waiters.delete(wake);
      resolve('timeout');
    }, limitMs);
    waiters.add(wake);
  });
}
