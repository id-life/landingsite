'use client';

import { useSetAtom } from 'jotai';
import { useGA } from '@/hooks/useGA';
import Logo from '@/components/nav/Logo';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { useEffect, useRef } from 'react';

export default function AboutHeader() {
  const { trackEvent } = useGA();
  const subscribeRef = useRef<HTMLDivElement>(null);

  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);

  const onSubscribeClick = (event?: any) => {
    event.stopPropagation();
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.NAV,
    });
    setIsSubscribeShow(true);
  };

  useEffect(() => {
    subscribeRef.current?.addEventListener('mousedown', (event) => {
      event.stopPropagation();
    });
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between p-10 text-foreground mobile:gap-0 mobile:p-5">
      <Logo />
      <div id="subscribe-btn" className="flex h-12 mobile:h-auto mobile:items-center">
        <div
          ref={subscribeRef}
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
