/**
 * The gtag commands that start the GA4 stream once consent allows it (DATA-05, DATA-08). Kept apart from the boot
 * component so test/analytics-stream.test.mjs can check them without a browser.
 *
 * Nothing page-specific goes into config: values given to config stick to every later hit of the stream, so a
 * page_location there filed later events under the landing URL and a page_title there stamped one title on every
 * section's page_view. The landing page_view is sent explicitly instead, with the URL, title and referrer the head
 * script captured before any section change or URL clean-up.
 *
 * Section changes are counted by the tag's own history listener (enhanced measurement, page changes on history
 * events), which exists once gtag/js has run. A change made before that is invisible to it, so the returned
 * function, run on the script's load event, counts the section the visitor is on by then, once.
 */
export type Landing = { href: string; referrer: string; title: string };

type Options = { layout?: string; internal: boolean; debug: boolean; gaId: string };

const gtag = (...args: unknown[]) => window.gtag?.(...args);

export function startStream(landing: Landing, { layout, internal, debug, gaId }: Options) {
  const traffic = internal ? { traffic_type: 'internal' } : {};
  if (layout) {
    gtag('set', 'user_properties', { layout });
    gtag('set', { layout });
  }
  gtag('js', new Date());
  gtag('config', gaId, { send_page_view: false, ...traffic, ...(debug ? { debug_mode: true } : {}) });
  gtag('event', 'page_view', {
    page_location: landing.href,
    page_title: landing.title,
    page_referrer: landing.referrer,
    ...traffic,
  });
  const landedPath = new URL(landing.href).pathname;
  return function onTagLoaded() {
    if (window.location.pathname === landedPath) return;
    gtag('event', 'page_view', { page_location: window.location.href, page_title: document.title, ...traffic });
  };
}
