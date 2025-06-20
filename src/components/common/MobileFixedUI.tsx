'use client';

import VisionDecorationCircleSVG from '@/../public/svgs/vision/vision-decoration-3.svg?component';
import FixedValue from '@/app/value/FixedValue';
import { mobileCurrentPageAtom } from '@/atoms';
import { cn } from '@/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { NAV_LIST } from '../nav/nav';
import MobilePageArrows from './MobilePageArrows';
import MobileScrollButton from './MobileScrollButton';
import { ClientOnly } from '@/components/common/ClientOnly';
import ToggleSoundButton from '@/components/common/ToggleSoundButton';
import { isMobileBePartOfItShowAtom, isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';
import RippleButton from './RippleButton';
import BackSVG from '@/../public/svgs/back.svg?component';

export default function MobileFixedUI() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [isMobileCharacterRelationShow, setIsMobileCharacterRelationShow] = useAtom(isMobileCharacterRelationShowAtom);
  const setIsMobileBePartOfItShow = useSetAtom(isMobileBePartOfItShowAtom);

  return (
    <>
      {currentPage.id === NAV_LIST[0].id ? (
        <MobileScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <MobilePageArrows className="fixed bottom-6 left-1/2 -translate-x-1/2" />
      )}
      <div
        className={cn(
          'fixed-top fixed left-10 top-[calc(50%_-_14rem)] h-2 w-6 bg-foreground transition duration-300 mobile:left-5 mobile:top-[5.5rem] mobile:h-1 mobile:w-3',
        )}
      />
      <div className="fixed-bottom fixed left-10 top-[calc(50%_+_16rem)] h-2 w-9 bg-foreground transition duration-300 mobile:bottom-[5.5rem] mobile:left-5 mobile:top-auto mobile:h-1 mobile:w-4.5" />
      <div className="fixed-bottom fixed right-10 top-[calc(50%_+_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:bottom-[5.5rem] mobile:right-5 mobile:top-auto mobile:h-2" />
      <div className="fixed-top fixed right-[13.5rem] top-[calc(50%_-_14rem)] aspect-square h-4 bg-foreground transition duration-300 mobile:right-[6.75rem] mobile:top-[5.5rem] mobile:h-2" />
      <VisionDecorationCircleSVG className="fixed-top fixed right-10 top-[calc(50%_-_14rem)] h-4 w-4 fill-foreground stroke-foreground transition duration-300 mobile:right-5 mobile:top-[5.5rem] mobile:h-2 mobile:w-2" />
      <FixedValue />
      <ClientOnly>
        <ToggleSoundButton
          className={cn(
            'fixed bottom-7.5 right-5 z-[101] w-14 px-1.5',
            isMobileCharacterRelationShow && 'character-relation-css-vars-inject',
          )}
        />
      </ClientOnly>
      {isMobileCharacterRelationShow && (
        <>
          <button
            className="fixed bottom-6 left-5 z-[51] w-[5.25rem] cursor-pointer rounded-full bg-red-600 py-3 text-center font-poppins text-base/5 font-bold tracking-normal text-white"
            onClick={() => setIsMobileBePartOfItShow(true)}
          >
            JOIN +
          </button>
          <RippleButton
            className="fixed bottom-7 left-1/2 z-[51] -translate-x-1/2"
            onClick={() => setIsMobileCharacterRelationShow(false)}
          >
            <BackSVG className="fill-white" />
            <p className="font-migrena text-base/4 font-bold uppercase text-white">Back</p>
          </RippleButton>
        </>
      )}
    </>
  );
}
