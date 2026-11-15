'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { SUBSCRIBE_REQUEST_EVENT, type SubscribeRequest } from '@/components/site/subscribe-events';

// The popup, its state (jotai) and its animation code load only when the visitor first asks for it (PERF-10).
const SubscribePopupHost = dynamic(() => import('./SubscribePopupHost'), { ssr: false });

/**
 * The SUBSCRIBE popup of the content pages (news, podcast, About, the Spectrum tools, 404). It opens only from a
 * SUBSCRIBE button (an `idl:subscribe` event, src/components/site/subscribe-events.ts); the first request loads
 * SubscribePopupHost, which then owns the popup and answers every later request.
 */
export default function SubscribePopup() {
  const [first, setFirst] = useState<SubscribeRequest | null>(null);
  useEffect(() => {
    if (first) return;
    const onRequest = (event: Event) => {
      const request = (event as CustomEvent<SubscribeRequest>).detail;
      if (request.type !== 'close') setFirst(request);
    };
    window.addEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
  }, [first]);

  return first ? <SubscribePopupHost first={first} /> : null;
}
