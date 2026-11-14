'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Footer from '@/components/layout/footer/Footer';
import { useAtom } from 'jotai';
import { isSubscribeShowAtom, subscribeTypeAtom } from '@/atoms/footer';
import { hasShownAutoSubscribeAtom } from '@/atoms/auto-subscribe';
import gsap from 'gsap';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { trackEvent } from '@/hooks/useGA';

export default function PodcastSubscribeFooter() {
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isSubscribeShowAtom);
  const [subscribeType, setSubscribeType] = useAtom(subscribeTypeAtom);
  const [hasShownAuto, setHasShownAuto] = useAtom(hasShownAutoSubscribeAtom);
  const timelineRef = useRef<GSAPTimeline | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkElement = () => {
      const footerEl = document.querySelector('.page-footer');
      if (footerEl) {
        setIsReady(true);
      } else {
        requestAnimationFrame(checkElement);
      }
    };
    checkElement();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const tl = gsap.timeline({ paused: true });
    tl.to('.page-footer', { bottom: '2.25rem', duration: 0.3 });
    tl.to('.footer-box-clip', { width: '40rem', height: '13rem', duration: 0.3 }, '<');
    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Auto-popup: once, when the reader is 60% of the way down the page (it used to open on arrival
  // and close on the first scroll, which also marked it as seen forever).
  const [engaged, setEngaged] = useState(false);
  useEffect(() => {
    if (hasShownAuto) return;
    const check = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.6) setEngaged(true);
    };
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [hasShownAuto]);

  useEffect(() => {
    if (!isReady || hasShownAuto || !engaged) return;

    setIsSubscribeShow(true);
    setSubscribeType('first');
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_SHOW,
      label: GA_EVENT_LABELS.SUBSCRIBE_SHOW.FIRST,
    });
  }, [isReady, hasShownAuto, engaged, setIsSubscribeShow, setSubscribeType]);

  const handleClose = useCallback(() => {
    timelineRef.current?.reverse();
    setIsSubscribeShow(false);
    setHasShownAuto(true);

    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_CLOSE,
      label: subscribeType ?? GA_EVENT_LABELS.SUBSCRIBE_CLOSE.FOOTER,
    });
  }, [setIsSubscribeShow, setHasShownAuto, subscribeType]);

  useEventBus(MessageType.CLOSE_SUBSCRIBE, handleClose);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSubscribeShow) {
        const target = e.target as Element;
        const isClickFooter = target.closest('.footer-box-clip');
        const isClickSubscribeBtn = target.closest('#subscribe');
        if (!isClickFooter && !isClickSubscribeBtn) {
          handleClose();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSubscribeShow, handleClose]);

  useEffect(() => {
    if (isSubscribeShow && timelineRef.current) {
      timelineRef.current.play();
    }
  }, [isSubscribeShow]);

  return <Footer />;
}
