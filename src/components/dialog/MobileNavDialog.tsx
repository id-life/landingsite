import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { mobileCurrentPageAtom, mobileNavOpenAtom } from '@/atoms';
import { isSubscribeShowAtom, subscribePopupAtom } from '@/atoms/footer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/utils';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import Dialog from '.';
import { NAV_LIST, NavItem } from '../nav/nav';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { SUBSCRIBE_TRIGGER } from '@/hooks/useSubscribeDialog';
import { STORAGE_KEY } from '@/constants/storage';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/analytics/track';

import BilingualText from '@/components/common/BilingualText';
const CONTENT_LINKS = [
  { href: '/about', title: 'about 关于' },
  { href: '/news', title: 'news 新闻' },
  { href: '/podcast', title: 'podcast 播客' },
];

function MobileNavDialog() {
  const [open, setOpen] = useAtom(mobileNavOpenAtom);
  const subsOpen = useAtomValue(isSubscribeShowAtom);
  const subscribePopup = useSetAtom(subscribePopupAtom);
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const isMobile = useIsMobile();
  const router = useRouter();
  const startAnim = useCallback(
    (isOpen: boolean) => {
      if (!isMobile) return;
      if (isOpen) {
        gsap.set('.mobile-nav-item', { y: 50, opacity: 0 });
        gsap.to('.mobile-nav-item', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power4.out',
          delay: -0.06,
        });
      } else {
        gsap.set('.mobile-nav-item', { y: 0 });
        gsap.to('.mobile-nav-item', { y: 50, opacity: 0, duration: 0.3, stagger: 0.1, ease: 'power4.in', delay: -0.2 });
      }
    },
    [isMobile],
  );
  const { mobileNavChange } = useMobileNavigation();
  // Navigation starts on the tap; the menu's exit animation runs at the same time. (It used to wait
  // 600 ms for the animation, and a tap during a theme transition was dropped.)
  const handleNavClick = (item: NavItem) => {
    track('nav_click', { target_section: item.id, source: 'mobile_menu' });
    startAnim(false);
    setOpen(false);
    mobileNavChange(item);
  };

  useEffect(() => {
    if (!isMobile) return;
    if (open) setTimeout(() => startAnim(open), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isMobile]);

  return (
    <Dialog
      anim="slide"
      isDismiss
      showCloseButton={false}
      overlayClassName="bg-black/60 backdrop-blur-sm"
      open={open}
      onOpenChange={setOpen}
      contentClassName="absolute left-0 top-0 w-full"
      render={({ close }) => (
        // Scrolls when nine items do not fit (short phones); items are tighter below 740 px of height.
        <div id="mobile-nav-menu" className="flex max-h-[100svh] w-full flex-col overflow-y-auto">
          <div className="flex flex-1 items-center justify-end gap-5 p-5">
            <button
              type="button"
              {...SUBSCRIBE_TRIGGER}
              aria-haspopup="dialog"
              onClick={() => {
                // One modal at a time: the menu closes, then the SUBSCRIBE dialog opens.
                close();
                subscribePopup({ type: 'open', placement: 'nav' });
              }}
              className={cn(
                'group relative flex h-10 w-33 cursor-pointer items-center justify-center text-sm font-semibold uppercase text-white duration-300 mobile:h-8 mobile:w-24 mobile:text-xs/5',
                {
                  'text-accent': subsOpen,
                },
              )}
            >
              <SubscribeBorderSVG
                className={cn('absolute left-0 top-0 size-full stroke-white duration-300', {
                  'stroke-accent': subsOpen,
                })}
              />
              Subscribe
            </button>
            <button type="button" aria-label="Close menu" onClick={close} className="flex">
              <MenuCloseSVG aria-hidden="true" className="h-10 cursor-pointer" />
            </button>
          </div>
          <nav aria-label="Sections" className="mt-16 font-menu">
            {NAV_LIST.map((item) => (
              <a
                href={item.href}
                aria-current={currentPage.id === item.id ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  handleNavClick(item);
                }}
                className={cn('flex-center mobile-nav-item relative py-6 text-white opacity-0 [@media(max-height:740px)]:py-4')}
                key={item.id}
              >
                <span className="relative w-fit text-center text-sm/3.5 font-semibold uppercase">
                  <BilingualText text={item.title} />
                  {currentPage.id === item.id && (
                    <span className="absolute -bottom-2.5 left-1/2 h-0.5 w-1/2 -translate-x-1/2 bg-white" />
                  )}
                </span>
              </a>
            ))}
            {/* The About page, the press list and the podcast, reachable from the phone (they were not in the menu). Same tab;
                Back returns to the section the visitor left. */}
            <div className="mx-auto my-2 h-px w-12 bg-white/30" />
            {CONTENT_LINKS.map((link) => (
              <a
                href={link.href}
                key={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  sessionStorage.setItem(STORAGE_KEY.MOBILE_RETURN_PAGE, currentPage.id);
                  setOpen(false);
                  router.push(link.href);
                }}
                className="flex-center mobile-nav-item relative py-6 text-white opacity-0 [@media(max-height:740px)]:py-4"
              >
                <span className="relative w-fit text-center text-sm/3.5 font-semibold uppercase">{link.title}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    />
  );
}

export default MobileNavDialog;
