'use client';

import FixedConnect from '@/app/connect/FixedConnect';
import { mobileCurrentPageAtom } from '@/atoms';
import { fadeInAnimCompletedAtom } from '@/atoms/geo';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useAtomValue } from 'jotai';
import MobileAudioPlayer from '../audio/MobileAudioPlayer';
import { NAV_LIST } from '../nav/nav';
import MobilePageArrows from './MobilePageArrows';
import MobileScrollButton from './MobileScrollButton';

export default function MobileFixedUI() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  // Visible from state (see MobileNav); the intro tween only animates it on a first visit.
  const uiVisible = useAtomValue(fadeInAnimCompletedAtom);

  return (
    <div id="mobile-fixed-ui" className={uiVisible ? 'opacity-100' : 'opacity-0'}>
      {currentPage.id === NAV_LIST[0].id ? (
        <MobileScrollButton className="fixed bottom-11 left-1/2 -translate-x-1/2 mobile:bottom-7 shortScreen:bottom-2" />
      ) : (
        <MobilePageArrows className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2" />
      )}

      <FixedConnect />
      <ClientOnly>
        <MobileAudioPlayer className="fixed bottom-7 right-4 z-10" />
      </ClientOnly>
    </div>
  );
}
