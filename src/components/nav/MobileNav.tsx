'use client';

import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { mobileCurrentPageAtom, mobileNavOpenAtom } from '@/atoms';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { globalLoadedAtom } from '@/atoms/geo';
import Logo from '@/components/nav/Logo';
import { useAtom, useAtomValue } from 'jotai';
import MobileNavDialog from '../dialog/MobileNavDialog';
import MenuOpenSVG from '../svg/MenuOpenSVG';

export default function MobileNav() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isSubscribeShowAtom);
  const [menuOpen, setMenuOpen] = useAtom(mobileNavOpenAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const onSubscribeClick = () => {
    setIsSubscribeShow((pre) => !pre);
  };

  if (!globalLoaded) return null;
  return (
    <div
      id="nav"
      className="fixed left-0 top-0 z-50 flex w-full items-center gap-15 p-10 text-foreground mobile:gap-0 mobile:p-5"
    >
      <Logo />
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
      <MobileNavDialog />
    </div>
  );
}
