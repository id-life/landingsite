'use client';

import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { currentPageAtom } from '@/atoms';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { globalLoadedAtom } from '@/atoms/geo';
import Logo from '@/components/nav/Logo';
import { useNavigation } from '@/hooks/useNavigation';
import { useThrottle } from '@/hooks/useThrottle';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { NAV_LIST } from './nav';
import { useEvent } from 'react-use';

export default function PCNav() {
  const currentPage = useAtomValue(currentPageAtom);
  const { handleNavClick } = useNavigation();
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isSubscribeShowAtom);
  const playingRef = useRef<boolean>(false);
  const timelineRef = useRef(gsap.timeline({ paused: true }));
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const onSubscribeClick = () => {
    if (isSubscribeShow) {
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
    } else {
      timelineRef.current.play();
      setIsSubscribeShow(true);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', () => window.scrollTo({ top: 0 }));
    setTimeout(() => {
      timelineRef.current.to('.page-footer', { bottom: '2.25rem' });
      timelineRef.current.to('.footer-box-clip', { width: '40rem', height: '13rem' }, '<');
    }, 300);
  }, []);

  const handleScroll = useThrottle(() => {
    if (isSubscribeShow && !timelineRef.current.reversed()) {
      timelineRef.current.reverse();
      setIsSubscribeShow(false);
    }
  }, 300);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleClickOutside = (e: MouseEvent) => {
    e.stopPropagation();
    if (isSubscribeShow && !playingRef.current) {
      const target = e.target as Element;
      const isClickFooter = target.closest('.footer-box-clip');
      const isClickSubscribeBtn = target.closest('#subscribe-btn');
      if (!isClickFooter && !isClickSubscribeBtn) {
        timelineRef.current.reverse();
        setIsSubscribeShow(false);
      }
    }
  };

  useEvent('mousedown', handleClickOutside);

  if (!globalLoaded) return null;
  return (
    <div
      id="nav"
      className="fixed left-0 top-0 z-50 flex w-full items-center gap-15 p-10 text-foreground mobile:gap-0 mobile:p-5"
    >
      <Logo />
      <div className="flex gap-8 text-sm font-semibold mobile:hidden">
        {NAV_LIST.map((item) => (
          <div
            onClick={() => handleNavClick(item)}
            className={clsx(
              'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center font-bold uppercase',
              currentPage.id === item.id && 'nav-active',
            )}
            key={item.id}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div id="subscribe-btn" className="flex h-12 flex-1 justify-end mobile:h-auto mobile:items-center">
        <div
          onClick={onSubscribeClick}
          className="group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
          Subscribe
        </div>
      </div>
    </div>
  );
}
