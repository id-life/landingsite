'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { clsx } from 'clsx';
import Dialog from '../dialog';
import MenuOpenSVG from '../svg/MenuOpenSVG';
import { useAtom, useAtomValue } from 'jotai';
import LogoSVG from '@/components/svg/LogoSVG';
import { NAV_LIST } from '@/components/nav/nav';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { useNavigation } from '@/hooks/useNavigation';
import SubscribeDialog from '../dialog/SubscribeDialog';
import MobileNavDialog from '../dialog/MobileNavDialog';
import { currentPageAtom, mobileNavOpenAtom } from '@/atoms';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';

export default function Nav() {
  const currentPage = useAtomValue(currentPageAtom);
  const [open, setOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useAtom(mobileNavOpenAtom);
  const { handleNavClick } = useNavigation();
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);

  const onSubscribeClick = () => {
    if (isSubscribeShow) {
      gsap.to('.footer-box-clip', {
        x: 10,
        repeat: 5,
        yoyo: true,
        duration: 0.1,
      });
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', () => window.scrollTo({ top: 0 }));
  }, []);

  return (
    <div
      id="nav"
      className="fixed left-0 top-0 z-50 flex w-full items-center gap-15 p-10 text-foreground mobile:gap-0 mobile:p-5"
    >
      <div onClick={() => handleNavClick(NAV_LIST[0])}>
        <LogoSVG className="h-10 cursor-pointer mobile:h-5" />
      </div>
      <div className="flex gap-8 text-sm font-semibold mobile:hidden">
        {NAV_LIST.map((item) => (
          <div
            onClick={() => handleNavClick(item)}
            className={clsx('nav-item relative cursor-pointer uppercase', currentPage.id === item.id && 'nav-active')}
            key={item.id}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className="flex h-12 flex-1 justify-end mobile:h-auto mobile:items-center">
        <div
          onClick={onSubscribeClick}
          className="group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
          Subscribe
        </div>
        <div className="ml-5 hidden mobile:block" onClick={() => setMenuOpen((pre) => !pre)}>
          {menuOpen ? <MenuCloseSVG className="h-10" /> : <MenuOpenSVG className="h-10" />}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen} render={() => <SubscribeDialog handleSubmit={() => setOpen(false)} />} />
      <MobileNavDialog />
    </div>
  );
}
