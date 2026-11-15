import { onSectionView, type SectionView } from './section-view';

/**
 * The gtag commands that start the GA4 stream once consent allows it (DATA-05, DATA-08). Kept apart from the boot
 * component so test/analytics-stream.test.mjs can check them without a browser.
 *
 * Nothing page-specific goes into config: values given to config stick to every later hit of the stream, so a
 * page_location there filed later events under the landing URL and a page_title there stamped one title on every
 * section's page_view. The landing page_view is sent explicitly instead, with the URL, title and referrer the head
 * script captured before any section change or URL clean-up.
 *
 * Section views (./section-view.ts): the ones made before gtag/js loaded are sent when it has loaded (its history
 * listener did not exist to see them); after that, GA4's own history listener counts them (enhanced measurement), and
 * a view it did not record within VIEW_CHECK_MS (two quick changes reach it as one) is sent here, once.
 */
export type Landing = { href: string; referrer: string; title: string };

type Options = { layout?: string; internal: boolean; debug: boolean; gaId: string };

/** How long the tag's history listener gets to record a section change before it is sent by hand. */
export const VIEW_CHECK_MS = 2000;

const gtag = (...args: unknown[]) => window.gtag?.(...args);
const pathOf = (href: string) => {
  try {
    return new URL(href).pathname;
  } catch {
    return href;
  }
};

/** Whether GA4's history listener recorded a change to `path` in window.dataLayer from index `from` on. */
function recordedByListener(path: string, from: number) {
  const layer = (window.dataLayer ?? []) as unknown[];
  for (let i = from; i < layer.length; i += 1) {
    const item = layer[i] as Record<string, unknown> | null;
    if (item && item.event === 'gtm.historyChange-v2' && pathOf(String(item['gtm.newUrl'] ?? '')) === path) return true;
  }
  return false;
}

export function startStream(landing: Landing, { layout, internal, debug, gaId }: Options) {
  const traffic = internal ? { traffic_type: 'internal' } : {};
  const pageView = (href: string, title: string) =>
    gtag('event', 'page_view', { page_location: href, page_title: title, ...traffic });
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

  return function onTagLoaded() {
    const loadedAt = Date.now();
    let lastPath = pathOf(landing.href);
    let mark = (window.dataLayer ?? []).length;
    onSectionView((view: SectionView) => {
      const path = pathOf(view.href);
      if (view.at <= loadedAt) {
        // Before the listener existed: one page_view per change of section, in order.
        if (path !== lastPath) pageView(view.href, view.title);
        lastPath = path;
        return;
      }
      const from = mark;
      mark = (window.dataLayer ?? []).length;
      window.setTimeout(() => {
        if (!recordedByListener(path, from)) pageView(view.href, view.title);
      }, VIEW_CHECK_MS);
    });
    // The address moved without a recorded view (the deep-link mapping, say): count where the visitor is now.
    if (window.location.pathname !== lastPath) pageView(window.location.href, document.title);
  };
}
