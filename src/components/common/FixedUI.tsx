'use client';

import FixedConnect from '@/app/connect/FixedConnect';
import NewFixedConnect from '@/app/connect/NewFixedConnect';
import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { isBePartOfItShowAtom } from '@/atoms/character-relation';
import { fadeInAnimCompletedAtom } from '@/atoms/geo';
import DesktopAudioPlayer from '@/components/audio/DesktopAudioPlayer';
import MobileAudioPlayer from '@/components/audio/MobileAudioPlayer';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { cn } from '@/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, ReactNode, useEffect, useMemo } from 'react';
import { NAV_LIST } from '../nav/nav';
import { ClientOnly } from './ClientOnly';
import PageArrows from './PageArrows';
import ScrollButton from './ScrollButton';
import SectionPager from './SectionPager';
import StartButton from './StartButton';
import VerticalCarousel from './VerticalCarousel';

/**
 * The fixed controls over the experience, one component for both decks (RWD-02; it was PCFixedUI and MobileFixedUI).
 * What differs is real and is the `deck` property:
 * - the first screen's control: SCROLL on the desktop deck, START on the paged deck (different labels and actions);
 * - the section control: the desktop deck's arrows (a continuous deck) against the paged deck's SectionPager;
 * - the slogan carousel: the desktop deck's bottom-left carousel; on the paged deck the hero shows its own (Vision);
 * - Connect's fixed parts: NewFixedConnect on the desktop deck, FixedConnect's single page on the paged deck;
 * - the music player: on the desktop deck it is rendered before the page content (AudioPlayer below, for the Tab
 *   order); on the paged deck it sits here, the compact player.
 * The wrapper's id differs too (#pc-fixed-ui / #mobile-fixed-ui): the intro tweens and the dragon read them.
 */
export default function FixedUI({ deck }: { deck: 'desktop' | 'phone' }) {
  const desktopPage = useAtomValue(currentPageAtom);
  const phonePage = useAtomValue(mobileCurrentPageAtom);
  const currentPage = deck === 'desktop' ? desktopPage : phonePage;
  // Visible from state; the intro tween only animates it on a first visit.
  const uiVisible = useAtomValue(fadeInAnimCompletedAtom);
  const onHero = currentPage.id === NAV_LIST[0].id;

  if (deck === 'phone') {
    return (
      <div id="mobile-fixed-ui" className={uiVisible ? 'opacity-100' : 'opacity-0'}>
        {onHero ? (
          <StartButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7 shortScreen:bottom-2" />
        ) : (
          <SectionPager className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2" />
        )}
        <FixedConnect />
        <ClientOnly>
          <MobileAudioPlayer className="fixed bottom-7 right-4 z-10" />
        </ClientOnly>
      </div>
    );
  }

  return (
    <div id="pc-fixed-ui" className={uiVisible ? 'opacity-100' : 'opacity-0'}>
      {onHero ? (
        <ScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <PageArrows className={cn('fixed left-1/2 -translate-x-1/2', 'bottom-11 mobile:bottom-6')} />
      )}

      <CarouselWrapper />
      <NewFixedConnect />
    </div>
  );
}

/**
 * The desktop deck's music player. Rendered before the page content (Home), not inside FixedUI, so its buttons are early Tab
 * stops: inside FixedUI they came after every link of the seven sections. It fades in with the fixed UI.
 */
export function AudioPlayer() {
  const uiReady = useAtomValue(fadeInAnimCompletedAtom);
  return (
    <div className={cn('transition-opacity duration-300', uiReady ? 'opacity-100' : 'opacity-0')}>
      <ClientOnly>
        <DesktopAudioPlayer className="fixed bottom-10 right-10 z-[51]" />
      </ClientOnly>
    </div>
  );
}

const CarouselWrapper = memo(() => {
  return (
    CAROUSEL_ITEMS?.length > 0 && (
      <VerticalCarousel
        slideDown
        itemHeight={48}
        duration={5}
        transition={0.6}
        // The original's 25 units; in the tablet tiers its 1440 px width (300 px), as the text there is its 1440 size.
        className={cn(
          'scroll-title pointer-events-none fixed bottom-10 left-10 z-30 w-[25rem]',
          '[@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:w-[300px]',
        )}
      >
        {CAROUSEL_ITEMS?.map((item) => (
          <CarouselItem key={item.cnText ?? item.text} {...item} />
        ))}
      </VerticalCarousel>
    )
  );
});

CarouselWrapper.displayName = 'CarouselWrapper';

export function CarouselItem({
  text,
  cnText,
  icon,
  textClass,
}: {
  text?: string;
  cnText?: string;
  icon: ReactNode;
  textClass?: string;
}) {
  const content = useMemo(() => {
    if (text)
      return (
        <p
          className={cn(
            // The original's sizes (the owner's rule on font sizes).
            'line-clamp-2 text-left text-base/4.5 mobile:text-center mobile:text-sm/4.5 mobile:font-bold',
            textClass,
          )}
        >
          {text}
        </p>
      );
    if (cnText)
      return (
        <p
          className={cn(
            'bilingual-font line-clamp-2 text-left text-xl/6 mobile:text-center mobile:text-base/5 mobile:font-bold',
            textClass,
          )}
        >
          {cnText}
        </p>
      );

    return '';
  }, [cnText, text, textClass]);

  return (
    <div className="flex items-center gap-1 text-base/4.5 font-bold uppercase text-foreground mobile:justify-center">
      {icon}
      {content}
    </div>
  );
}
