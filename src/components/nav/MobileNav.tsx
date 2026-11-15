'use client';

import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { mobileNavOpenAtom } from '@/atoms';
import { isSubscribeShowAtom, subscribePopupAtom } from '@/atoms/footer';
import { fadeInAnimCompletedAtom, globalLoadedAtom } from '@/atoms/geo';
import Logo from '@/components/nav/Logo';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import MobileNavDialog from '../dialog/MobileNavDialog';
import MenuOpenSVG from '../svg/MenuOpenSVG';
import { cn } from '@/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SUBSCRIBE_TRIGGER } from '@/hooks/useSubscribeDialog';

export default function MobileNav() {
  const isMobile = useIsMobile();
  const isSubscribeShow = useAtomValue(isSubscribeShowAtom);
  const subscribePopup = useSetAtom(subscribePopupAtom);
  const [menuOpen, setMenuOpen] = useAtom(mobileNavOpenAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  // Visible from state, so a remount (Back from a content page) shows the nav at once.
  const uiVisible = useAtomValue(fadeInAnimCompletedAtom);

  // Opens and closes the popup cleanly: the popup ignores presses on SUBSCRIBE triggers as "outside" presses.
  // (It used to close on mousedown and reopen on click, logging a close and a view each time.)
  const onSubscribeClick = () => subscribePopup({ type: 'toggle', placement: 'nav' });

  if (!globalLoaded || !isMobile) return null;

  return (
    <div
      id="mobile-nav"
      className={cn(
        // The bar itself lets taps through (its transparent area swallowed taps meant for the page below,
        // such as the Insights VIEW ALL); only its controls take them.
        'pointer-events-none fixed left-0 top-0 z-[60] flex w-full items-center gap-15 p-10 text-foreground mobile:gap-0 mobile:p-5',
        uiVisible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <Logo />
      <div className="flex h-12 flex-1 justify-end mobile:h-auto mobile:items-center">
        <button
          type="button"
          {...SUBSCRIBE_TRIGGER}
          aria-haspopup="dialog"
          aria-expanded={isSubscribeShow}
          onClick={onSubscribeClick}
          className={cn(
            'group pointer-events-auto relative flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 mobile:h-8 mobile:w-24 mobile:text-xs/5',
            { 'stroke-red-600 text-red-600': isSubscribeShow },
          )}
        >
          <SubscribeBorderSVG
            className={cn('absolute left-0 top-0 size-full stroke-foreground duration-300', {
              'stroke-red-600': isSubscribeShow,
            })}
          />
          Subscribe
        </button>
        <div className="ml-5 hidden mobile:block">
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMenuOpen((pre) => !pre)}
            // 40 px icon; the ::before pseudo-element extends the touch target to 48 px.
            className="pointer-events-auto relative flex before:absolute before:-inset-1 before:content-['']"
          >
            {menuOpen ? <MenuCloseSVG className="h-10" /> : <MenuOpenSVG className="h-10" />}
          </button>
        </div>
      </div>
      <MobileNavDialog />
    </div>
  );
}
