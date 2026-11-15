'use client';

import dynamic from 'next/dynamic';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { isSubscribeShowAtom, subscribePopupAtom } from '@/atoms/footer';
import { announceSubscribeState, SUBSCRIBE_REQUEST_EVENT, type SubscribeRequest } from '@/components/site/subscribe-events';
import { PHONE_TREE_QUERY } from '@/styles/device-classes';

const Footer = dynamic(() => import('@/components/layout/footer/Footer'), { ssr: false });
const MobileFooter = dynamic(() => import('@/components/layout/footer/MobileFooter'), { ssr: false });

/**
 * Connects the SUBSCRIBE buttons (DOM events) to the popup's state (subscribePopupAtom): a request becomes an atom
 * action, every change of the open state is announced back, and a page scroll closes the popup without counting as
 * a dismissal. Used by the experience (Home, MobileHome) and by SubscribePopupHost on content pages.
 */
export function useSubscribeBridge(first?: SubscribeRequest) {
  const dispatch = useSetAtom(subscribePopupAtom);
  const open = useAtomValue(isSubscribeShowAtom);
  const firstDone = useRef(false);

  useEffect(() => {
    if (first && !firstDone.current) {
      firstDone.current = true;
      dispatch(first);
    }
    const onRequest = (event: Event) => dispatch((event as CustomEvent<SubscribeRequest>).detail);
    window.addEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(SUBSCRIBE_REQUEST_EVENT, onRequest);
  }, [dispatch, first]);

  useEffect(() => {
    announceSubscribeState(open);
    if (!open) return;
    const close = () => dispatch({ type: 'close', method: 'scroll' });
    window.addEventListener('scroll', close, { passive: true, once: true });
    return () => window.removeEventListener('scroll', close);
  }, [open, dispatch]);
}

/** The content pages' popup, loaded on the first request: the phone or desktop popup by the phone tree query. */
export default function SubscribePopupHost({ first }: { first: SubscribeRequest }) {
  useSubscribeBridge(first);
  const [variant] = useState<'phone' | 'desktop'>(() => (window.matchMedia(PHONE_TREE_QUERY).matches ? 'phone' : 'desktop'));
  return variant === 'phone' ? <MobileFooter /> : <Footer />;
}
