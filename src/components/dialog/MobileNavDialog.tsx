import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { mobileCurrentPageAtom, mobileNavOpenAtom } from '@/atoms';
import { isSubscribeShowAtom } from '@/atoms/footer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useThrottle } from '@/hooks/useThrottle';
import { cn } from '@/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import Dialog from '.';
import { NAV_LIST, NavItem } from '../nav/nav';
import { isMobileCharacterRelationShowAtom } from '@/atoms/character-relation';

gsap.registerPlugin(useGSAP);

function MobileNavDialog() {
  const [open, setOpen] = useAtom(mobileNavOpenAtom);
  const [subsOpen, setSubsOpen] = useAtom(isSubscribeShowAtom);
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const setMobileCharacterRelationShow = useSetAtom(isMobileCharacterRelationShowAtom);
  const isMobile = useIsMobile();
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

  const handleNavClick = useThrottle((item: NavItem) => {
    startAnim(false);
    setMobileCharacterRelationShow(false);
    setTimeout(() => {
      setOpen(false);
      setCurrentPage(item);
    }, 600);
  }, 1000);

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
        <div className="flex w-full flex-col">
          <div className="flex flex-1 items-center justify-end gap-5 p-5">
            <div
              onClick={() => {
                setSubsOpen(!subsOpen);
              }}
              className={cn(
                'group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase text-white duration-300 mobile:h-8 mobile:w-24 mobile:text-xs/5',
                {
                  'text-red-600': subsOpen,
                },
              )}
            >
              <SubscribeBorderSVG
                className={cn('absolute left-0 top-0 size-full stroke-white duration-300', {
                  'stroke-red-600': subsOpen,
                })}
              />
              Subscribe
            </div>
            <MenuCloseSVG className="h-10 cursor-pointer" onClick={close} />
          </div>
          <div className="mt-16 font-tt">
            {NAV_LIST.map((item) => (
              <div
                onClick={() => handleNavClick(item)}
                className={cn('flex-center mobile-nav-item relative py-6 text-white opacity-0')}
                key={item.id}
              >
                <div className="relative w-fit text-center text-sm/3.5 font-semibold uppercase">
                  {item.title}
                  {currentPage.id === item.id && (
                    <div className="absolute -bottom-2.5 left-1/2 h-0.5 w-1/2 -translate-x-1/2 bg-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}

export default MobileNavDialog;
