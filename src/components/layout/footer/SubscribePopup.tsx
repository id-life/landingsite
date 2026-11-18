'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { mayOpenSubscribeByItself } from '@/atoms/auto-subscribe';
import { SUBSCRIBE_REQUEST_EVENT, type SubscribeRequest } from '@/components/site/subscribe-events';
import { isReducedMotion } from '@/motion/preference';

// The popup, its state (jotai) and its animation code load only when the visitor first asks for it (PERF-10).
const SubscribePopupHost = dynamic(() => import('./SubscribePopupHost'), { ssr: false });

/**
 * The SUBSCRIBE popup of the content pages (news, podcast, About, the Spectrum tools, 404). It opens only from a
 * SUBSCRIBE button (an `idl:subscribe` event, src/components/site/subscribe-events.ts); the first request loads
 * SubscribePopupHost, which then owns the popup and answers every later request.
 *
 * `openOnArrival` (news and podcast, the pages where the original does it, the owner's answer 5c): it also opens by
 * itself as the page arrives, until a close is remembered, and not with the reduced-motion preference.
 */
export default function SubscribePopup({ openOnArrival = false }: { openOnArrival?: boolean }) {
  const [first, setFirst] = useState<SubscribeRequest | null>(null);
  useEffect(() => {
    if (first) return;
    if (openOnArrival && mayOpenSubscribeByItself(isReducedMotion())) {
      const arrive = setTimeout(() => setFirst({ type: 'open', placement: 'auto' }), 0);
      return () => clearTimeout(arrive);
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
