import React, { useCallback, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import Dialog from '@/components/dialog';
import { useThrottle } from '@/hooks/useThrottle';
import { isPodcastNavOpenAtom } from '@/atoms/podcast';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PODCAST_NAV_LIST, PodcastNavItem } from '@/app/podcast/_components/constant';

function PodcastNavDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useAtom(isPodcastNavOpenAtom);

  const search = useMemo(
    () => (pathname === '/podcast' ? (searchParams.get('c') ?? PODCAST_NAV_LIST[0].id) : null),
    [pathname, searchParams],
  );

  const startAnim = useCallback((isOpen: boolean) => {
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
  }, []);

  const handleNavClick = useThrottle((item: PodcastNavItem) => {
    startAnim(false);
    setTimeout(() => {
      setOpen(false);
      router.push('/podcast?c=' + item.id);
    }, 600);
  }, 1000);

  useEffect(() => {
    if (open) setTimeout(() => startAnim(open), 300);
  }, [open, startAnim]);

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
            <MenuCloseSVG className="h-10 cursor-pointer" onClick={close} />
          </div>
          <div className="mt-16 font-tt">
            {PODCAST_NAV_LIST.map((item) => (
              <div
                onClick={() => handleNavClick(item)}
                className={cn('flex-center mobile-nav-item relative py-6 text-white opacity-0')}
                key={item.id}
              >
                <div className="relative w-fit text-center text-sm/3.5 font-semibold uppercase">
                  {item.title}
                  {search === item.id && (
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

export default React.memo(PodcastNavDialog);
