'use client';

import Logo from '@/components/nav/Logo';
import { useRouter } from 'next/navigation';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { isNewsNavOpenAtom } from '@/atoms/news';
import { useAtom, useSetAtom } from 'jotai';
import { subscribePopupAtom } from '@/atoms/footer';
import { SUBSCRIBE_TRIGGER } from '@/hooks/subscribe-trigger';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// The phone menu (GSAP stagger) loads on its first open, not with the page.
const NewsNavDialog = dynamic(() => import('./NewsNavDialog'), { ssr: false });

export default function NewsHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useAtom(isNewsNavOpenAtom);
  const subscribePopup = useSetAtom(subscribePopupAtom);
  const [navWanted, setNavWanted] = useState(false);

  // The menu's code loads on its first open; set while rendering, not in an effect.
  if (menuOpen && !navWanted) setNavWanted(true);

  const handleSubscribeClick = () => subscribePopup({ type: 'toggle', placement: 'nav' });

  return (
    <div className="flex items-center justify-between py-5">
      <div onClick={() => router.replace('/')} className="cursor-pointer">
        <Logo />
      </div>
      <div className="flex items-center gap-5">
        <button
          type="button"
          {...SUBSCRIBE_TRIGGER}
          aria-haspopup="dialog"
          onClick={handleSubscribeClick}
          className="group relative flex h-10 w-34 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-accent hover:text-accent mobile:h-8 mobile:w-24 mobile:text-xs/5"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-accent" />
          Subscribe
        </button>
        <div className="hidden mobile:block" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MenuCloseSVG className="h-10" /> : <MenuOpenSVG className="h-10" />}
        </div>
      </div>
      {navWanted && <NewsNavDialog />}
    </div>
  );
}
