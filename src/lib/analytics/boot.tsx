'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { GA_DEBUG_MODE, GA_ID, INTERNAL_FLAG_KEY, TRACKING_PARAMS, VERCEL_INSIGHTS_ENABLED } from './config';
import { getConsentState, startConsent, subscribeConsent } from './consent';
import ConsentBanner from '@/components/consent/ConsentBanner';
import { advanceStage } from './stage';
import { isInternalTraffic, setTrackLayout, setTrackMode, track } from './track';

const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js?id=';
/** Earliest the tag may load: 2 s after navigation start, after experience_ready or the first input, after load. */
const MIN_DELAY_MS = 2000;
/** Latest the gate waits for experience_ready or an input, from the boot module's mount. */
const GATE_CAP_MS = 4000;
/** Latest the gate then waits for the window load event (it can come late on the 3D routes). */
const LOAD_CAP_MS = 4000;

const gtag = (...args: unknown[]) => window.gtag?.(...args);

/** ?internal=1 marks this browser as internal traffic, ?internal=0 clears it. */
function applyInternalFlag() {
  const value = new URLSearchParams(window.location.search).get('internal');
  if (value === null) return;
  try {
    if (value === '1') localStorage.setItem(INTERNAL_FLAG_KEY, '1');
    else localStorage.removeItem(INTERNAL_FLAG_KEY);
  } catch {
    // Storage blocked: the flag cannot be remembered.
  }
}

/** Remove utm_*, gclid, fbclid, msclkid and internal from the address bar, keeping other parameters and the hash. */
export function stripTrackingParams() {
  const url = new URL(window.location.href);
  const keys = Array.from(url.searchParams.keys()).filter((k) => TRACKING_PARAMS.test(k));
  if (!keys.length) return;
  keys.forEach((k) => url.searchParams.delete(k));
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

function waitForGate(): Promise<void> {
  return new Promise((resolve) => {
    const inputs = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    let capTimer = 0;
    let minTimer = 0;
    let opened = false;
    const finish = () => {
      if (opened) return;
      opened = true;
      window.clearTimeout(capTimer);
      window.removeEventListener('idl:experience_ready', finish);
      inputs.forEach((type) => window.removeEventListener(type, finish, true));
      const wait = Math.max(0, MIN_DELAY_MS - performance.now());
      minTimer = window.setTimeout(resolve, wait);
    };
    void minTimer;
    if (window.__idl?.stage === 'ready') return finish();
    capTimer = window.setTimeout(finish, GATE_CAP_MS);
    window.addEventListener('idl:experience_ready', finish, { once: true });
    inputs.forEach((type) => window.addEventListener(type, finish, { capture: true, passive: true, once: true }));
  });
}

/** The load event, or LOAD_CAP_MS, whichever comes first: no third-party request competes with the page's own load. */
const whenLoaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === 'complete') return resolve();
    const timer = window.setTimeout(resolve, LOAD_CAP_MS);
    window.addEventListener(
      'load',
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

const whenIdle = () =>
  new Promise<void>((resolve) => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 2000 });
    else setTimeout(resolve, 200);
  });

let tagRequested = false;
let tagConfigured = false;

/** Load gtag/js once, then configure it with the landing URL captured by the head script. */
async function loadTag(layout: string | undefined) {
  if (tagRequested || !GA_ID) return;
  tagRequested = true;
  await waitForGate();
  await whenLoaded();
  await whenIdle();
  if (getConsentState().analytics !== 'granted') {
    tagRequested = false;
    return;
  }
  const landing = window.__landing ?? { href: window.location.href, referrer: document.referrer, title: document.title };
  // The landing URL (with its campaign) is in __landing: the address bar can lose the campaign parameters now,
  // before the tag's history listener exists, so the clean-up itself is never counted as a page view.
  stripTrackingParams();
  const script = document.createElement('script');
  script.async = true;
  script.src = `${GTAG_SRC}${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
  const internal = isInternalTraffic() ? { traffic_type: 'internal' } : {};
  if (layout) {
    gtag('set', 'user_properties', { layout });
    gtag('set', { layout });
  }
  gtag('js', new Date());
  gtag('config', GA_ID, {
    page_location: landing.href,
    page_referrer: landing.referrer,
    page_title: landing.title,
    ...internal,
    ...(GA_DEBUG_MODE ? { debug_mode: true } : {}),
  });
  // The visitor changed section before the tag existed: count where they are now, once. Later changes are
  // counted by the tag's own history listener (enhanced measurement, page changes on history events).
  const landedPath = new URL(landing.href).pathname;
  if (window.location.pathname !== landedPath) {
    gtag('event', 'page_view', { page_location: window.location.href, page_title: document.title, ...internal });
  }
  tagConfigured = true;
  setTrackMode('on');
}

function deleteGaCookies() {
  const host = window.location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  document.cookie
    .split('; ')
    .map((c) => c.split('=')[0])
    .filter((name) => /^_ga(_|$)/.test(name))
    .forEach((name) =>
      domains.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ''}`;
      }),
    );
}

/**
 * Mounted once in the root layout of analytics builds (DATA-08). Owns the Google tag: nothing else may load it.
 * It resolves consent, waits for the experience (or the first input, capped), loads gtag/js in the next idle
 * period and configures it with the landing URL; it also reports the layout, layout swaps, one visibility summary
 * per page load and the Core Web Vitals stream.
 */
export default function AnalyticsBoot() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentState, getConsentState);
  const isMobile = useIsMobile();
  const layout = isMobile === null ? undefined : isMobile ? 'mobile' : 'desktop';
  const layoutRef = useRef<typeof layout>(undefined);

  useEffect(() => {
    advanceStage('hydrated');
    applyInternalFlag();
    void startConsent();
    if (!VERCEL_INSIGHTS_ENABLED) void import('./vitals').then((m) => m.reportWebVitals());
  }, []);

  // Layout: a user property and page parameter at boot; a resize across 768 px is one layout_change.
  useEffect(() => {
    if (!layout) return;
    const previous = layoutRef.current;
    layoutRef.current = layout;
    setTrackLayout(layout);
    if (previous && previous !== layout) {
      if (tagConfigured) {
        gtag('set', 'user_properties', { layout });
        gtag('set', { layout });
      }
      track('layout_change', { from: previous, to: layout });
    }
  }, [layout]);

  useEffect(() => {
    if (consent.analytics === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      void loadTag(layoutRef.current);
    } else if (consent.analytics === 'denied') {
      setTrackMode('off');
      if (consent.reason !== 'automation' && consent.reason !== 'disabled') {
        gtag('consent', 'update', { analytics_storage: 'denied' });
        deleteGaCookies();
        // A refusal still cleans the shared link (DATA-08): nothing will report the landing campaign.
        stripTrackingParams();
      }
    }
  }, [consent.analytics, consent.reason]);

  // contact_intent for every mailto link on the site, server-rendered summaries and CMS text included; the link (or
  // an ancestor) names its placement with data-track-placement.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="mailto:"]');
      if (!link) return;
      const placement = link.closest('[data-track-placement]')?.getAttribute('data-track-placement') || 'page';
      track('contact_intent', { method: 'mailto', placement });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // One visibility_summary on pagehide when the tab spent at least a second hidden (replaces the 60 s heartbeat,
  // which kept sending from hidden tabs). The hide that comes with closing the tab itself does not count.
  useEffect(() => {
    let visible = document.visibilityState === 'visible';
    let since = performance.now();
    let hiddenMs = 0;
    let visibleMs = 0;
    let changes = 0;
    const settle = () => {
      const now = performance.now();
      if (visible) visibleMs += now - since;
      else hiddenMs += now - since;
      since = now;
    };
    const onVisibility = () => {
      settle();
      visible = document.visibilityState === 'visible';
      changes += 1;
    };
    const onPageHide = () => {
      settle();
      if (hiddenMs < 1000) return;
      track(
        'visibility_summary',
        { hidden_ms: Math.round(hiddenMs), visible_ms: Math.round(visibleMs), changes },
        { once: 'visibility_summary' },
      );
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);

  return <ConsentBanner />;
}
