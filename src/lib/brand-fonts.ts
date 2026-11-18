/**
 * Requests a brand face ahead of the text that uses it, so that text is never laid out in its fallback first.
 *
 * The faces are not preloaded (src/styles/fonts.ts: next/font would preload them on every route, content pages
 * included, at the highest priority). A browser requests a font only once text using it is laid out, so START, SCROLL
 * and BACK (Migrena) and the phone menu (TT Lakes) were drawn in the fallback until their file arrived: about 0.5 s and
 * 1 s on a slow phone link. `cssVar` is the face's next/font variable (`--font-migrena`), whose value is the generated
 * family list; loading it fetches the face's one file (declared for weights 100 to 900). Once per face; a failure only
 * leaves the browser's own behaviour in place.
 */
const requested = new Set<string>();

export function loadBrandFace(cssVar: '--font-migrena' | '--font-tt') {
  if (requested.has(cssVar) || typeof document === 'undefined' || !document.fonts?.load) return;
  const family = getComputedStyle(document.body).getPropertyValue(cssVar).trim();
  if (!family) return;
  requested.add(cssVar);
  document.fonts.load(`700 16px ${family}`).catch(() => requested.delete(cssVar));
}

/** Runs `fn` once the page has loaded and the main thread is idle (at most `timeout` ms after load). */
export function whenIdleAfterLoad(fn: () => void, timeout = 2000): () => void {
  let idle = 0;
  let timer = 0;
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(fn, { timeout });
    else timer = window.setTimeout(fn, 200);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    window.removeEventListener('load', schedule);
    if (idle) window.cancelIdleCallback(idle);
    if (timer) window.clearTimeout(timer);
  };
}
