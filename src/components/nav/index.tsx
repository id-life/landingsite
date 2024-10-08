'use client';

import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { currentPageAtom, mobileNavOpenAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useNavigation } from '@/hooks/useNavigation';
import { clsx } from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import Dialog from '../dialog';
import MobileNavDialog from '../dialog/MobileNavDialog';
import SubscribeDialog from '../dialog/SubscribeDialog';
import MenuOpenSVG from '../svg/MenuOpenSVG';

export default function Nav() {
  const currentPage = useAtomValue(currentPageAtom);
  const [open, setOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useAtom(mobileNavOpenAtom);

  const { handleNavClick } = useNavigation();

  return (
    <div
      id="nav"
      className="fixed left-0 top-0 z-50 flex w-full items-center gap-15 bg-nav p-11 text-foreground mobile:gap-0 mobile:p-5"
    >
      <img
        className="h-12 cursor-pointer mobile:h-6"
        src="/svgs/logo-title.svg"
        alt="logo"
        loading="lazy"
        onClick={() => handleNavClick(NAV_LIST[0])}
      />
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
          onClick={() => setOpen(!open)}
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
