'use client';

import { useMemo } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useAtom, useSetAtom } from 'jotai';
import LogoSVGen from '@/components/svg/LogoSVGen';
import MenuOpenSVG from '@/components/svg/MenuOpenSVG';
import { isPodcastNavOpenAtom } from '@/atoms/podcast';
import { useSearchParams, usePathname } from 'next/navigation';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import PodcastNavDialog from '@/app/podcast/_components/PodcastNavDialog';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { trackEvent } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { isSubscribeShowAtom, subscribeTypeAtom } from '@/atoms/footer';

export default function PodcastHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useAtom(isPodcastNavOpenAtom);
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);
  const setSubscribeType = useSetAtom(subscribeTypeAtom);

  const search = useMemo(
    () => (pathname === '/podcast' ? (searchParams.get('c') ?? PODCAST_NAV_LIST[0].id) : null),
    [pathname, searchParams],
  );

  const handleLogoClick = () => {
    trackEvent({ name: GA_EVENT_NAMES.ID_HOME_REDIRECT });
    window.open('/', '_blank');
  };

  const handleSubscribeClick = () => {
    setIsSubscribeShow(true);
    setSubscribeType('footer');
    trackEvent({
      name: GA_EVENT_NAMES.SUBSCRIBE_SHOW,
      label: GA_EVENT_LABELS.SUBSCRIBE_SHOW.FOOTER,
    });
  };

  return (
    <div className="relative flex items-center justify-between py-10 mobile:py-5">
      <div className="flex items-center gap-8">
        {/* Logo - Left */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <LogoSVGen className="w-50 mobile:w-[10.625rem]" />
        </div>

        {/* Tabs - Center (Desktop only) */}
        <div className="flex gap-8 text-sm font-bold mobile:hidden">
          {PODCAST_NAV_LIST.map((item) => (
            <Link href={item.link} key={item.id}>
              <div
                className={clsx(
                  'nav-item bilingual-font relative cursor-pointer whitespace-nowrap text-center uppercase',
                  search === item.id && 'nav-active',
                )}
              >
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Subscribe + Menu - Right */}
      <div className="flex-center gap-5">
        <div
          onClick={handleSubscribeClick}
          className="group relative flex h-10 w-34 cursor-pointer items-center justify-center text-sm font-semibold uppercase tracking-[0.1em] duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5 mobile:tracking-normal"
        >
          <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
          Subscribe
        </div>
        <div className="hidden mobile:block" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MenuCloseSVG className="h-10" /> : <MenuOpenSVG className="h-10" />}
        </div>
      </div>
      <PodcastNavDialog />
    </div>
  );
}
