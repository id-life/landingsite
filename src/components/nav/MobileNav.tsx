'use client';

import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { mobileNavOpenAtom } from '@/atoms';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { globalLoadedAtom } from '@/atoms/geo';
import Logo from '@/components/nav/Logo';
import { useAtom, useAtomValue } from 'jotai';
import MobileNavDialog from '../dialog/MobileNavDialog';
import MenuOpenSVG from '../svg/MenuOpenSVG';
import { cn } from '@/utils';
import { useGA } from '@/hooks/useGA';
import { useIsMobile } from '@/hooks/useIsMobile';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';

export default function MobileNav() {
  const isMobile = useIsMobile();
  const [isSubscribeShow, setIsSubscribeShow] = useAtom(isSubscribeShowAtom);
  const [menuOpen, setMenuOpen] = useAtom(mobileNavOpenAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const isMobileCharacterRelationShow = useAtomValue(isMobileCharacterRelationShowAtom);

  const { trackEvent } = useGA();

  const onSubscribeClick = () => {
    setIsSubscribeShow((pre) => !pre);
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_LETTER,
      label: GA_EVENT_LABELS.SUBSCRIBE_LETTER.NAV,
    });
  };

  if (!globalLoaded || !isMobile) return null;

  return (
    <div
      id="nav"
      className={cn(
        'fixed left-0 top-0 z-[60] flex w-full items-center gap-15 p-10 text-foreground opacity-0 mobile:gap-0 mobile:p-5',
        isMobileCharacterRelationShow && 'character-relation-css-vars-inject z-[51] mobile:pb-0',
      )}
    >
      <Logo />
      <div className="flex h-12 flex-1 justify-end mobile:h-auto mobile:items-center">
        <div
          onClick={onSubscribeClick}
          className={cn(
            'group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 mobile:h-8 mobile:w-24 mobile:text-xs/5',
            { 'stroke-red-600 text-red-600': isSubscribeShow },
          )}
        >
          <SubscribeBorderSVG
            className={cn('absolute left-0 top-0 size-full stroke-foreground duration-300', {
              'stroke-red-600': isSubscribeShow,
            })}
          />
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
