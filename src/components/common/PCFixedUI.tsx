'use client';

import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';
import BackSVG from '@/../public/svgs/back.svg?component';
import NewFixedValue from '@/app/value/NewFixedValue';
import { currentPageAtom } from '@/atoms';
import ToggleSoundButton from '@/components/common/ToggleSoundButton';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, ReactNode, useMemo } from 'react';
import { NAV_LIST } from '../nav/nav';
import { ClientOnly } from './ClientOnly';
import PageArrows from './PageArrows';
import ScrollButton from './ScrollButton';
import VerticalCarousel from './VerticalCarousel';
import { isBePartOfItShowAtom, isCharacterRelationShowAtom } from '@/atoms/character-relation';
import RippleButton from './RippleButton';

export default function PCFixedUI() {
  const currentPage = useAtomValue(currentPageAtom);
  const [isCharacterRelationShow, setIsCharacterRelationShow] = useAtom(isCharacterRelationShowAtom);
  const setIsBePartOfItShow = useSetAtom(isBePartOfItShowAtom);

  return (
    <>
      {currentPage.id === NAV_LIST[0].id ? (
        <ScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <PageArrows
          className={cn(
            'fixed left-1/2 -translate-x-1/2',
            // HAS_INNER_PAGE_LIST.includes(currentPage.id) ? 'bottom-5 mobile:bottom-6' :
            'bottom-11 mobile:bottom-6',
          )}
        />
      )}
      <div className="fixed-top fixed left-10 top-[calc(50%_-_18rem)] h-2 w-6 bg-foreground transition duration-300 mobile:left-5 mobile:top-[7.5rem] mobile:h-1 mobile:w-3" />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_16rem)] h-2 w-9 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:left-5 mobile:top-auto mobile:h-1 mobile:w-4.5" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:bottom-[7.5rem] mobile:right-5 mobile:top-auto mobile:h-2" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_18rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:right-[6.75rem] mobile:top-[7.5rem] mobile:h-2" />
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_18rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300 mobile:right-5 mobile:top-[7.5rem] mobile:h-2 mobile:w-2" />
      <CarouselWrapper />
      <ClientOnly>
        <ToggleSoundButton
          className={cn(
            'fixed bottom-10 right-10 z-10',
            isCharacterRelationShow && 'character-relation-css-vars-inject z-[51]',
          )}
        />
      </ClientOnly>
      {/*<FixedValue />*/}
      <NewFixedValue />
      {isCharacterRelationShow && (
        <div className="fixed bottom-11 left-1/2 z-[51] flex -translate-x-1/2 items-center gap-x-7.5">
          <button
            className="w-[11.625rem] rounded-full bg-red-600 py-3 text-center font-poppins text-base/5 font-bold tracking-normal text-white"
            onClick={() => setIsBePartOfItShow(true)}
          >
            BE PART OF IT +
          </button>

          <RippleButton onClick={() => setIsCharacterRelationShow(false)}>
            <BackSVG className="fill-white" />
            <p className="font-migrena text-base/4 font-bold uppercase text-white">Back</p>
          </RippleButton>
        </div>
      )}
    </>
  );
}

const CarouselWrapper = memo(() => {
  const isCharacterRelationShow = useAtomValue(isCharacterRelationShowAtom);

  return (
    CAROUSEL_ITEMS?.length > 0 && (
      <VerticalCarousel
        slideDown
        itemHeight={48}
        duration={5}
        transition={0.6}
        className={cn(
          'scroll-title fixed bottom-10 left-10 w-[25rem]',
          isCharacterRelationShow && 'character-relation-css-vars-inject',
        )}
      >
        {CAROUSEL_ITEMS?.map((item) => <CarouselItem key={item.cnText ?? item.text} {...item} />)}
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
