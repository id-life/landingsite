'use client';

import FixedValue from '@/app/value/FixedValue';
import { mobileCurrentPageAtom } from '@/atoms';
import { ClientOnly } from '@/components/common/ClientOnly';
import MobileAudioPlayer from '../audio/MobileAudioPlayer';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { NAV_LIST } from '../nav/nav';
import MobilePageArrows from './MobilePageArrows';
import MobileScrollButton from './MobileScrollButton';
import { showDiseaseManagementContentAtom } from '@/atoms/spectrum';
import { isMobileBePartOfItShowAtom, isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';
import RippleButton from './RippleButton';
import BackSVG from '@/../public/svgs/back.svg?component';
import { useEffect } from 'react';
import MobileFixedParticles from './MobileFixedParticles';

export default function MobileFixedUI() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [isShowingDiseaseManagement, setIsShowingDiseaseManagement] = useAtom(showDiseaseManagementContentAtom);
  const [isMobileCharacterRelationShow, setIsMobileCharacterRelationShow] = useAtom(isMobileCharacterRelationShowAtom);
  const setIsMobileBePartOfItShow = useSetAtom(isMobileBePartOfItShowAtom);

  useEffect(() => {
    setIsShowingDiseaseManagement(false);
  }, [currentPage.id, setIsShowingDiseaseManagement]);

  return (
    <>
      {isShowingDiseaseManagement ? (
        <></>
      ) : currentPage.id === NAV_LIST[0].id ? (
        <MobileScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <MobilePageArrows className="fixed bottom-6 left-1/2 -translate-x-1/2" />
      )}
      <MobileFixedParticles isOverlay={isShowingDiseaseManagement} />

      <FixedValue />
      <ClientOnly>
        <MobileAudioPlayer className="fixed bottom-8.5 right-5 z-10" />
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
