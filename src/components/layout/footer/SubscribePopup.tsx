'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { mayOpenSubscribeByItself } from '@/atoms/auto-subscribe';
import { SUBSCRIBE_REQUEST_EVENT, type SubscribeRequest } from '@/components/site/subscribe-events';
import { isReducedMotion } from '@/motion/preference';
import { DESKTOP_TREE_QUERY } from '@/styles/device-classes';

// The popup, its state (jotai) and its animation code load only when the visitor first asks for it (PERF-10).
const SubscribePopupHost = dynamic(() => import('./SubscribePopupHost'), { ssr: false });

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
  useEffect(() => {
    if (first) return;
    // The laptop deck only: on the phone the original opens nothing by itself on these pages.
    if (openOnArrival && window.matchMedia(DESKTOP_TREE_QUERY).matches && mayOpenSubscribeByItself(isReducedMotion())) {
      // Never ahead of the page: once it has loaded and the browser is idle (at most 50 ms later). The strip's own
      // chunk is fetched together with the host's, not after it.
      let idle = 0;
      const open = () => {
        void import('./SubscribeStrip');
        setFirst({ type: 'open', placement: 'auto' });
      };
      const whenIdle = () => {
        idle =
          typeof window.requestIdleCallback === 'function'
            ? window.requestIdleCallback(open, { timeout: 50 })
            : window.setTimeout(open, 0);
      };
      if (document.readyState === 'complete') whenIdle();
      else window.addEventListener('load', whenIdle, { once: true });
      return () => {
        window.removeEventListener('load', whenIdle);
        if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
        window.clearTimeout(idle);
      };
    }
    const onRequest = (event: Event) => {
      const request = (event as CustomEvent<SubscribeRequest>).detail;
      if (request.type !== 'close') setFirst(request);
    };
    window.addEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
  }, [first, openOnArrival]);

  return first ? <SubscribePopupHost first={first} /> : null;
}
