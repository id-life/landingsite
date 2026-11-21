'use client';

import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtomValue } from 'jotai';
import { clsx } from 'clsx';
import { useRef } from 'react';
import { mobileCurrentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { CarouselItem } from '@/components/common/FixedUI';
import VerticalCarousel from '@/components/common/VerticalCarousel';
import { NAV } from '@/components/nav/nav';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { PAGE_IDS } from '@/constants/pages';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import HeroWordmarkButton from './HeroWordmarkButton';

/**
 * Mission, one component for both decks (RWD-02; it was Vision and MobileVision). Section changes are the section
 * controller's (src/motion/sectionController.ts). On the desktop deck it is the first page of the scrolled deck and
 * rests at the top; the slogan carousel there is part of the fixed UI (FixedUI, every section). On the phone deck it
 * is a panel shown while current, with the carousel under the wordmark.
 */
export default function Vision() {
  const phone = useDeviceProfile()?.tree === 'phone';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const current = useAtomValue(mobileCurrentPageAtom);

  // Elements, not selectors: inside a scope, '#vision_page' (the scope itself) and '#portfolio_page' (outside it)
  // matched nothing, and GSAP warned on every refresh (MOT-14).
  useGSAP(
    () => {
      const portfolio = document.getElementById(PAGE_IDS.PORTFOLIO);
      if (phone || !wrapperRef.current || !portfolio) return;
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top bottom',
        endTrigger: portfolio,
        end: 'top top',
        id: 'vision-trigger',
      });
    },
    { dependencies: [phone] },
  );

  if (phone) {
    return (
      <div
        ref={wrapperRef}
        id={NAV.vision_page.id}
        className={clsx('page-container-mobile', current.id !== NAV.vision_page.id && 'hidden')}
      >
        <HeroWordmarkButton fixed />
        {globalLoaded && (
          <VerticalCarousel
            slideDown
            itemHeight={40}
            scaleWithUnit
            duration={5}
            transition={0.6}
            // On a short window (under 480 px tall) the slogans keep their centred column but sit just above the hero
            // tagline (which the hero draws at 84 % of the window's height, measured), instead of under START: no
            // slogan letter under START or over the tagline, and a slogan keeps its full width (at most two lines).
            className="fixed-logo pointer-events-none fixed inset-x-0 top-[calc(60dvh_+_7.5rem)] w-auto -translate-y-1/2 shortScreen:bottom-[calc(16.2svh_+_0.25rem)] shortScreen:top-auto shortScreen:translate-y-0"
          >
            {CAROUSEL_ITEMS.map((item) => (
              <CarouselItem key={item.cnText ?? item.text} {...item} />
            ))}
          </VerticalCarousel>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} id={NAV.vision_page.id} className="page-container">
      <HeroWordmarkButton />
      <div className="group pointer-events-none absolute inset-0 -z-10 select-none"></div>
    </div>
  );
}
