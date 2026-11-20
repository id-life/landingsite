// A first load lists the route's chunks as <script async> tags in the HTML. When the runtime later needs one of them it
// does not fetch it again: webpack's script loader finds the tag by its address and waits for that tag's load or error
// event. If the tag's download had already failed by then (a dropped connection), that event is gone, so webpack waits
// for its own two-minute timeout, and until then the page stays drawn but dead (no error page, nothing works). Whether
// the failure lands before or after webpack starts waiting is timing, so the same failure gave the route error page on
// one load and a dead page on the next.
//
// This removes that timing: before webpack reuses a tag, a tag whose download has already ended (it failed, since a
// chunk that loaded is installed and never asked for again) is removed, so webpack inserts a fresh one and gets a real
// load or error. An error then reaches the route's error page (the header and "Reload") every time, as on a client
// navigation. A tag still downloading is left alone, so nothing is fetched twice on a normal load.

type ScriptLoader = (url: string, done: (event?: unknown) => void, key?: string, chunkId?: string | number) => void;
type Runtime = { l?: ScriptLoader & { retriesFailedTags?: true } };

/** Wraps webpack's script loader (`__webpack_require__.l`) once; a runtime without one (Turbopack) is left as it is. */
export function retryFailedServerChunks(runtime: Runtime | undefined, doc: Document, perf: Performance): void {
  const load = runtime?.l;
  if (!runtime || !load || load.retriesFailedTags) return;
  // Downloads that failed after this ran are known from their error event; ones that failed earlier, from the
  // download's Resource Timing entry (a download that has ended, whether it loaded or failed, has one).
  const failed = new Set<string>();
  doc.addEventListener(
    'error',
    (event) => {
      const tag = event.target;
      if (tag instanceof HTMLScriptElement && tag.src) failed.add(tag.src);
    },
    true,
  );
  const ended = (absolute: string) => failed.has(absolute) || perf.getEntriesByName(absolute, 'resource').length > 0;
  const wrapped: ScriptLoader = (url, done, key, chunkId) => {
    if (key !== undefined) {
      for (const tag of Array.from(doc.getElementsByTagName('script'))) {
        // Only tags the server listed (webpack's own carry data-webpack and are removed by webpack when they end).
        if (tag.getAttribute('src') === url && !tag.hasAttribute('data-webpack') && ended(tag.src)) tag.remove();
      }
    }
    return load(url, done, key, chunkId);
  };
  runtime.l = Object.assign(wrapped, { retriesFailedTags: true as const });
}
