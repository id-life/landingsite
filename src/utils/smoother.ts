/**
 * The experience's ScrollSmoother, reached without importing gsap. Shared dialogs (src/components/dialog,
 * the video modal) pause it while they are open; on content pages there is none. Importing
 * gsap/ScrollSmoother there just to ask would put ScrollSmoother and ScrollTrigger into every content
 * page's bundle, so the experience registers the lookup (src/utils/gsap-plugins.ts) and this file has none.
 */
type Pausable = { paused: (value: boolean) => unknown };

let lookup: (() => Pausable | undefined | null) | null = null;

export function registerSmootherLookup(fn: () => Pausable | undefined | null) {
  lookup = fn;
}

/** Pause or resume the running ScrollSmoother, if any. */
export function pauseSmoother(paused: boolean) {
  lookup?.()?.paused(paused);
}
