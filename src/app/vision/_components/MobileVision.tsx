import { mobileCurrentPageAtom } from '@/atoms';
import { globalLoadedAtom } from '@/atoms/geo';
import { CarouselItem } from '@/components/common/PCFixedUI';
import VerticalCarousel from '@/components/common/VerticalCarousel';
import { NAV_LIST } from '@/components/nav/nav';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';

export default function MobileVision() {
  const wrapperRef = useRef(null);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  return (
    <div
      ref={wrapperRef}
      id={NAV_LIST[0].id}
      className={cn('page-container-mobile', {
        hidden: currentPage?.id !== NAV_LIST[0].id,
      })}
    >
      {globalLoaded && (
        <VerticalCarousel
          isShuffle
          slideDown
          itemHeight={40}
          duration={5}
          transition={0.6}
          className="fixed-logo pointer-events-none fixed inset-x-0 top-[calc(50vh_+_8.5rem)] w-auto -translate-y-1/2"
        >
          {CAROUSEL_ITEMS.map((item) => (
            <CarouselItem key={item.cnText ?? item.text} {...item} />
          ))}
        </VerticalCarousel>
      )}
    </div>
  );
}
