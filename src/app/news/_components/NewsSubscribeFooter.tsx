'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Footer from '@/components/layout/footer/Footer';
import { useAtom } from 'jotai';
import { isSubscribeShowAtom, subscribeTypeAtom } from '@/atoms/footer';
import gsap from 'gsap';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';

export default function NewsSubscribeFooter() {
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isSubscribeShowAtom);
  const [, setSubscribeType] = useAtom(subscribeTypeAtom);
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

  const handleClose = useCallback(() => {
    timelineRef.current?.reverse();
    setIsSubscribeShow(false);
  }, [setIsSubscribeShow]);

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
    const handleScroll = () => {
      if (isSubscribeShow) {
        handleClose();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSubscribeShow, handleClose]);

  useEffect(() => {
    if (isSubscribeShow && timelineRef.current) {
      timelineRef.current.play();
      setSubscribeType('news');
    }
  }, [isSubscribeShow, setSubscribeType]);

  return <Footer />;
}
