import { hasShownAutoSubscribeAtom } from '@/atoms';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { fadeInAnimCompletedAtom } from '@/atoms/geo';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import jsonp from '@/utils/jsonp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { trackEvent } from './useGA';
import { useThrottle } from './useThrottle';

type Inputs = {
  EMAIL: string;
  u: string;
  'amp;id': string;
  'amp;f_id': string;
};

export function useSubscribeAction() {
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isSubscribeShowAtom);
  const playingRef = useRef<boolean>(false);
  const timelineRef = useRef<GSAPTimeline>(gsap.timeline({ paused: true }));
  const { contextSafe } = useGSAP();
  const fadeInAnimCompleted = useAtomValue(fadeInAnimCompletedAtom);
  const [hasShownAuto, setHasShownAuto] = useAtom(hasShownAutoSubscribeAtom);

  // Initialize timeline
  useGSAP(
    () => {
      if (!fadeInAnimCompleted) return;
      const tl = gsap.timeline({ paused: true });
      tl.to('.page-footer', { bottom: '2.25rem', duration: 0.3 });
      tl.to('.footer-box-clip', { width: '40rem', height: '13rem', duration: 0.3 }, '<');
      timelineRef.current = tl;
    },
    { dependencies: [fadeInAnimCompleted] },
  );

  const yoyoAnim = contextSafe(() => {
    if (playingRef.current) return;
    playingRef.current = true;
    gsap.to('.footer-box-clip', {
      x: 10,
      repeat: 5,
      yoyo: true,
      duration: 0.1,
      onComplete: () => {
        playingRef.current = false;
      },
    });
  });

  const handleStart = useCallback(() => {
    timelineRef.current?.play();
    setIsSubscribeShow(true);
  }, [setIsSubscribeShow]);

  const handleClose = () => {
    console.log('handleClose', isSubscribeShow, playingRef.current, timelineRef.current);
    timelineRef.current?.reverse();
    setIsSubscribeShow(false);
    setHasShownAuto(true);
  };

  const onSubscribeClick = () => {
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.NAV,
    });

    if (isSubscribeShow) {
      yoyoAnim();
    } else {
      handleStart();
    }
  };

  const handleScroll = useThrottle(() => {
    if (isSubscribeShow && !timelineRef.current.reversed()) {
      handleClose();
    }
  }, 300);

  const handleClickOutside = (e: MouseEvent) => {
    e.stopPropagation();
    if (isSubscribeShow && !playingRef.current) {
      const target = e.target as Element;
      const isClickFooter = target.closest('.footer-box-clip');
      const isClickSubscribeBtn = target.closest('#subscribe-btn');
      if (!isClickFooter && !isClickSubscribeBtn) {
        handleClose();
      }
    }
  };

  // Auto-popup logic, only play when first time load
  useEffect(() => {
    if (hasShownAuto || !fadeInAnimCompleted) return;
    handleStart();
  }, [fadeInAnimCompleted, handleStart, hasShownAuto]);

  return {
    hasShownAuto,
    timelineRef,
    onSubscribeClick,
    handleScroll,
    handleClickOutside,
    handleClose,
  };
}

export function useMobileSubscribeAction() {
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isSubscribeShowAtom);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const fadeInAnimCompleted = useAtomValue(fadeInAnimCompletedAtom);
  const [hasShownAuto, setHasShownAuto] = useAtom(hasShownAutoSubscribeAtom);

  const handleClose = useCallback(() => {
    setIsSubscribeShow(false);
    setHasShownAuto(true);
  }, [setIsSubscribeShow, setHasShownAuto]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (subscribeRef.current && !subscribeRef.current.contains(e.target as Node)) {
        handleClose();
      }
    },
    [handleClose],
  );

  const onFormSubmit: SubmitHandler<Inputs> = async (formData) => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => params.append(key, value));
    const querystring = params.toString();
    setIsSubmitting(true);
    jsonp(`https://life.us11.list-manage.com/subscribe/post-json?${querystring}`).finally(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    });

    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.FOOTER,
    });
  };

  // Auto-popup logic, only play when first time load
  useEffect(() => {
    if (hasShownAuto || !fadeInAnimCompleted) return;
    setIsSubscribeShow(true);
  }, [fadeInAnimCompleted, hasShownAuto, setIsSubscribeShow]);

  useEffect(() => {
    if (isSubscribeShow) {
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isSubscribeShow]);

  return {
    isSubscribeShow,
    subscribeRef,
    handleClickOutside,
    onFormSubmit,
    isSubmitting,
    isSubmitted,
    handleClose,
  };
}
