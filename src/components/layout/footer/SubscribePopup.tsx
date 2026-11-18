'use client';

import { type ComponentType, useEffect, useState } from 'react';
import { mayOpenSubscribeByItself } from '@/atoms/auto-subscribe';
import { SUBSCRIBE_REQUEST_EVENT, type SubscribeRequest } from '@/components/site/subscribe-events';
import { isReducedMotion } from '@/motion/preference';
import { DESKTOP_TREE_QUERY, PHONE_TREE_QUERY } from '@/styles/device-classes';

type Loaded = { Host: typeof import('./SubscribePopupHost').default; Popup: ComponentType };

/**
 * The SUBSCRIBE popup of the content pages (news, podcast, About, the Spectrum tools, 404). It opens only from a
 * SUBSCRIBE button (an `idl:subscribe` event, src/components/site/subscribe-events.ts); the first request loads
 * SubscribePopupHost, which then owns the popup and answers every later request.
 *
 * `openOnArrival` (news and podcast, the pages where the original does it, the owner's answer 5c): on the laptop deck
 * it also opens by itself as the page arrives, until a close is remembered, and not with the reduced-motion
 * preference; on the phone deck it does not, as on the original.
 */
export default function SubscribePopup({ openOnArrival = false }: { openOnArrival?: boolean }) {
  const [first, setFirst] = useState<SubscribeRequest | null>(null);
  // The popup, its state (jotai) and its code load only on the first request (PERF-10), by a plain import() rendered
  // once loaded: next/dynamic's Suspense boundary held the loaded popup back a fixed 300 ms (React's reveal throttle)
  // after its code had arrived. A load that fails leaves the page as it is, and the next SUBSCRIBE tries again.
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  useEffect(() => {
    if (!first || loaded) return;
    let live = true;
    const phone = window.matchMedia(PHONE_TREE_QUERY).matches;
    Promise.all([import('./SubscribePopupHost'), phone ? import('./SubscribeSheet') : import('./SubscribeStrip')])
      .then(([host, popup]) => {
        if (live) setLoaded({ Host: host.default, Popup: popup.default });
      })
      .catch(() => {
        if (live) setFirst(null);
      });
    return () => {
      live = false;
    };
  }, [first, loaded]);

  useEffect(() => {
    if (first) return;
    const onRequest = (event: Event) => {
      const request = (event as CustomEvent<SubscribeRequest>).detail;
      if (request.type !== 'close') setFirst(request);
    };
    window.addEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
  }, [first]);

  // As soon as the page has hydrated (this effect) and painted (the next frame), not after the load event and an idle
  // moment: never ahead of the page's first paint.
  useEffect(() => {
    if (!openOnArrival) return;
    const frame = requestAnimationFrame(() => {
      // The laptop deck only (the original's phone opens nothing by itself here), until a close is remembered, and
      // not with the reduced-motion preference.
      if (!window.matchMedia(DESKTOP_TREE_QUERY).matches || !mayOpenSubscribeByItself(isReducedMotion())) return;
      setFirst((current) => current ?? { type: 'open', placement: 'auto' });
    });
    return () => cancelAnimationFrame(frame);
  }, [openOnArrival]);

  return first && loaded ? <loaded.Host first={first} Popup={loaded.Popup} /> : null;
}
