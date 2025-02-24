'use client';

import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';
import FixedCard from '@/app/value/FixedCard';
import FixedValue from '@/app/value/FixedValue';
import { currentPageAtom } from '@/atoms';
import ToggleSoundButton from '@/components/common/ToggleSoundButton';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { ReactNode, useMemo } from 'react';
import { NAV_LIST } from '../nav/nav';
import { ClientOnly } from './ClientOnly';
import PageArrows from './PageArrows';
import ScrollButton from './ScrollButton';
import VerticalCarousel from './VerticalCarousel';

export default function PCFixedUI() {
  const currentPage = useAtomValue(currentPageAtom);
  return (
    <>
      {currentPage.id === NAV_LIST[0].id ? (
        <ScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <PageArrows
          className={cn(
            'fixed left-1/2 -translate-x-1/2',
            currentPage.id === NAV_LIST[2].id ? 'bottom-5 mobile:bottom-6' : 'bottom-11 mobile:bottom-6',
          )}
        />
      )}
      <div className="fixed-top fixed left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-foreground transition duration-300 mobile:left-5 mobile:top-[7.5rem] mobile:h-1 mobile:w-3" />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_16rem)] h-2 w-9 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:left-5 mobile:top-auto mobile:h-1 mobile:w-4.5" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:right-5 mobile:top-auto mobile:h-2" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:right-[6.75rem] mobile:top-[7.5rem] mobile:h-2" />
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_14rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300 mobile:right-5 mobile:top-[7.5rem] mobile:h-2 mobile:w-2" />
      {CAROUSEL_ITEMS?.length > 0 && (
        <VerticalCarousel
          isShuffle
          slideDown
          itemHeight={48}
          duration={5}
          transition={0.6}
          className="fixed bottom-10 left-10 w-[25rem] mobile:pointer-events-none mobile:inset-x-0 mobile:mobile:top-[calc(100svh_-_12.625rem)] mobile:w-auto"
        >
          {CAROUSEL_ITEMS?.map((item) => <CarouselItem key={item.cnText ?? item.text} {...item} />)}
        </VerticalCarousel>
      )}
      <ClientOnly>
        <ToggleSoundButton className="fixed bottom-10 right-10 z-10" />
      </ClientOnly>
      <FixedValue />
      <FixedCard />
    </>
  );
}

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
