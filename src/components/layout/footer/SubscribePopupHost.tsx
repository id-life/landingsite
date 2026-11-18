'use client';

import dynamic from 'next/dynamic';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { mayOpenSubscribeByItself } from '@/atoms/auto-subscribe';
import { isSubscribeShowAtom, subscribePopupAtom } from '@/atoms/footer';
import { isReducedMotion } from '@/motion/preference';
import { announceSubscribeState, SUBSCRIBE_REQUEST_EVENT, type SubscribeRequest } from '@/components/site/subscribe-events';
import { PHONE_TREE_QUERY } from '@/styles/device-classes';

const SubscribeStrip = dynamic(() => import('@/components/layout/footer/SubscribeStrip'), { ssr: false });
const SubscribeSheet = dynamic(() => import('@/components/layout/footer/SubscribeSheet'), { ssr: false });

/**
 * Connects the SUBSCRIBE buttons (DOM events) to the popup's state (subscribePopupAtom): a request becomes an atom
 * action, every change of the open state is announced back, and a page scroll closes the popup without counting as
 * a dismissal. Used by the experience (Home) and by SubscribePopupHost on content pages.
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

/**
 * The experience's popup opens by itself once, when `arrived` turns true (the end of the intro, so never over the
 * loader or during a move), as on the original (the owner's answer 5c): on both decks and on every section a visit
 * lands on, until a close is remembered (mayOpenSubscribeByItself), and not with the reduced-motion preference.
 */
export function useSubscribeOnArrival(arrived: boolean) {
  const dispatch = useSetAtom(subscribePopupAtom);
  const done = useRef(false);
  useEffect(() => {
    if (!arrived || done.current) return;
    done.current = true;
    if (mayOpenSubscribeByItself(isReducedMotion())) dispatch({ type: 'open', placement: 'auto' });
  }, [arrived, dispatch]);
}

/** The content pages' popup, loaded on the first request: the phone or desktop popup by the phone tree query. */
export default function SubscribePopupHost({ first }: { first: SubscribeRequest }) {
  useSubscribeBridge(first);
  const [variant] = useState<'phone' | 'desktop'>(() => (window.matchMedia(PHONE_TREE_QUERY).matches ? 'phone' : 'desktop'));
  return variant === 'phone' ? <SubscribeSheet /> : <SubscribeStrip />;
}
