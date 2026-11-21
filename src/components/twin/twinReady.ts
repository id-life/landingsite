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
 * How long a far jump's cover (and the first-visit loader on a direct landing) waits for the avatar before it lifts
 * anyway, counted from the moment the page has jumped under the cover. Derived 2026-11-21 from 10 cold far jumps from
 * Mission on the laptop version, with the models fetched over a throttled connection of 20 Mbit/s and 40 ms latency:
 * the avatar's first frame came 0.83 to 0.87 s after the jump (95th percentile about 0.87 s); that plus a quarter is
 * 1,100 ms. On that connection no frame shows the stage without the avatar. A slower connection (5 Mbit/s, 150 ms:
 * about 3.4 s) is deliberately not waited for: a blank cover for that long reads as a page that has stopped, and by a
 * menu jump the first-input preload has usually loaded the models already. Re-derive from the same measurement if the
 * avatar's files change.
 */
export const TWIN_COVER_LIMIT_MS = 1100;

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
