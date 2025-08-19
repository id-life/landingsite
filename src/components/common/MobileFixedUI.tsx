'use client';

import FixedValue from '@/app/value/FixedValue';
import { mobileCurrentPageAtom } from '@/atoms';
import { ClientOnly } from '@/components/common/ClientOnly';
import MobileAudioPlayer from '../audio/MobileAudioPlayer';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { NAV_LIST } from '../nav/nav';
import MobilePageArrows from './MobilePageArrows';
import MobileScrollButton from './MobileScrollButton';
import RippleButton from './RippleButton';
import BackSVG from '@/../public/svgs/back.svg?component';

export default function MobileFixedUI() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  return (
    <div id="mobile-fixed-ui" className="opacity-0">
      {currentPage.id === NAV_LIST[0].id ? (
        <MobileScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <MobilePageArrows className="fixed bottom-6 left-1/2 -translate-x-1/2" />
      )}

      <FixedValue />
      <ClientOnly>
        <MobileAudioPlayer className="fixed bottom-8.5 right-5 z-10" />
      </ClientOnly>
    </div>
  );
}
