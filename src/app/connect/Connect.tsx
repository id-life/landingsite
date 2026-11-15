'use client';

import { mobileCurrentPageAtom } from '@/atoms';
import { NAV } from '@/components/nav/nav';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';

/**
 * Connect, one component for both decks (RWD-02; it was Connect and MobileConnect). The section is a frame: its
 * content is the fixed contact layer and the jellyfish scene. On the desktop deck it is a pinned page of the scrolled
 * deck (the connect timeline targets #connect-page1); on the phone deck a full-height panel shown while current.
 */
export default function Connect() {
  const phone = useDeviceProfile()?.tree === 'phone';
  const current = useAtomValue(mobileCurrentPageAtom);

  return (
    <div
      id={NAV.connect_page.id}
      className={clsx(
        phone ? 'relative h-svh overflow-hidden' : 'page-container connect',
        phone && current.id !== NAV.connect_page.id && 'hidden',
      )}
    >
      {!phone && <div id="connect-page1" className="-z-10 h-screen w-screen" />}
    </div>
  );
}
