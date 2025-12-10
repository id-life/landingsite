'use client';

import NewFixedConnect from '@/app/connect/NewFixedConnect';
import { currentPageAtom } from '@/atoms';
import { isBePartOfItShowAtom } from '@/atoms/character-relation';
import DesktopAudioPlayer from '@/components/audio/DesktopAudioPlayer';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, ReactNode, useEffect, useMemo } from 'react';
import { NAV_LIST } from '../nav/nav';
import { ClientOnly } from './ClientOnly';
import FixedParticles from './FixedParticles';
import PageArrows from './PageArrows';
import ScrollButton from './ScrollButton';
import VerticalCarousel from './VerticalCarousel';

export default function PCFixedUI() {
  const { trackEvent } = useGA();
  const currentPage = useAtomValue(currentPageAtom);
  const setIsBePartOfItShow = useSetAtom(isBePartOfItShowAtom);

  return (
    <div id="pc-fixed-ui" className="opacity-0">
      {currentPage.id === NAV_LIST[0].id ? (
        <ScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <PageArrows className={cn('fixed left-1/2 -translate-x-1/2', 'bottom-11 mobile:bottom-6')} />
      )}

      <CarouselWrapper />
      <ClientOnly>
        <DesktopAudioPlayer className="fixed bottom-10 right-10 z-[51]" />
      </ClientOnly>
      <NewFixedConnect />
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
        className={cn('scroll-title fixed bottom-10 left-10 z-30 w-[25rem]')}
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
