'use client';

import FixedConnect from '@/app/connect/FixedConnect';
import { mobileCurrentPageAtom } from '@/atoms';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useAtomValue } from 'jotai';
import MobileAudioPlayer from '../audio/MobileAudioPlayer';
import { NAV_LIST } from '../nav/nav';
import MobilePageArrows from './MobilePageArrows';
import MobileScrollButton from './MobileScrollButton';

export default function MobileFixedUI() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  return (
    <div id="mobile-fixed-ui" className="opacity-0">
      {currentPage.id === NAV_LIST[0].id ? (
        <MobileScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7" />
      ) : (
        <MobilePageArrows className="fixed bottom-6 left-1/2 -translate-x-1/2" />
      )}

      <FixedConnect />
      <ClientOnly>
        <MobileAudioPlayer className="fixed bottom-7 right-4 z-10" />
      </ClientOnly>
    </div>
  );
}
