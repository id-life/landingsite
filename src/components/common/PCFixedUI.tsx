'use client';

import BackSVG from '@/../public/svgs/back.svg?component';
import NewFixedValue from '@/app/value/NewFixedValue';
import { currentPageAtom } from '@/atoms';
import { isBePartOfItShowAtom, isCharacterRelationShowAtom } from '@/atoms/character-relation';
import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';
import DesktopAudioPlayer from '@/components/audio/DesktopAudioPlayer';
import { CAROUSEL_ITEMS } from '@/constants/config';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, ReactNode, useEffect, useMemo } from 'react';
import { NAV_LIST } from '../nav/nav';
import { ClientOnly } from './ClientOnly';
import FixedParticles from './FixedParticles';
import PageArrows from './PageArrows';
import RippleButton from './RippleButton';
import ScrollButton from './ScrollButton';
import VerticalCarousel from './VerticalCarousel';

export default function PCFixedUI() {
  const { trackEvent } = useGA();
  const currentPage = useAtomValue(currentPageAtom);
  const [isShowingDiseaseManagement, setIsShowingDiseaseManagement] = useAtom(showDiseaseManagementContentAtom);
  const [isCharacterRelationShow, setIsCharacterRelationShow] = useAtom(isCharacterRelationShowAtom);
  const setIsBePartOfItShow = useSetAtom(isBePartOfItShowAtom);

  const handleBePartOfIt = () => {
    setIsBePartOfItShow(true);
    trackEvent({ name: GA_EVENT_NAMES.IN_POPUP });
  };

  useEffect(() => {
    setIsShowingDiseaseManagement(false);
  }, [currentPage, setIsShowingDiseaseManagement]);

  return (
    <div id="pc-fixed-ui" className="opacity-0">
      {isShowingDiseaseManagement ? (
        <></>
      ) : currentPage.id === NAV_LIST[0].id ? (
        <ScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <PageArrows className={cn('fixed left-1/2 -translate-x-1/2', 'bottom-11 mobile:bottom-6')} />
      )}
      <FixedParticles isOverlay={isShowingDiseaseManagement} />

      <CarouselWrapper />
      <ClientOnly>
        <DesktopAudioPlayer className="fixed bottom-10 right-10 z-[51]" />
      </ClientOnly>
      <NewFixedValue />
      {isCharacterRelationShow && (
        <div className="fixed bottom-11 left-1/2 z-[51] flex -translate-x-1/2 items-center gap-x-7.5">
          <button
            className="w-[11.625rem] rounded-full bg-red-600 py-3 text-center font-poppins text-base/5 font-bold tracking-normal text-white"
            onClick={handleBePartOfIt}
          >
            BE PART OF IT +
          </button>

          <RippleButton onClick={() => setIsCharacterRelationShow(false)}>
            <BackSVG className="fill-white" />
            <p className="font-migrena text-base/4 font-bold uppercase text-white">Back</p>
          </RippleButton>
        </div>
      )}
    </div>
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
          'scroll-title fixed bottom-10 left-10 z-30 w-[25rem]',
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
